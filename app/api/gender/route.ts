import { NextRequest, NextResponse } from "next/server";
import { searchGenders, createGender } from "@/lib/repositories/genderRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const {
    search = "",
    page = "1",
    pageSize = "10",
    sortBy = "id",
    sortDir = "asc",
  } = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await searchGenders({
    search,
    page: Number(page),
    pageSize: Number(pageSize),
    sortBy: sortBy as any,
    sortDir: sortDir as any,
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
  const created = await createGender({
    ...body,
    tenant_id: tenantId,
    created_by: user.email,
    updated_by: user.email,
  });
  return NextResponse.json(created);
}
