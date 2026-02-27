"""
Shared utilities: JSON safety, in-memory stores, dataset loading.
"""

import os
import glob
import numpy as np
import pandas as pd
from datetime import datetime
from fastapi import HTTPException
from config import logger, UPLOAD_DIR

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory stores
models_store: dict = {}
datasets_store: dict = {}


def to_json_safe(obj):
    """Recursively convert NaN/Inf/-Inf to None for JSON compliance."""
    try:
        if obj is None:
            return None
        if isinstance(obj, (float, np.floating)):
            if np.isnan(obj) or np.isinf(obj):
                return None
            return float(obj)
        if isinstance(obj, dict):
            return {k: to_json_safe(v) for k, v in obj.items()}
        if isinstance(obj, (list, tuple, np.ndarray, pd.Index, pd.Series)):
            if hasattr(obj, "tolist"):
                return [to_json_safe(i) for i in obj.tolist()]
            return [to_json_safe(i) for i in obj]
        if isinstance(obj, (int, np.integer)):
            return int(obj)
        if pd.isna(obj):
            return None
    except (TypeError, ValueError):
        pass
    return obj


def load_dataset(dataset_id):
    """Load dataset from memory or disk. Returns (df, filename)."""
    sid = str(dataset_id)

    # 1. Check memory
    if sid in datasets_store:
        return datasets_store[sid]["df"].copy(), datasets_store[sid]["filename"]

    # 2. Try reload from disk (CSV)
    possible_file = os.path.join(UPLOAD_DIR, f"{sid}.csv")
    if os.path.exists(possible_file):
        try:
            df = pd.read_csv(possible_file)
            filename = f"reloaded_{sid}.csv"
            datasets_store[sid] = {
                "df": df,
                "filename": filename,
                "name": filename,
                "uploaded_at": datetime.now().isoformat(),
                "rows": len(df),
                "columns": len(df.columns),
            }
            logger.info(f"Restored dataset {sid} from disk")
            return df.copy(), filename
        except Exception as e:
            logger.warning(f"Failed to restore {sid} from disk: {str(e)}")

    # 3. Search for any matching file
    files = glob.glob(os.path.join(UPLOAD_DIR, f"{sid}.*"))
    if files:
        target = files[0]
        try:
            if target.endswith(".csv"):
                df = pd.read_csv(target)
            else:
                df = pd.read_excel(target)
            filename = os.path.basename(target)
            datasets_store[sid] = {
                "df": df,
                "filename": filename,
                "name": filename,
                "uploaded_at": datetime.now().isoformat(),
                "rows": len(df),
                "columns": len(df.columns),
            }
            return df.copy(), filename
        except Exception:
            pass

    # 4. Not found
    logger.error(f"Dataset {sid} not found. Known IDs: {list(datasets_store.keys())}")
    raise HTTPException(
        status_code=404,
        detail=f"Dataset {sid} non trouve - Veuillez re-uploader le fichier.",
    )
