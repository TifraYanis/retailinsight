'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const StoreMap = dynamic(() => import('../../components/StoreMap'), { ssr: false });
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type StorePoint = { store_id:number; name:string; lat:number; lon:number; total_sales:number; trend_30:number };

export default function MapPage() {
  const [item, setItem] = useState<number | null>(null);
  const [data, setData] = useState<StorePoint[]>([]);

  useEffect(() => {
    const q = item ? `?item_id=${item}` : '';
    fetch(`${API}/stores${q}`).then(r => r.json()).then(setData);
  }, [item]);

  return (
    <div className="space-y-4">
      <div className="card flex items-center gap-3">
        <div className="subtle">Item</div>
        <select className="select" value={item ?? ''} onChange={e => setItem(e.target.value ? parseInt(e.target.value) : null)}>
          <option value="">All</option>
          {[1,2,3,4].map(i => <option key={i} value={i}>Item {i}</option>)}
        </select>
      </div>
      <StoreMap data={data} />
    </div>
  );
}
