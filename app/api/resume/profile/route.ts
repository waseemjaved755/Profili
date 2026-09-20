import { requireUser } from "@/lib/auth/require-user";
import {
  buildStoredProfile,
  draftBodySchema,
  profileJsonSchema,
  type ProfileJson,
} from "@/lib/resume/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id, user_id, slug, status, parse_status, parse_error, full_name, greeting, profile_json, resume_path")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ profile: null });
  }

  const json = profileJsonSchema.safeParse(data.profile_json);
  return NextResponse.json({
    profile: {
      ...data,
      parse_status: data.parse_status || "idle",
      parse_error: data.parse_error ?? null,
      profile_json: json.success ? json.data : emptyProfile(data.full_name),
    },
  });
}

export async function PUT(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = draftBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid profile." },
      { status: 400 },
    );
  }

  const { data: existing } = await auth.supabase
    .from("profiles")
    .select("id, profile_json")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Parse a resume first." }, { status: 400 });
  }

  const current = (existing.profile_json ?? {}) as Partial<ProfileJson>;
  const profile_json = buildStoredProfile(current, {
    full_name: parsed.data.full_name,
    headline: parsed.data.headline,
    summary: parsed.data.summary,
    experience: parsed.data.experience,
    skills: parsed.data.skills,
  });

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      greeting: parsed.data.greeting,
      profile_json,
      slug: parsed.data.slug,
    })
    .eq("user_id", auth.user.id)
    .select("id, user_id, slug, status, parse_status, parse_error, full_name, greeting, profile_json, resume_path")
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: error?.message || "Could not save the profile." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile: {
      ...profile,
      profile_json: profileJsonSchema.parse(profile.profile_json),
    },
  });
}

function emptyProfile(fullName: string): ProfileJson {
  return {
    full_name: fullName || "You",
    headline: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    voice: "Alex",
    personality: "professional",
    formality: 0.3,
    verbosity: 0.5,
  };
}
