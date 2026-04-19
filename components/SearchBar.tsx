"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search albums or artists..."
      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-slate-100 placeholder-slate-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-900 transition shadow-sm text-base"
    />
  );
}
