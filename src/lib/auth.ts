export type AuthPayload = {
  id?: number;
  email?: string;
  username?: string;
  name?: string;
};

export function getAuthPayload(token?: string | null): AuthPayload | null {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const decoded = JSON.parse(atob(payloadPart));
    return decoded as AuthPayload;
  } catch {
    return null;
  }
}
