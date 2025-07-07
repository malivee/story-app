export function getApiHeaders() {
  const token = localStorage.getItem("headersKey");
  return token ? `Bearer ${token}` : undefined;
}

export function saveApiHeaders(token) {
  localStorage.setItem("headersKey", token);
}

export function removeApiHeaders() {
  localStorage.removeItem("headersKey");
}
