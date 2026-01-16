const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateFile(file, maxSize) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG, or WEBP images allowed.";
  }
  return file.size < maxSize;
}

export function validateString(name) {
    if (!name) {
        return false;
    }
    const regex = /^[a-zA-Z0-9 _-]+$/;

    return regex.test(name)
}