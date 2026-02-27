"""
Dataset upload, retrieval, and EDA endpoints.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from datetime import datetime
import pandas as pd
import numpy as np
import io
import os
import uuid

from config import logger, UPLOAD_DIR, MAX_UPLOAD_SIZE_BYTES, ALLOWED_FILE_EXTENSIONS
from schemas import DSAnalyzeRequest, DSEdaRequest
from utils import to_json_safe, datasets_store, load_dataset

router = APIRouter(prefix="/api", tags=["Datasets"])


@router.post("/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    dataset_name: str = Form(None),
    dataset_id: str = Form(None),
):
    """Upload a dataset file (CSV, Excel, JSON)."""
    logger.info(f"Upload request for dataset_id={dataset_id}, file={file.filename}")

    # Validate file extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_FILE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not supported. Allowed: {', '.join(ALLOWED_FILE_EXTENSIONS)}",
        )

    try:
        active_id = dataset_id if dataset_id else str(uuid.uuid4())
        content = await file.read()

        # Validate file size
        if len(content) > MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: {MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB",
            )

        # Save to disk
        file_ext = ".csv" if file.filename.lower().endswith(".csv") else ".xlsx"
        save_path = os.path.join(UPLOAD_DIR, f"{active_id}{file_ext}")
        with open(save_path, "wb") as f:
            f.write(content)

        # Parse file
        filename = file.filename.lower()
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(content))
        elif filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Format de fichier non supporte.")

        # Detect column types
        columns_info = []
        for col in df.columns:
            dtype = df[col].dtype
            if pd.api.types.is_numeric_dtype(dtype):
                col_type = "numerical"
            elif pd.api.types.is_datetime64_any_dtype(dtype):
                col_type = "datetime"
            elif isinstance(dtype, pd.CategoricalDtype) or (
                not pd.api.types.is_numeric_dtype(dtype) and df[col].nunique() < 20
            ):
                col_type = "categorical"
            else:
                col_type = "text"
            columns_info.append({"name": col, "type": col_type})

        # File size formatting
        file_size_bytes = len(content)
        if file_size_bytes < 1024:
            size_str = f"{file_size_bytes} B"
        elif file_size_bytes < 1024 * 1024:
            size_str = f"{file_size_bytes / 1024:.2f} KB"
        else:
            size_str = f"{file_size_bytes / (1024 * 1024):.2f} MB"

        # Data profiling
        profiling = {
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "summary_stats": (
                df.describe(include=[np.number]).to_dict()
                if not df.select_dtypes(include=[np.number]).empty
                else {}
            ),
        }

        total_missing = sum(profiling["missing_values"].values())
        total_cells = len(df) * len(df.columns)
        quality_score = max(0, 100 - (total_missing / total_cells * 100)) if total_cells > 0 else 100

        # Store in memory
        datasets_store[active_id] = {
            "df": df,
            "filename": filename,
            "name": dataset_name if dataset_name else filename,
            "uploaded_at": datetime.now().isoformat(),
            "rows": len(df),
            "columns": len(df.columns),
            "columns_info": columns_info,
            "profiling": profiling,
            "quality_score": round(quality_score, 2),
        }

        logger.info(f"Dataset {active_id} uploaded: {len(df)} rows, quality={quality_score:.1f}%")

        return to_json_safe(
            {
                "dataset_id": active_id,
                "filename": file.filename,
                "rows": len(df),
                "columns": len(df.columns),
                "columns_info": columns_info,
                "stats": {"rows": len(df), "cols": len(df.columns)},
                "profiling": profiling,
                "quality_score": round(quality_score, 2),
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/datasets/{dataset_id}")
async def get_dataset(dataset_id: str):
    """Get dataset info and preview."""
    if dataset_id not in datasets_store:
        raise HTTPException(status_code=404, detail="Dataset non trouve")

    dataset = datasets_store[dataset_id]
    df = dataset["df"]

    return {
        "dataset_id": dataset_id,
        "filename": dataset["filename"],
        "name": dataset["name"],
        "rows": dataset["rows"],
        "columns": dataset["columns"],
        "columns_info": dataset.get("columns_info", []),
        "preview": df.head(10).to_dict(orient="records"),
        "statistics": df.describe().to_dict() if not df.select_dtypes(include=[np.number]).empty else {},
    }


@router.get("/eda/{dataset_id}")
async def get_eda(dataset_id: str):
    """Get exploratory data analysis for a dataset."""
    if dataset_id not in datasets_store:
        raise HTTPException(status_code=404, detail="Dataset non trouve")

    df = datasets_store[dataset_id]["df"]

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    stats = {
        "shape": {"rows": len(df), "columns": len(df.columns)},
        "missing_values": df.isnull().sum().to_dict(),
        "missing_percentage": (df.isnull().sum() / len(df) * 100).round(2).to_dict(),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
    }

    if numeric_cols:
        stats["numeric_stats"] = df[numeric_cols].describe().to_dict()
        stats["correlations"] = df[numeric_cols].corr().round(3).to_dict()

    if categorical_cols:
        stats["categorical_stats"] = {}
        for col in categorical_cols[:10]:
            value_counts = df[col].value_counts().head(20).to_dict()
            stats["categorical_stats"][col] = {
                "unique_values": int(df[col].nunique()),
                "top_values": value_counts,
            }

    return to_json_safe(stats)
