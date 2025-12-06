import { authOptions } from "@/auth";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const StatusEnum = z.enum(["COMPLETADO", "LENDO", "PLANEJADO"]);

const bookInputSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: StatusEnum,
  rating: z.number().int().min(0).max(10),
  notes: z.string().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userIdRaw = (session?.user as { id?: number | string })?.id;
    const userId =
      typeof userIdRaw === "string" ? parseInt(userIdRaw, 10) : userIdRaw;
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const items = db
      .select()
      .from(schema.books)
      .where(eq(schema.books.userId, userId as number))
      .orderBy(desc(schema.books.id))
      .all();
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to list books" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as {
      id?: number | string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = parseInt(String(user.id), 10);
    const json = await req.json();
    const parsed = bookInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const now = new Date();
    const [inserted] = db
      .insert(schema.books)
      .values({ ...parsed.data, userId, createdAt: now, updatedAt: now })
      .returning()
      .all();

    return NextResponse.json(inserted, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
