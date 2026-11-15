// Client and Server validation helper for CampusMart

export function validateProductData(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = "Product title is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Title must be at least 3 characters long";
  } else if (data.name.trim().length > 120) {
    errors.name = "Title cannot exceed 120 characters";
  }

  if (!data.description || !data.description.trim()) {
    errors.description = "Product description is required";
  } else if (data.description.trim().length < 10) {
    errors.description = "Please provide more details (at least 10 characters)";
  }

  if (data.price === undefined || data.price === null || data.price === "") {
    errors.price = "Selling price is required";
  } else if (isNaN(Number(data.price)) || Number(data.price) < 0) {
    errors.price = "Price must be a valid non-negative number";
  }

  if (data.originalPrice && (isNaN(Number(data.originalPrice)) || Number(data.originalPrice) < 0)) {
    errors.originalPrice = "Original price must be a positive number";
  }

  const validCategories = ["Books", "Electronics", "Furniture", "Stationery", "Other"];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = "Please select a valid category";
  }

  const validConditions = ["New", "Like New", "Good", "Fair"];
  if (!data.condition || !validConditions.includes(data.condition)) {
    errors.condition = "Please select product condition";
  }

  if (!data.sellerName || !data.sellerName.trim()) {
    errors.sellerName = "Seller name is required";
  }

  if (!data.sellerEmail || !data.sellerEmail.trim()) {
    errors.sellerEmail = "Seller email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.sellerEmail.trim())) {
    errors.sellerEmail = "Please enter a valid email address";
  }

  if (!data.sellerPhone || !data.sellerPhone.trim()) {
    errors.sellerPhone = "Contact number is required";
  } else if (data.sellerPhone.trim().length < 8) {
    errors.sellerPhone = "Please enter a valid phone number";
  }

  if (!data.location || !data.location.trim()) {
    errors.location = "Campus location (hostel/department) is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
