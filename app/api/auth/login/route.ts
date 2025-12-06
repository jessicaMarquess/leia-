import { signToken, TOKEN_COOKIE, verifyPassword } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = loginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const user = db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, parsed.data.email))
      .get();
    if (!user)
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    const ok = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    const token = signToken({ userId: user.id!, email: user.email });
    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Falha ao autenticar" }, { status: 500 });
  }
}
