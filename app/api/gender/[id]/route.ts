import { NextRequest, NextResponse } from "next/server";
import { getGenderById, updateGender, deleteGender } from "@/lib/repositories/genderRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const gender = await getGenderById(Number(id), tenantId);
  if (!gender) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(gender);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId, user } = sessionAndTenant;
  const body = await req.json();
  const updated = await updateGender(Number(id), tenantId, {
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
  await deleteGender(Number(id), tenantId);
  return NextResponse.json({ success: true });
}
