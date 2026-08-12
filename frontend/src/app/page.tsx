"use client";

import { useState, useEffect, useMemo } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Home() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const [items, setItems] = useState<any>([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/instruments?${query && `q=${query}`}`,
        );
        const data = await res.json();
        setItems(data.data);
        setError(null);
      } catch (e) {
        setError("Failed to load instruments");
      }
      setLoading(false);
    }, 3000);
  }, [query]);

  // Poll for live prices every 15s
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`${API}/api/instruments`);
      const data = await res.json();
      setItems(data.items);
    }, 15000);
  }, []);

  const formatINR = (n: number) => n + "₹";
  if (loading) return <div className="p-8">Loading…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div className="phone">
        <div className="glow background:#7f77dd;top:-90px;right:-70px"></div>
        <div className="display:flex;justify-content:space-between;align-items:flex-end;position:relative">
          <div>
            <div className="kicker">Portfolio</div>
            <h1>watchlist</h1>
          </div>
          <div className="iconbtn" title="refresh">
            ⟳
          </div>
        </div>
        <input
          className="search"
          placeholder="Search assets"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          <span className="chip on">All</span>
          <span className="chip">Pinned</span>
          <span className="chip">Gainers</span>
          <span className="chip">Losers</span>
        </div>
        {items?.map((item: any, index: any) => (
          <div className="row" key={index}>
            <div className="logo color:#e8b84b">{item.symbol}</div>
            <div className="flex:1">
              <div className="nm">{item.name}</div>
              <div className="sym">{item.symbol}</div>
            </div>
            <div>
              <div className="pr"> {formatINR(item.current_price)}</div>
              <div className={`chg ${item.price_change_24h_percentage >= 0 ? "up" : "dn"}`}>
                {item.price_change_24h_percentage >= 0 ? "▲" : "▼"} {item.price_change_24h_percentage}%
              </div>
            </div>
            <span className="star fav">★</span>
          </div>
        ))}
      </div>
    </main>
  );
}
