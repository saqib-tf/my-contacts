import { NextRequest, NextResponse } from "next/server";
import { getTenantByName } from "@/lib/repositories/tenantRepository";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "Missing tenant name" }, { status: 400 });
  }
  const tenant = await getTenantByName(name);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }
  return NextResponse.json(tenant);
}
