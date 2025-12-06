import { hashPassword, signToken, TOKEN_COOKIE } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const exists = db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, parsed.data.email))
      .get();
    if (exists)
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();
    const created = db
      .insert(schema.users)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        createdAt: now,
      })
      .returning()
      .get();
    const token = signToken({ userId: created.id!, email: created.email });
    const res = NextResponse.json({
      id: created.id,
      name: created.name,
      email: created.email,
    });
    res.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Falha ao registrar" }, { status: 500 });
  }
}
