import { cookies } from "next/headers";

export function isDemoFromCookies() {
  const c = cookies().get("sm_demo")?.value;
  return c === "1";
}

export function getServerAuth() {
  if (isDemoFromCookies()) {
    return { 
      authed: true, 
      user: { email: "mama@mama.com", role: "demo" as const }, 
      source: "demo" as const 
    };
  }
  return { 
    authed: false, 
    user: null, 
    source: "none" as const 
  };
}

