import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CardTypeProps = {
  cardType: string;
  className?: string;
};

type ColorScheme = {
  bg: string;
  text: string;
  border: string;
};

export function YuGiOhCardTypeBadge({ cardType, className }: CardTypeProps) {
  // Define color rules with priority (first match wins)
  const colorRules: Array<{
    keyword: string;
    colors: ColorScheme;
  }> = [
    {
      keyword: "fusion",
      colors: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-300",
      },
    },
    {
      keyword: "token",
      colors: {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-300",
      },
    },
    {
      keyword: "trap",
      colors: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
      },
    },
    {
      keyword: "spell",
      colors: {
        bg: "bg-teal-100",
        text: "text-teal-800",
        border: "border-teal-300",
      },
    },
    {
      keyword: "pendulum",
      colors: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
      },
    },
    {
      keyword: "xyz",
      colors: {
        bg: "bg-gray-200",
        text: "text-gray-800",
        border: "border-gray-400",
      },
    },
    {
      keyword: "ritual",
      colors: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
      },
    },
    {
      keyword: "synchro",
      colors: {
        bg: "bg-zinc-100",
        text: "text-zinc-600",
        border: "border-zinc-400",
      },
    },
    {
      keyword: "link",
      colors: {
        bg: "bg-sky-100",
        text: "text-sky-600",
        border: "border-sky-400",
      },
    },
    {
      keyword: "normal",
      colors: {
        bg: "bg-yellow-100",
        text: "text-amber-600",
        border: "border-amber-400",
      },
    },
  ];

  // Fallback colors (brownish orange)
  const fallbackColors: ColorScheme = {
    bg: "bg-orange-300",
    text: "text-orange-800",
    border: "border-orange-500",
  };

  // Find the first matching rule or use fallback
  const getColorScheme = (type: string): ColorScheme => {
    const lowerType = type.toLowerCase();
    const matchedRule = colorRules.find((rule) =>
      lowerType.includes(rule.keyword)
    );
    return matchedRule ? matchedRule.colors : fallbackColors;
  };

  const colors = getColorScheme(cardType);

  return (
    <Badge
      variant="outline"
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        "hover:bg-none hover:no-underline hover:opacity-100",
        className
      )}
    >
      {cardType}
    </Badge>
  );
}
