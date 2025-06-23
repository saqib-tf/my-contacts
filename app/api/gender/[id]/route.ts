import { NextRequest, NextResponse } from "next/server";
import { getGenderById, updateGender, deleteGender } from "@/lib/repositories/genderRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const gender = await getGenderById(Number(id));
  if (!gender) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(gender);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateGender(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteGender(Number(id));
  return NextResponse.json({ success: true });
}
