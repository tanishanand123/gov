"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({ open, onClose, title, description, children, size = "md", className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal card */}
      <div
        className={twMerge(
          "relative w-full bg-surface rounded-[20px] shadow-2xl p-6 animate-fade-in",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-5">
            <div className="flex items-start justify-between gap-4">
              {title && (
                <h2 className="text-xl font-bold text-text">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-elevated text-muted hover:text-text transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
        )}
        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-elevated text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
