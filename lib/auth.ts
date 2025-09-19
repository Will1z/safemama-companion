import { NextRequest } from "next/server";

export type ApiKeyResult =
  | { ok: true }
  | { ok: false; status: 401 | 500; reason: 'missing_header' | 'bad_key' | 'server_misconfig' };

export function checkApiKey(req: NextRequest): ApiKeyResult {
  const expected = process.env.SAFEMAMA_API_KEY;
  if (!expected) {
    return { ok: false, status: 500, reason: 'server_misconfig' };
  }
  
  const got = req.headers.get("x-api-key");
  if (!got) {
    return { ok: false, status: 401, reason: 'missing_header' };
  }
  
  if (got !== expected) {
    return { ok: false, status: 401, reason: 'bad_key' };
  }
  
  return { ok: true };
}