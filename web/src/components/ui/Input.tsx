import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  leftAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="flex items-center h-[48px] px-3 bg-elevated border border-r-0 border-border rounded-l-xl text-muted text-sm font-medium">
            {leftAddon}
          </div>
        )}
        {leftIcon && (
          <div className="absolute left-3 text-muted pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={twMerge(
            clsx(
              "input-base",
              leftAddon && "rounded-l-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]",
              className
            )
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-muted z-10">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={twMerge(
          clsx(
            "input-base h-auto py-3 resize-none",
            error && "border-danger",
            className
          )
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
