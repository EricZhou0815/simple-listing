import { NextResponse } from "next/server";
import { defaultSiteSettings } from "@/lib/site-settings";
import { readSiteSettings, writeSiteSettings } from "@/lib/storage";

export async function GET() {
  const settings = await readSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const body = (await req.json()) as Partial<typeof defaultSiteSettings>;
  const nextSettings = {
    pageTitle: body.pageTitle?.trim() || defaultSiteSettings.pageTitle,
    heroBadge: body.heroBadge?.trim() || defaultSiteSettings.heroBadge,
    heroTitle: body.heroTitle?.trim() || defaultSiteSettings.heroTitle,
    heroDescription: body.heroDescription?.trim() || defaultSiteSettings.heroDescription
  };

  await writeSiteSettings(nextSettings);
  return NextResponse.json(nextSettings);
}
