import { db } from "../../lib/db";
import { address } from "../../lib/schema";
import type { Address, NewAddress } from "../../lib/schema";
import { eq, ilike, count, desc } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchAddresses(options: SearchOptions<Address> = {}) {
  const { search = "", page = 1, pageSize = 10, sortBy = "id", sortDir = "asc" } = options;
  // For address, search street and city fields
  const where = search
    ? ilike(address.street, `%${search}%`) // You can expand this to OR with city if needed
    : undefined;
  const [{ total }] = await db.select({ total: count() }).from(address).where(where);
  const data = await db
    .select()
    .from(address)
    .where(where)
    .orderBy(sortDir === "asc" ? address[sortBy] : desc(address[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return { data, total: Number(total) };
}

export async function createAddress(data: NewAddress): Promise<Address> {
  const [created] = await db.insert(address).values(data).returning();
  return created;
}

export async function updateAddress(
  id: number,
  data: Partial<NewAddress>
): Promise<Address | undefined> {
  const [updated] = await db.update(address).set(data).where(eq(address.id, id)).returning();
  return updated;
}

export async function deleteAddress(id: number): Promise<void> {
  await db.delete(address).where(eq(address.id, id));
}

export async function getAddressById(id: number): Promise<Address | undefined> {
  const [result] = await db.select().from(address).where(eq(address.id, id));
  return result;
}
