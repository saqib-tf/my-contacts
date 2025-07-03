import { NextRequest, NextResponse } from "next/server";
import { countContacts } from "@/lib/repositories/contactRepository";
import { getSessionAndTenant } from "@/lib/getSessionAndTenant";

export async function GET(req: NextRequest) {
  const sessionAndTenant = await getSessionAndTenant();
  if (!sessionAndTenant) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { tenantId } = sessionAndTenant;
  const total = await countContacts(tenantId);
  return NextResponse.json({ total });
}
