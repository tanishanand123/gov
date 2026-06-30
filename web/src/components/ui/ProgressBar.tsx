import React from "react";
import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "amber" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  primary: "progress-gradient",
  success: "bg-success",
  amber: "bg-amber-400",
  danger: "bg-danger",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel,
  label,
  className,
  animated,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={twMerge("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-text">{label}</span>}
          {showLabel && <span className="text-sm font-semibold text-primary">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={twMerge("w-full bg-slate-100 rounded-full overflow-hidden", sizeStyles[size])}>
        <div
          className={twMerge(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
