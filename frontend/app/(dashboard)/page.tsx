'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Percent, Receipt, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Sale = { date: string; sales: number; price: number; promo: number; holiday: number; store_id: number; item_id: number; };
type KPI = { total_sales: number; avg_ticket: number; promo_ratio: number; trend_last30: number };
type ForecastPoint = { date: string; yhat: number; yhat_lo: number; yhat_hi: number };

export default function Dashboard() {
  const [store, setStore] = useState<number>(101);
  const [item, setItem] = useState<number>(1);
  const [sales, setSales] = useState<Sale[]>([]);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);

  useEffect(() => {
    fetch(`${API}/sales?store_id=${store}&item_id=${item}&limit=365`).then(r => r.json()).then(setSales);
    fetch(`${API}/kpis?store_id=${store}&item_id=${item}`).then(r => r.json()).then(setKpi);
    fetch(`${API}/forecast?store_id=${store}&item_id=${item}&steps=60`).then(r => r.json()).then(setForecast);
  }, [store, item]);

  const lastDate = sales.length ? sales[sales.length - 1].date : 'n/a';

  return (
    <div className="space-y-6">
      {/* Controls */}
      <section className="card flex flex-wrap items-center gap-3">
        <div className="subtle text-sm">Filters</div>
        <div className="flex items-center gap-2">
          <label className="subtle text-sm">Store</label>
          <select value={store} onChange={e => setStore(parseInt(e.target.value))} className="select">
            {[101,102,103].map(s => <option key={s} value={s}>Store {s}</option>)}
          </select>
          <label className="subtle text-sm">Item</label>
          <select value={item} onChange={e => setItem(parseInt(e.target.value))} className="select">
            {[1,2,3,4].map(i => <option key={i} value={i}>Item {i}</option>)}
          </select>
        </div>
        <div className="ml-auto subtle text-sm">Last date: {lastDate}</div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-500 grid place-items-center">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h4>Total sales</h4>
            <div className="value">{kpi?.total_sales?.toLocaleString() ?? '-'}</div>
          </div>
        </div>
        <div className="kpi">
          <div className="h-10 w-10 rounded-xl bg-sky-500/15 text-sky-500 grid place-items-center">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h4>Avg ticket</h4>
            <div className="value">{kpi?.avg_ticket?.toFixed(2) ?? '-'}</div>
          </div>
        </div>
        <div className="kpi">
          <div className="h-10 w-10 rounded-xl bg-violet-500/15 text-violet-500 grid place-items-center">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <h4>Promo ratio</h4>
            <div className="value">{kpi ? Math.round(kpi.promo_ratio * 100) + '%' : '-'}</div>
          </div>
        </div>
        <div className="kpi">
          <div
            className={clsx(
              "h-10 w-10 rounded-xl grid place-items-center",
              (kpi?.trend_last30 ?? 0) >= 0
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-rose-500/15 text-rose-500"
            )}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4>Trend last 30 days</h4>
            <div
              className={clsx("value",
                (kpi?.trend_last30 ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500")}
            >
              {(kpi?.trend_last30 ?? 0).toFixed(1)}
            </div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="insights">
        <div className="card lg:col-span-2">
          <div className="mb-2 subtle">Historical sales</div>
          <ResponsiveContainer width="100%" height={330}>
            <AreaChart data={sales}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip contentStyle={{ background: 'var(--tw-bg-opacity, 1) #fff', border: '1px solid #e2e8f0' }}
                       wrapperStyle={{ zIndex: 50 }}
              />
              <Area type="monotone" dataKey="sales" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#gSales)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" id="forecast">
          <div className="mb-2 subtle">Forecast 60 days</div>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip contentStyle={{ background: 'var(--tw-bg-opacity, 1) #fff', border: '1px solid #e2e8f0' }}
                       wrapperStyle={{ zIndex: 50 }}
              />
              <Line type="monotone" dataKey="yhat" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
