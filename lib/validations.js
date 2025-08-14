export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

export const validateRequired = (fields, body) => {
  const missing = [];
  fields.forEach((field) => {
    if (
      !body[field] ||
      (typeof body[field] === "string" && !body[field].trim())
    ) {
      missing.push(field);
    }
  });
  return missing;
};
