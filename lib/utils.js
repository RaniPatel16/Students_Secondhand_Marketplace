import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to combine tailwind class names safely
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format numbers as Indian Rupee or standard currency
export function formatPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date into human readable string
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
