"use client";

import { useEffect, type ReactNode } from "react";
import LearnNav from "@/component/nav/LearnNav";
import SideNav from "@/component/nav/SideNav";
import { blogsApi, learningsApi, membersApi, productsApi } from "@/lib/api";

const usePrefetchListData = () =>
  useEffect(() => {
    const run = () => {
      for (const load of [blogsApi.list, learningsApi.list, productsApi.list, membersApi.list]) {
        load().catch(() => {});
      }
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run);
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(run, 1500);
    return () => clearTimeout(id);
  }, []);

const AppShell = ({ children }: { children: ReactNode }) => {
  usePrefetchListData();
  return (
    <div className="m3-canvas min-h-screen">
      <LearnNav />
      <SideNav />
      <div className="min-w-0 lg:pl-[88px]">{children}</div>
    </div>
  );
};

export default AppShell;
