"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@job-portal/ui";

export function JobSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  return (
    <form
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.set("q", keyword);
        if (location) params.set("location", location);
        router.push(`/jobs?${params.toString()}`);
      }}
    >
      <input
        className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600"
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Vị trí, kỹ năng, công ty"
        value={keyword}
      />
      <input
        className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-600"
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Thành phố hoặc remote"
        value={location}
      />
      <Button type="submit">
        <Search aria-hidden size={16} />
        Tìm kiếm
      </Button>
    </form>
  );
}

