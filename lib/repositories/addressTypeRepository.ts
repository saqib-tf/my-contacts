import { db } from "../../lib/db";
import { address_type } from "../../lib/schema";
import type { AddressType, NewAddressType } from "../../lib/schema";
import { eq, ilike, count, desc } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchAddressTypes(options: SearchOptions<AddressType> = {}) {
  const { search = "", page = 1, pageSize = 10, sortBy = "id", sortDir = "asc" } = options;
  const where = search ? ilike(address_type.name, `%${search}%`) : undefined;
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
  data: Partial<NewAddressType>
): Promise<AddressType | undefined> {
  const [updated] = await db
    .update(address_type)
    .set(data)
    .where(eq(address_type.id, id))
    .returning();
  return updated;
}

export async function deleteAddressType(id: number): Promise<void> {
  await db.delete(address_type).where(eq(address_type.id, id));
}

export async function getAddressTypeById(id: number): Promise<AddressType | undefined> {
  const [result] = await db.select().from(address_type).where(eq(address_type.id, id));
  return result;
}
