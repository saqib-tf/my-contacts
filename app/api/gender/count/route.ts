import { NextRequest, NextResponse } from "next/server";
import { countGenders } from "@/lib/repositories/genderRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const total = await countGenders(tenantId);
  return NextResponse.json({ total });
}
