import { db } from "../../lib/db";
import { address, address_type, country, state } from "../../lib/schema";
import type { Address, NewAddress } from "../../lib/schema";
import { eq, ilike, or, count, desc, and, SQL } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchAddresses(
  options: SearchOptions<Address> & { contactId?: string | number }
) {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc",
    contactId,
    tenantId,
  } = options;
  const whereClauses: (SQL<unknown> | undefined)[] = [eq(address.tenant_id, tenantId)];
  if (contactId) {
    whereClauses.push(eq(address.person_id, Number(contactId)));
  }
  if (search) {
    const streetExpr = ilike(address.street, `%${search}%`);
    const cityExpr = ilike(address.city, `%${search}%`);
    whereClauses.push(or(streetExpr, cityExpr));
  }
  const where = and(...(whereClauses.filter(Boolean) as SQL<unknown>[]));
  const [{ total }] = await db.select({ total: count() }).from(address).where(where);
  // Use .findMany and .with for eager loading
  const data = await db.query.address.findMany({
    where,
    orderBy: sortDir === "asc" ? address[sortBy] : desc(address[sortBy]),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    with: {
      address_type: true,
      country: true,
      state: true,
    },
  });
  return { data, total: Number(total) };
}

export async function createAddress(data: NewAddress): Promise<Address> {
  const [created] = await db.insert(address).values(data).returning();
  return created;
}

export async function updateAddress(
  id: number,
  tenantId: number,
  data: Partial<NewAddress>
): Promise<Address | undefined> {
  const [updated] = await db
    .update(address)
    .set(data)
    .where(and(eq(address.id, id), eq(address.tenant_id, tenantId)))
    .returning();
  return updated;
}

export async function deleteAddress(id: number, tenantId: number): Promise<void> {
  await db.delete(address).where(and(eq(address.id, id), eq(address.tenant_id, tenantId)));
}

export async function getAddressById(id: number, tenantId: number): Promise<Address | undefined> {
  const [result] = await db.query.address.findMany({
    where: (address, { eq, and }) => and(eq(address.id, id), eq(address.tenant_id, tenantId)),
    with: {
      address_type: true,
      country: true,
      state: true,
    },
    limit: 1,
  });
  return result;
}
