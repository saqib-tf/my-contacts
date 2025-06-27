import { NextRequest, NextResponse } from "next/server";
import { searchStates, createState } from "@/lib/repositories/stateRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as keyof import("@/lib/schema").State) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const countryId = searchParams.get("countryId")
    ? Number(searchParams.get("countryId"))
    : undefined;
  const result = await searchStates({
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    countryId,
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
  const created = await createState({
    ...body,
    tenant_id: tenantId,
    created_by: user.email,
    updated_by: user.email,
  });
  return NextResponse.json(created);
}
