'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Insight = {
  top_stores: { store_id:number; total_sales:number }[];
  top_items: { item_id:number; total_sales:number }[];
  price_sales_corr: number;
  promo_uplift: number;
  by_month: { month:string; sales:number }[];
};

export default function InsightsPage() {
  const [store, setStore] = useState<number | null>(null);
  const [item, setItem] = useState<number | null>(null);
  const [ins, setIns] = useState<Insight | null>(null);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (store) qs.append('store_id', String(store));
    if (item) qs.append('item_id', String(item));
    fetch(`${API}/insights?${qs.toString()}`).then(r => r.json()).then(setIns);
  }, [store, item]);

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center gap-3">
        <div className="subtle">Filters</div>
        <label className="subtle text-sm">Store</label>
        <select className="select" value={store ?? ''} onChange={e => setStore(e.target.value ? parseInt(e.target.value) : null)}>
          <option value="">All</option>
          {[101,102,103].map(s => <option key={s} value={s}>Store {s}</option>)}
        </select>

        <label className="subtle text-sm">Item</label>
        <select className="select" value={item ?? ''} onChange={e => setItem(e.target.value ? parseInt(e.target.value) : null)}>
          <option value="">All</option>
          {[1,2,3,4].map(i => <option key={i} value={i}>Item {i}</option>)}
        </select>
      </div>

      {/* KPI mini-cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card"><div className="subtle">Price ↔ Sales corr</div><div className="text-2xl font-semibold">{ins?.price_sales_corr?.toFixed(3) ?? '-'}</div></div>
        <div className="card"><div className="subtle">Promo uplift</div><div className="text-2xl font-semibold">{ins ? ins.promo_uplift.toFixed(1) : '-'}</div></div>
        <div className="card"><div className="subtle">Top store sales</div><div className="text-2xl font-semibold">{ins?.top_stores?.[0]?.total_sales?.toLocaleString?.() ?? '-'}</div></div>
        <div className="card"><div className="subtle">Top item sales</div><div className="text-2xl font-semibold">{ins?.top_items?.[0]?.total_sales?.toLocaleString?.() ?? '-'}</div></div>
      </div>

      {/* Top stores & items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="mb-2 subtle">Top stores</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ins?.top_stores || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="store_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="mb-2 subtle">Top items</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ins?.top_items || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly curve */}
      <div className="card">
        <div className="mb-2 subtle">Monthly sales</div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={ins?.by_month || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
