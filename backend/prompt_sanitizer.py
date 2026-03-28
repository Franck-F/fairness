"""
Prompt sanitization module for AuditIQ.
Prevents prompt injection attacks in LLM inputs.
"""

import re

INJECTION_PATTERNS = [
    re.compile(r'ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)', re.IGNORECASE),
    re.compile(r'you\s+are\s+now\s+', re.IGNORECASE),
    re.compile(r'forget\s+(all\s+)?(previous|your)\s+(instructions|rules)', re.IGNORECASE),
    re.compile(r'system\s*:\s*', re.IGNORECASE),
    re.compile(r'\[INST\]', re.IGNORECASE),
    re.compile(r'\[/INST\]', re.IGNORECASE),
    re.compile(r'<\|im_start\|>', re.IGNORECASE),
    re.compile(r'<\|im_end\|>', re.IGNORECASE),
    re.compile(r'\bDAN\b.*\bmode\b', re.IGNORECASE),
    re.compile(r'jailbreak', re.IGNORECASE),
    re.compile(r'reveal\s+(your|the)\s+(system|internal|original)\s+(prompt|instructions)', re.IGNORECASE),
    re.compile(r'```.*system', re.IGNORECASE | re.DOTALL),
]


def sanitize_for_prompt(text: str, max_length: int = 5000) -> str:
    """Sanitize user-provided text before including in LLM prompts."""
    if not isinstance(text, str):
        return str(text) if text is not None else ""

    sanitized = text

    # Truncate
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length] + "... [tronque]"

    # Remove control characters
    sanitized = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', sanitized)

    # Escape triple backticks
    sanitized = sanitized.replace('```', "'''")

    # Neutralize injection patterns
    for pattern in INJECTION_PATTERNS:
        sanitized = pattern.sub('[contenu filtre]', sanitized)

    return sanitized.strip()


def sanitize_dataframe_for_prompt(df_preview, max_rows: int = 5) -> str:
    """Safely convert a DataFrame preview to string for LLM context."""
    if df_preview is None:
        return "Aucune donnee disponible"

    try:
        if hasattr(df_preview, 'head'):
            preview = df_preview.head(max_rows)
        elif isinstance(df_preview, list):
            preview = df_preview[:max_rows]
        else:
            preview = df_preview

        text = str(preview)
        # Limit total length of preview
        if len(text) > 2000:
            text = text[:2000] + "\n... [tronque]"

        return sanitize_for_prompt(text, max_length=2500)
    except Exception:
        return "[erreur de conversion des donnees]"


def sanitize_column_names(columns: list) -> list:
    """Sanitize column names from user CSV files."""
    sanitized = []
    for col in (columns or []):
        name = str(col)[:100]  # Limit length
        name = re.sub(r'[^\w\s\-_.]', '', name)  # Keep only safe chars
        sanitized.append(name or 'unnamed')
    return sanitized
