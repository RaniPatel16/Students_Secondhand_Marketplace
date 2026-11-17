// Utility to combine class names safely without external dependencies
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
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
