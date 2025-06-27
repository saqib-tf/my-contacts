import { db } from "@/lib/db";
import type { NewTenant, Tenant } from "@/lib/schema";
import { tenant } from "@/lib/schema";

export async function createTenant(data: NewTenant): Promise<Tenant> {
  const [created] = await db.insert(tenant).values(data).returning();
  return created;
}

export async function getTenantByName(name: string): Promise<Tenant | undefined> {
  return db.query.tenant.findFirst({
    where: (t, { eq }) => eq(t.name, name),
  });
}
