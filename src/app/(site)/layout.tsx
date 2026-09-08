import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PointerEffectsGate as PointerEffects } from "@/components/motion/PointerEffectsGate";
import { RouteTransitions } from "@/components/motion/RouteTransitions";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <MotionProvider><SiteHeader />{children}<SiteFooter /><RouteTransitions /><PointerEffects /></MotionProvider>;
}
