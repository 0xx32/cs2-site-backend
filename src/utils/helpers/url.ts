export const buildRedirectUrl = (baseUrl: string, returnTo: string): string => {
  if (/^https?:\/\//i.test(returnTo)) {
    return returnTo;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = returnTo.replace(/^\/+/, "");

  return `${normalizedBase}/${normalizedPath}`;
};
