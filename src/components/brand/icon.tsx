import {
  Activity,
  Building2,
  Gauge,
  GraduationCap,
  Landmark,
  LifeBuoy,
  Network,
  Printer,
  Rocket,
  ShoppingBag,
  Truck,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/lib/content/types";

const icons: Record<IconName, LucideIcon> = {
  gauge: Gauge,
  activity: Activity,
  "user-cog": UserCog,
  network: Network,
  printer: Printer,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  truck: Truck,
  "shopping-bag": ShoppingBag,
  building: Building2,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name];
  return <Cmp aria-hidden className={className} strokeWidth={1.8} />;
}
