import { NextRequest, NextResponse } from "next/server";
import { searchCountries, createCountry } from "@/lib/repositories/countryRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const sessionTenant = await getSessionAndTenant();
  if (!sessionTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionTenant;
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as keyof import("@/lib/schema").Country) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const result = await searchCountries({ search, page, pageSize, sortBy, sortDir, tenantId });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const sessionTenant = await getSessionAndTenant();
  if (!sessionTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId, user } = sessionTenant;
  const body = await req.json();
  const created = await createCountry({
    ...body,
    tenant_id: tenantId,
    created_by: user.email,
    updated_by: user.email,
  });
  return NextResponse.json(created);
}
