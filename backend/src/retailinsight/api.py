from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import pandas as pd
from pydantic import BaseModel

from retailinsight.pipeline import load_sales, filter_slice, load_stores, compute_insights, store_performance
from retailinsight.features.features import add_time_features, summarize_kpi
from retailinsight.models.sarimax import fit_sarimax, forecast


app = FastAPI(title="RetailInsight API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastOut(BaseModel):
    date: str
    yhat: float
    yhat_lo: float
    yhat_hi: float

@app.get("/kpis")
def kpis(store_id: Optional[int] = None, item_id: Optional[int] = None):
    df = load_sales()
    df = filter_slice(df, store_id, item_id)
    df = add_time_features(df)
    return summarize_kpi(df)

@app.get("/sales")
def sales(store_id: Optional[int] = None, item_id: Optional[int] = None, limit: int = 365):
    df = load_sales()
    df = filter_slice(df, store_id, item_id)
    df = df.tail(limit)
    return df.to_dict(orient="records")

@app.get("/forecast", response_model=List[ForecastOut])
def forecast_endpoint(store_id: Optional[int] = None, item_id: Optional[int] = None, steps: int = 30):
    df = load_sales()
    df = filter_slice(df, store_id, item_id)
    if len(df) < 30:
        return []
    model = fit_sarimax(df)
    fc = forecast(model, steps=steps)
    fc["date"] = pd.to_datetime(fc["date"]).dt.strftime("%Y-%m-%d")
    return fc.to_dict(orient="records")

@app.get("/insights")
def insights(store_id: Optional[int] = None, item_id: Optional[int] = None):
    df = load_sales()
    df = filter_slice(df, store_id, item_id)
    return compute_insights(df)

@app.get("/stores")
def stores(item_id: Optional[int] = None):
    df = load_sales()
    if item_id is not None:
        df = df[df["item_id"] == item_id]
    perf = store_performance(df)
    geo = load_stores()
    out = geo.merge(perf, on="store_id", how="left").fillna(0)
    return out.to_dict(orient="records")
