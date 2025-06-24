import { NextRequest, NextResponse } from "next/server";
import { getAddressById, updateAddress, deleteAddress } from "@/lib/repositories/addressRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const address = await getAddressById(Number(id));
  if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(address);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateAddress(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteAddress(Number(id));
  return NextResponse.json({ success: true });
}
