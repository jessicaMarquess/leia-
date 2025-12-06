import { TOKEN_COOKIE, verifyToken } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`));
    const token = tokenMatch?.[1] || "";
    const payload = verifyToken(token);
    if (!payload)
      return NextResponse.json({ authenticated: false }, { status: 401 });
    const user = db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .get();
    if (!user)
      return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      authenticated: true,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Falha ao obter usuário" },
      { status: 500 }
    );
  }
}
