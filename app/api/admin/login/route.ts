import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = (await req.json()) as { username?: string; password?: string };

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json({ error: "Admin credentials are not configured" }, { status: 500 });
  }

  if (username === expectedUsername && password === expectedPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
}
