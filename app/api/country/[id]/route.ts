import { NextRequest, NextResponse } from "next/server";
import { getCountryById, updateCountry, deleteCountry } from "@/lib/repositories/countryRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const country = await getCountryById(Number(id), tenantId);
  if (!country) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(country);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId, user } = sessionAndTenant;
  const body = await req.json();
  const updated = await updateCountry(Number(id), tenantId, {
    ...body,
    updated_by: user.email,
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  await deleteCountry(Number(id), tenantId);
  return NextResponse.json({ success: true });
}
