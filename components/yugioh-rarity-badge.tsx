"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RarityType } from "@/types/yugiohCard";
import { Crown, Diamond, Sparkles, Star } from "lucide-react";
import { JSX } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Group rarities by color/style categories
const rarityConfig: Record<
  RarityType,
  {
    color: string;
    background: string;
    border: string;
    icon?: JSX.Element;
    glow?: boolean;
  }
> = {
  // Ultra Rare / Premium Rarities (Gold/Yellow)
  UR: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-300 to-yellow-200",
    border: "border-amber-500",
    icon: <Star className="h-3 w-3 fill-amber-500" />,
  },
  GUR: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-400 to-yellow-300",
    border: "border-amber-600",
    icon: <Crown className="h-3 w-3 fill-amber-600" />,
    glow: true,
  },
  UPR: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-300 to-yellow-200",
    border: "border-amber-500",
    icon: <Star className="h-3 w-3 fill-amber-500" />,
  },
  UtR: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-300 to-yellow-200",
    border: "border-amber-500",
    icon: <Star className="h-3 w-3 fill-amber-500" />,
  },

  // Secret Rare Variants (Rainbow/Holographic)
  ScR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200",
    border: "border-purple-400",
    icon: <Sparkles className="h-3 w-3 fill-purple-400" />,
    glow: true,
  },
  PScR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300",
    border: "border-purple-500",
    icon: <Sparkles className="h-3 w-3 fill-purple-500" />,
    glow: true,
  },
  UScR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300",
    border: "border-purple-500",
    icon: <Sparkles className="h-3 w-3 fill-purple-500" />,
    glow: true,
  },
  "10000ScR": {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400",
    border: "border-purple-600",
    icon: <Crown className="h-3 w-3 fill-purple-600" />,
    glow: true,
  },
  GScR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-purple-300 via-amber-300 to-blue-300",
    border: "border-amber-500",
    icon: <Sparkles className="h-3 w-3 fill-amber-500" />,
    glow: true,
  },

  // Super Rare Variants (Silver/Metallic)
  SR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-200 to-gray-100",
    border: "border-slate-400",
    icon: <Star className="h-3 w-3 fill-slate-400" />,
  },
  SPR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-300 to-gray-200",
    border: "border-slate-500",
    icon: <Star className="h-3 w-3 fill-slate-500" />,
  },
  DSPR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-300 to-gray-200",
    border: "border-slate-500",
    icon: <Star className="h-3 w-3 fill-slate-500" />,
  },
  SHR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-300 to-gray-200",
    border: "border-slate-500",
    icon: <Star className="h-3 w-3 fill-slate-500" />,
  },
  SP: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-300 to-gray-200",
    border: "border-slate-500",
    icon: <Star className="h-3 w-3 fill-slate-500" />,
  },
  MSR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-slate-300 to-gray-200",
    border: "border-slate-500",
    icon: <Star className="h-3 w-3 fill-slate-500" />,
  },

  // Premium Gold/Starlight Variants
  PG: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-400 to-yellow-300",
    border: "border-amber-600",
    icon: <Crown className="h-3 w-3 fill-amber-600" />,
    glow: true,
  },
  StR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300",
    border: "border-indigo-500",
    icon: <Sparkles className="h-3 w-3 fill-indigo-500" />,
    glow: true,
  },
  SSP: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300",
    border: "border-indigo-500",
    icon: <Sparkles className="h-3 w-3 fill-indigo-500" />,
    glow: true,
  },
  GGR: {
    color: "text-amber-900",
    background: "bg-gradient-to-r from-amber-400 to-yellow-300",
    border: "border-amber-600",
    icon: <Crown className="h-3 w-3 fill-amber-600" />,
    glow: true,
  },

  // Rare
  R: {
    color: "text-slate-900",
    background: "bg-slate-100",
    border: "border-slate-300",
  },
  GR: {
    color: "text-amber-900",
    background: "bg-amber-100",
    border: "border-amber-300",
    icon: <Star className="h-3 w-3 fill-amber-400" />,
  },

  // Common
  C: {
    color: "text-slate-900",
    background: "bg-white",
    border: "border-slate-200",
  },

  // Special Variants
  SFR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-blue-200 to-cyan-100",
    border: "border-blue-400",
    icon: <Diamond className="h-3 w-3 fill-blue-400" />,
  },
  DUPR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-violet-200 to-fuchsia-100",
    border: "border-violet-400",
    icon: <Diamond className="h-3 w-3 fill-violet-400" />,
  },
  DNPR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-blue-200 to-indigo-100",
    border: "border-blue-400",
    icon: <Diamond className="h-3 w-3 fill-blue-400" />,
  },
  PIR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-pink-200 to-rose-100",
    border: "border-pink-400",
    icon: <Diamond className="h-3 w-3 fill-pink-400" />,
  },
  PS: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-emerald-200 to-green-100",
    border: "border-emerald-400",
    icon: <Diamond className="h-3 w-3 fill-emerald-400" />,
  },
  CR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-cyan-200 to-sky-100",
    border: "border-cyan-400",
    icon: <Diamond className="h-3 w-3 fill-cyan-400" />,
  },
  QCSE: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-teal-200 to-emerald-100",
    border: "border-teal-400",
    icon: <Diamond className="h-3 w-3 fill-teal-400" />,
  },
  DRPR: {
    color: "text-slate-900",
    background: "bg-gradient-to-r from-red-200 to-orange-100",
    border: "border-red-400",
    icon: <Diamond className="h-3 w-3 fill-red-400" />,
  },
};

interface YuGiOhRarityBadgeProps {
  rarityCode: RarityType;
  rarity: string;
  className?: string;
}

export function YuGiOhRarityBadge({
  rarityCode,
  className,
  rarity,
}: YuGiOhRarityBadgeProps) {
  const config = rarityConfig[rarityCode];

  if (!config) {
    return <Badge variant="outline">{rarityCode}</Badge>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            className={cn(
              config.color,
              config.background,
              `border ${config.border}`,
              config.glow && "shadow-sm",
              "font-bold flex items-center gap-1",
              className
            )}
          >
            {config.icon}
            {rarityCode}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{rarity}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
