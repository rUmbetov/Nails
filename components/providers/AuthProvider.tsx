"use client";

import { Viewer } from "@/types/viewer";
import React, { createContext, useContext } from "react";

const ViewerContext = createContext<Viewer | null>(null);

export function AuthProvider({
  viewer,
  children,
}: {
  viewer: Viewer | null;
  children: React.ReactNode;
}) {
  return (
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
  );
}

export function useViewer() {
  return useContext(ViewerContext);
}

export function useRole() {
  return useContext(ViewerContext)?.role ?? null;
}
