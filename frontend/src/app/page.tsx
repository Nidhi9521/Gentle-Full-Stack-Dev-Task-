"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Home() {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const [items, setItems] = useState<any>([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [openDetail, setDetail] = useState<any>(null);
  // filter chips (All / Pinned / Gainers /Losers)
  const [filterChip, setFilterChip] = useState<string>("all");

  useEffect(() => {
    let timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/instruments?${query && `q=${query}&`}${filterChip && `filterchip=${filterChip}`}`,
        );
        const data = await res.json();
        setItems(data.data);
        setError(null);
      } catch (e) {
        setError("Failed to load instruments");
      }
      setLoading(false);
    }, 3000);
  }, [query, filterChip]);

  // Poll for live prices every 15s
  const refetch = useCallback(async () => {
    const res = await fetch(
      `${API}/instruments?${query && `q=${query}&`}${filterChip && `filterchip=${filterChip}`}`,
    );
    const data = await res.json();
    setItems(data.items);
  }, [query, filterChip]);

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
          <div className="iconbtn" title="refresh" onClick={() => refetch()}>
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
          <span
            className="chip on"
            onClick={() => {
              setFilterChip("all");
            }}
          >
            All
          </span>
          <span
            className="chip"
            onClick={() => {
              setFilterChip("pinned");
            }}
          >
            Pinned
          </span>
          <span className="chip" onClick={() => setFilterChip("gainers")}>
            Gainers
          </span>
          <span className="chip" onClick={() => setFilterChip("losers")}>
            Losers
          </span>
        </div>
        {items?.map((item: any, index: any) => (
          <div
            className="row"
            key={index}
            onClick={() => {
              setDetail(item);
            }}
          >
            <div className="logo color:#e8b84b">{item.symbol}</div>
            <div className="flex:1">
              <div className="nm">{item.name}</div>
              <div className="sym">{item.symbol}</div>
            </div>
            <div>
              <div className="pr"> {formatINR(item.current_price)}</div>
              <div
                className={`chg ${item.price_change_24h_percentage >= 0 ? "up" : "dn"}`}
              >
                {item.price_change_24h_percentage >= 0 ? "▲" : "▼"}{" "}
                {item.price_change_24h_percentage}%
              </div>
            </div>
            <span className="star fav">★</span>
          </div>
        ))}
      </div>
      {openDetail && (
        <div className="phone">
          <div className="glow background:#1d9e75;top:-80px;left:-80px"></div>
          <div className="display:flex;align-items:center;gap:12px;position:relative">
            <div className="logo width:48px;height:48px;color:#e8b84b">₿</div>
            <div>
              <div className="nm font-size:17px">{openDetail?.name}</div>
              <div className="sym">{openDetail?.symbol}</div>
            </div>
            <div className="badge">
              {openDetail?.price_change_24h_percentage}
            </div>
          </div>
          <div className="bigprice">{openDetail.current_price}</div>
          <div className="font-size:12px;color:var(--mut)">
            ≈ {openDetail.high_24h} · updated moments ago
          </div>

          <svg viewBox="0 0 280 100" className="width:100%;margin:14px 0 0">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1d9e75" stop-opacity=".28" />
                <stop offset="100%" stop-color="#1d9e75" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M5 78 L40 66 L75 72 L110 50 L145 58 L180 34 L215 42 L250 22 L275 14 L275 100 L5 100 Z"
              fill="url(#g)"
            />
            <path
              d="M5 78 L40 66 L75 72 L110 50 L145 58 L180 34 L215 42 L250 22 L275 14"
              fill="none"
              stroke="#4dd39f"
              stroke-width="2.6"
              stroke-linecap="round"
            />
            <circle cx="275" cy="14" r="4" fill="#4dd39f" />
          </svg>

          <div className="stats">
            <div className="stat">
              <div className="l">24H HIGH</div>
              <div className="v">{openDetail?.high_24h}</div>
            </div>
            <div className="stat">
              <div className="l">24H LOW</div>
              <div className="v">{openDetail?.low_24h}</div>
            </div>
            <div className="stat">
              <div className="l">MKT CAP</div>
              <div className="v">{openDetail?.market_cap}</div>
            </div>
          </div>

          <input
            className="search margin:0 0 6px"
            placeholder="₹ amount · min 100"
          />
          <div className="units">≈ {openDetail?.circulating_supply} BTC</div>
          <button className="invest">Invest now</button>
        </div>
      )}
    </main>
  );
}
