export const isValidUrl = (url: string): boolean => {
  // Regex for URL validation
  // Supports http, https, optional www, domain with optional subdomains, and optional path
  const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([/\w .-]*)*\/?$/;
  return urlRegex.test(url);
}; 