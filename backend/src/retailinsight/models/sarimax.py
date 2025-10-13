from dataclasses import dataclass
from typing import Optional
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

@dataclass
class SarimaxConfig:
    order: tuple[int,int,int] = (1,1,1)
    seasonal_order: tuple[int,int,int,int] = (1,0,1,7)

def fit_sarimax(df: pd.DataFrame, target_col: str = "sales", config: Optional[SarimaxConfig] = None):
    if config is None:
        config = SarimaxConfig()
    y = df.set_index("date")[target_col].astype(float)
    mod = SARIMAX(y, order=config.order, seasonal_order=config.seasonal_order, enforce_stationarity=False, enforce_invertibility=False)
    res = mod.fit(disp=False)
    return res

def forecast(model, steps: int = 14) -> pd.DataFrame:
    fc = model.get_forecast(steps=steps)
    pred = fc.predicted_mean
    conf = fc.conf_int(alpha=0.2)
    return pd.DataFrame({"date": pred.index, "yhat": pred.values, "yhat_lo": conf.iloc[:,0].values, "yhat_hi": conf.iloc[:,1].values})
