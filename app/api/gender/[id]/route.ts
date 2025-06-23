import { NextRequest, NextResponse } from "next/server";
import { getGenderById, updateGender, deleteGender } from "@/lib/repositories/genderRepository";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const gender = await getGenderById(Number(params.id));
  if (!gender) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(gender);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateGender(Number(params.id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await deleteGender(Number(params.id));
  return NextResponse.json({ success: true });
}
