import pandas as pd
import io


def parse_file(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(file_bytes))
    elif filename.endswith((".xlsx", ".xls")):
        df = pd.read_excel(io.BytesIO(file_bytes))
    else:
        raise ValueError("Unsupported file type. Upload .csv or .xlsx only.")

    if df.empty:
        raise ValueError("Uploaded file is empty.")

    summary = {
        "total_rows": len(df),
        "columns": list(df.columns),
        "sample_data": df.head(20).to_dict(orient="records"),
        "numeric_summary": df.describe().to_dict(),
    }
    return str(summary)