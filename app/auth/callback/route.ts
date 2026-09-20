import { requestOrigin, safeNextPath } from "@/lib/auth/safe-next";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const origin = requestOrigin(request);
  const loginError = new URL("/login?error=auth_failed", origin);

  if (!code) {
    return NextResponse.redirect(loginError);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(loginError);
  }

  return NextResponse.redirect(new URL(next, origin));
}
