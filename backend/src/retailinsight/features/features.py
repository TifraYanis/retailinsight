import pandas as pd

def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["dow"] = df["date"].dt.dayofweek
    df["week"] = df["date"].dt.isocalendar().week.astype(int)
    df["month"] = df["date"].dt.month
    df["is_weekend"] = (df["dow"] >= 5).astype(int)
    return df

def summarize_kpi(df: pd.DataFrame) -> dict:
    total_sales = int(df["sales"].sum())
    avg_ticket = float((df["sales"] * df["price"]).sum() / max(df["sales"].sum(), 1))
    promo_ratio = float(df["promo"].mean())
    trend_last30 = float(df.set_index("date")["sales"].tail(30).mean() - df.set_index("date")["sales"].tail(60).head(30).mean())
    return {
        "total_sales": total_sales,
        "avg_ticket": round(avg_ticket,2),
        "promo_ratio": round(promo_ratio,3),
        "trend_last30": round(trend_last30,2)
    }
