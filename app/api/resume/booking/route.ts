import { requireUser } from "@/lib/auth/require-user";
import { isHttpsUrl } from "@/lib/voice/tools";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  booking_url: z.string().trim().max(500),
});

export async function PUT(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a booking link." }, { status: 400 });
  }

  const value = parsed.data.booking_url;
  if (value && !isHttpsUrl(value)) {
    return NextResponse.json({ error: "Use an https:// scheduling link." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("profiles")
    .update({ booking_url: value || null })
    .eq("user_id", auth.user.id)
    .select("booking_url")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Create an agent first." }, { status: 400 });
  }

  return NextResponse.json({ booking_url: data.booking_url });
}
