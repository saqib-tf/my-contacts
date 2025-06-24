import { NextRequest, NextResponse } from "next/server";
import { getContactById, updateContact, deleteContact } from "@/lib/repositories/contactRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const contact = await getContactById(Number(id));
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateContact(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteContact(Number(id));
  return NextResponse.json({ success: true });
}
