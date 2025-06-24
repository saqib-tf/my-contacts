import { NextRequest, NextResponse } from "next/server";
import {
  getAddressTypeById,
  updateAddressType,
  deleteAddressType,
} from "@/lib/repositories/addressTypeRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const addressType = await getAddressTypeById(Number(id));
  if (!addressType) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(addressType);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateAddressType(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteAddressType(Number(id));
  return NextResponse.json({ success: true });
}
