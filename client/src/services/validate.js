const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateFile(file, maxSize) {
    const fileSizeInMB = maxSize / (1024 * 1024);
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG, or WEBP images allowed.";
  }

  if (file.size > maxSize) {
    return `File must be under ${fileSizeInMB}MB.`;
  }

  return true;
}

export function validateString(name) {
    if (!name) {
        return false;
    }
    const regex = /^[a-zA-Z0-9 _-]+$/;

    return regex.test(name)
}