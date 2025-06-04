interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates password rules and confirms match.
 * @param password The main password
 * @param confirmPassword The repeated password
 */
export function validatePassword(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  // You can customize more rules here
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  if (!hasNumber || !hasLetter) {
    return {
      isValid: false,
      message: "Password must contain both letters and numbers.",
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "Passwords do not match.",
    };
  }

  return { isValid: true };
}
