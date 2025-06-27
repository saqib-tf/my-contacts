import { NextRequest, NextResponse } from "next/server";
import { createTenant, getTenantByName } from "@/lib/repositories/tenantRepository";
import { createUser, getUserByEmail } from "@/lib/repositories/userRepository";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user?.email || !user?.name) {
    return NextResponse.json({ error: "Not authenticated or missing user info" }, { status: 401 });
  }

  const { orgName } = await req.json();
  if (!orgName) {
    return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
  }

  // Check if tenant already exists
  const existingTenant = await getTenantByName(orgName);
  if (existingTenant) {
    return NextResponse.json({ error: "Organization name already taken" }, { status: 409 });
  }

  // Check if user already exists (should not, but for safety)
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Create tenant
  const tenant = await createTenant({
    name: orgName,
    created_by: user.email,
    updated_by: user.email,
  });

  // Create user
  await createUser({
    tenant_id: tenant.id,
    email: user.email,
    name: user.name,
    created_by: user.email,
    updated_by: user.email,
  });

  return NextResponse.json({ success: true });
}
