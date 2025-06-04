export function validateImageFile(file: File | null): {
  isValid: boolean;
  message?: string;
} {
  if (!file) {
    return { isValid: false, message: "Please upload a logo image." };
  }

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validImageTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "File must be an image (jpg, png, gif, webp).",
    };
  }

  return { isValid: true };
}
