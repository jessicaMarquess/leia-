import { authOptions } from "@/auth";
import { db, schema } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const StatusEnum = z.enum(["COMPLETADO", "LENDO", "PLANEJADO"]);

const bookUpdateSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: StatusEnum,
  rating: z.number().int().min(0).max(10),
  notes: z.string().min(1),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user as typeof session.user & { id?: string | number };
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(String(user.id), 10);
  const { id: rawId } = await context.params;
  const idStr = (rawId ?? "").trim();
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const item = db
      .select()
      .from(schema.books)
      .where(and(eq(schema.books.id, id), eq(schema.books.userId, userId)))
      .get();
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Failed to get book" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user as typeof session.user & { id?: string | number };
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(String(user.id), 10);
  const { id: rawId } = await context.params;
  const idStr = (rawId ?? "").trim();
  console.log("[PUT /api/books/:id] raw params.id:", rawId, "trimmed:", idStr);
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid id", received: rawId },
      { status: 400 }
    );
  }
  try {
    const json = await req.json();
    const parsed = bookUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const now = new Date();
    const updated = db
      .update(schema.books)
      .set({ ...parsed.data, updatedAt: now })
      .where(and(eq(schema.books.id, id), eq(schema.books.userId, userId)))
      .returning()
      .get();
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user as typeof session.user & { id?: string | number };
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(String(user.id), 10);
  const { id: rawId } = await context.params;
  const idStr = (rawId ?? "").trim();
  console.log(
    "[DELETE /api/books/:id] raw params.id:",
    rawId,
    "trimmed:",
    idStr
  );
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid id", received: rawId },
      { status: 400 }
    );
  }
  try {
    const deleted = db
      .delete(schema.books)
      .where(and(eq(schema.books.id, id), eq(schema.books.userId, userId)))
      .returning()
      .get();
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
