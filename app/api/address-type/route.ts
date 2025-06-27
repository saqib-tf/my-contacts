import { NextRequest, NextResponse } from "next/server";
import { searchAddressTypes, createAddressType } from "@/lib/repositories/addressTypeRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as any) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const result = await searchAddressTypes({ search, page, pageSize, sortBy, sortDir, tenantId });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId, user } = sessionAndTenant;
  const body = await req.json();
  const created = await createAddressType({
    ...body,
    tenant_id: tenantId,
    created_by: user.email,
    updated_by: user.email,
  });
  return NextResponse.json(created);
}
