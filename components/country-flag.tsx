interface CountryFlagProps {
  countryCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CountryFlag({
  countryCode,
  size = "md",
  className = "",
}: CountryFlagProps) {
  const sizeMap = {
    sm: "w-4 h-3",
    md: "w-6 h-4",
    lg: "w-8 h-6",
  };

  return (
    <span
      className={`inline-block overflow-hidden rounded-sm ${sizeMap[size]} ${className}`}
    >
      <img
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        width="20"
        height="15"
        alt={`Flag of ${countryCode}`}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
