"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const query = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)";
const PointerEffects = dynamic(() => import("./PointerEffects").then(module => module.PointerEffects), { ssr: false });
function subscribe(notify: () => void) {
  const preference = matchMedia(query);
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
}
const snapshot = () => matchMedia(query).matches;
const serverSnapshot = () => false;

export function PointerEffectsGate() {
  const enabled = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return enabled ? <PointerEffects /> : null;
}
