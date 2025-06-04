interface PhoneValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates that the phone number is a valid Mexican mobile or landline number.
 * Assumes numbers are 10 digits (standard in Mexico) and only digits.
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  const cleaned = phone.replace(/\D/g, ""); // remove non-digit characters

  if (cleaned.length !== 12) {
    return {
      isValid: false,
      message: "El número debe tener exactamente 10 dígitos.",
    };
  }

  const validPrefixes = [
    "55",
    "56", // Mexico City (mobile)
    "33", // Guadalajara
    "81", // Monterrey
    // ...add more known valid area codes as needed
  ];

  const startsWithValidPrefix = validPrefixes.some((prefix) =>
    cleaned.startsWith(prefix)
  );

  if (!startsWithValidPrefix) {
    return {
      isValid: false,
      message:
        "El número debe comenzar con un código de área válido en México.",
    };
  }

  return { isValid: true };
}
