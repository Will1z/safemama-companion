import { NextRequest } from "next/server";

export function checkApiKey(req: NextRequest): boolean {
  const expected = process.env.SAFEMAMA_API_KEY;
  if (!expected) return true; // no key set -> allow all (dev mode)
  const got = req.headers.get("x-api-key");
  return got === expected;
}