"use client";

import dynamic from "next/dynamic";

export type EntryPoint = {
  name: string;
  location: string;
  type: "Air" | "Land" | "Sea";
  lat: number;
  lng: number;
};

const KenyaEntryMapInner = dynamic(
  () => import("./KenyaEntryMapInner").then((m) => m.KenyaEntryMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 w-full items-center justify-center bg-[#091527] text-xs text-slate-300 sm:h-64 lg:h-[300px]">
        Loading entry map...
      </div>
    ),
  }
);

export function KenyaEntryMap({ entryPoints }: { entryPoints: EntryPoint[] }) {
  return <KenyaEntryMapInner entryPoints={entryPoints} />;
}
