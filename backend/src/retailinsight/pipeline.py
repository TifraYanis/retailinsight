from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "src" / "retailinsight" / "data" / "sales.csv"

def load_sales() -> pd.DataFrame:
    df = pd.read_csv(DATA, parse_dates=["date"])
    return df

def filter_slice(df: pd.DataFrame, store_id: int | None = None, item_id: int | None = None) -> pd.DataFrame:
    out = df.copy()
    if store_id is not None:
        out = out[out["store_id"] == store_id]
    if item_id is not None:
        out = out[out["item_id"] == item_id]
    out = out.sort_values("date")
    return out

def load_stores() -> pd.DataFrame:
    # Coordonnées fictives FR (tu peux ajuster)
    data = [
        {"store_id": 101, "name": "Paris - IDF",   "lat": 48.8566, "lon": 2.3522},
        {"store_id": 102, "name": "Lyon - AURA",   "lat": 45.7640, "lon": 4.8357},
        {"store_id": 103, "name": "Bordeaux - NA", "lat": 44.8378, "lon": -0.5792},
    ]
    return pd.DataFrame(data)

def month_agg(df: pd.DataFrame) -> pd.DataFrame:
    tmp = df.copy()
    tmp["month"] = tmp["date"].dt.to_period("M").astype(str)
    g = tmp.groupby("month", as_index=False)["sales"].sum()
    return g

def compute_insights(df: pd.DataFrame) -> dict:
    # Top stores
    g_store = df.groupby("store_id", as_index=False)["sales"].sum().rename(columns={"sales":"total_sales"})
    top_stores = g_store.sort_values("total_sales", ascending=False).head(5).to_dict("records")

    # Top items
    g_item = df.groupby("item_id", as_index=False)["sales"].sum().rename(columns={"sales":"total_sales"})
    top_items = g_item.sort_values("total_sales", ascending=False).head(5).to_dict("records")

    # Price ↔ sales correlation (approx. price elasticity indicator)
    corr_price = float(df[["price","sales"]].corr().iloc[0,1]) if len(df) > 2 else 0.0

    # Promo uplift
    promo_mean = df.groupby("promo")["sales"].mean()
    uplift = float(promo_mean.get(1, 0.0) - promo_mean.get(0, 0.0))

    # Monthly sales
    by_month = month_agg(df).to_dict("records")

    return {
        "top_stores": top_stores,
        "top_items": top_items,
        "price_sales_corr": round(corr_price, 3),
        "promo_uplift": round(uplift, 2),
        "by_month": by_month,
    }

def store_performance(df: pd.DataFrame) -> pd.DataFrame:
    # Trend 30j par magasin
    s = df.sort_values("date")
    last30 = s.groupby("store_id")["sales"].apply(lambda x: x.tail(30).mean() if len(x)>=30 else x.mean())
    prev30 = s.groupby("store_id")["sales"].apply(lambda x: x.tail(60).head(30).mean() if len(x)>=60 else x.head(max(len(x)-30,1)).mean())
    trend30 = (last30 - prev30).rename("trend_30")
    total = s.groupby("store_id")["sales"].sum().rename("total_sales")
    perf = pd.concat([total, trend30], axis=1).reset_index()
    return perf