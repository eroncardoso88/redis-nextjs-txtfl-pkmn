import { headers } from "next/headers";

export async function getIp() {
  const _headers = await headers()
  const forwardedFor = _headers.get("x-forwarded-for");
  const realIp = _headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}