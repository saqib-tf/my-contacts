import { db } from "../../lib/db";
import { address_type } from "../../lib/schema";
import type { AddressType, NewAddressType } from "../../lib/schema";
import { eq, ilike, count, desc, and } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchAddressTypes(options: SearchOptions<AddressType>) {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc",
    tenantId,
  } = options;

  const whereClauses: (any | undefined)[] = [eq(address_type.tenant_id, tenantId)];
  if (search) {
    whereClauses.push(ilike(address_type.name, `%${search}%`));
  }
  const where = and(...whereClauses.filter(Boolean));

  const [{ total }] = await db.select({ total: count() }).from(address_type).where(where);
  const data = await db
    .select()
    .from(address_type)
    .where(where)
    .orderBy(sortDir === "asc" ? address_type[sortBy] : desc(address_type[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return { data, total: Number(total) };
}

export async function createAddressType(data: NewAddressType): Promise<AddressType> {
  const [created] = await db.insert(address_type).values(data).returning();
  return created;
}

export async function updateAddressType(
  id: number,
  tenantId: number,
  data: Partial<NewAddressType>
): Promise<AddressType | undefined> {
  const [updated] = await db
    .update(address_type)
    .set(data)
    .where(and(eq(address_type.id, id), eq(address_type.tenant_id, tenantId)))
    .returning();
  return updated;
}

export async function deleteAddressType(id: number, tenantId: number): Promise<void> {
  await db
    .delete(address_type)
    .where(and(eq(address_type.id, id), eq(address_type.tenant_id, tenantId)));
}

export async function getAddressTypeById(
  id: number,
  tenantId: number
): Promise<AddressType | undefined> {
  const [result] = await db
    .select()
    .from(address_type)
    .where(and(eq(address_type.id, id), eq(address_type.tenant_id, tenantId)));
  return result;
}

// Count address types for a tenant
export async function countAddressTypes(tenantId: number): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(address_type)
    .where(eq(address_type.tenant_id, tenantId));
  return Number(total);
}
