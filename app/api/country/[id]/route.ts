import { NextRequest, NextResponse } from "next/server";
import { getCountryById, updateCountry, deleteCountry } from "@/lib/repositories/countryRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const country = await getCountryById(Number(id));
  if (!country) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(country);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateCountry(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteCountry(Number(id));
  return NextResponse.json({ success: true });
}
