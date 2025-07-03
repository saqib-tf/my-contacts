import { db } from "../db";
import { country } from "../schema";
import type { Country, NewCountry } from "../schema";
import { eq, ilike, count, desc, and, SQL } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

// Create
export async function createCountry(data: NewCountry): Promise<Country> {
  const [created] = await db.insert(country).values(data).returning();
  return created;
}

// Get by ID
export async function getCountryById(id: number, tenantId: number): Promise<Country | undefined> {
  const [result] = await db
    .select()
    .from(country)
    .where(and(eq(country.id, id), eq(country.tenant_id, tenantId)));
  return result;
}

// Update
export async function updateCountry(
  id: number,
  tenantId: number,
  data: Partial<NewCountry>
): Promise<Country | undefined> {
  const [updated] = await db
    .update(country)
    .set(data)
    .where(and(eq(country.id, id), eq(country.tenant_id, tenantId)))
    .returning();
  return updated;
}

// Delete
export async function deleteCountry(id: number, tenantId: number): Promise<void> {
  await db.delete(country).where(and(eq(country.id, id), eq(country.tenant_id, tenantId)));
}

// Search with paging and sorting
export async function searchCountries(
  options: SearchOptions<Country>
): Promise<{ data: Country[]; total: number }> {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc",
    tenantId,
  } = options;

  const whereClauses: (any | undefined)[] = [eq(country.tenant_id, tenantId)];
  if (search) {
    whereClauses.push(ilike(country.name, `%${search}%`));
  }
  const where = and(...(whereClauses.filter(Boolean) as SQL<unknown>[]));

  // Count total
  const [{ total }] = await db.select({ total: count() }).from(country).where(where);

  // Fetch data
  const data = await db
    .select()
    .from(country)
    .where(where)
    .orderBy(sortDir === "asc" ? country[sortBy] : desc(country[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total: Number(total) };
}

// Count countries for a tenant
export async function countCountries(tenantId: number): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(country)
    .where(eq(country.tenant_id, tenantId));
  return Number(total);
}
