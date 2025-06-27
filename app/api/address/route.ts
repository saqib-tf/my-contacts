import { NextRequest, NextResponse } from "next/server";
import { searchAddresses, createAddress } from "@/lib/repositories/addressRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as any) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const contactId = searchParams.get("contactId");
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const result = await searchAddresses({
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    contactId: contactId ? Number(contactId) : undefined,
    tenantId,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId, user } = sessionAndTenant;
  const body = await req.json();
  const created = await createAddress({
    ...body,
    tenant_id: tenantId,
    created_by: user.email,
    updated_by: user.email,
  });
  return NextResponse.json(created);
}
