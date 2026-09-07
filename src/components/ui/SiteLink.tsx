import Link from "next/link";
import type { ComponentProps } from "react";
import { DrawUnderline } from "@/components/motion/DrawUnderline";

export function SiteLink({ children, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props}>{children}<DrawUnderline /></Link>;
}
