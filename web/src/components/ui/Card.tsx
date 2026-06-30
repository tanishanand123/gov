import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  noPadding?: boolean;
}

export function Card({ elevated, noPadding, children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "card-base",
          !noPadding && "p-6",
          elevated && "shadow-lg",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={twMerge("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3 className={twMerge("text-lg font-bold text-text", className)} {...props}>
      {children}
    </h3>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={twMerge("", className)} {...props}>
      {children}
    </div>
  );
}
