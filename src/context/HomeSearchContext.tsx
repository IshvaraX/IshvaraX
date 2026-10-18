"use client";

import { createContext, useContext, useMemo, useState } from "react";

type HomeSearchValue = {
  query: string;
  setQuery: (q: string) => void;
};

const HomeSearchContext = createContext<HomeSearchValue | undefined>(undefined);

export function HomeSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return (
    <HomeSearchContext.Provider value={value}>
      {children}
    </HomeSearchContext.Provider>
  );
}

export function useHomeSearch() {
  const ctx = useContext(HomeSearchContext);
  if (!ctx) {
    throw new Error("useHomeSearch must be used within a HomeSearchProvider");
  }
  return ctx;
}
