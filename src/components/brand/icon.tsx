import {
  Activity,
  Building2,
  Gauge,
  Headphones,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Leaf,
  Laptop,
  LifeBuoy,
  Network,
  Printer,
  Rocket,
  ScanText,
  ShoppingBag,
  Truck,
  UserCog,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/lib/content/types";

const icons: Record<IconName, LucideIcon> = {
  gauge: Gauge,
  activity: Activity,
  "user-cog": UserCog,
  network: Network,
  printer: Printer,
  laptop: Laptop,
  scan: ScanText,
  rocket: Rocket,
  "life-buoy": LifeBuoy,
  "graduation-cap": GraduationCap,
  landmark: Landmark,
  truck: Truck,
  "shopping-bag": ShoppingBag,
  building: Building2,
  video: Video,
  headphones: Headphones,
  wrench: Wrench,
  dashboard: LayoutDashboard,
  leaf: Leaf,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = icons[name];
  return <Cmp aria-hidden className={className} strokeWidth={1.8} />;
}
