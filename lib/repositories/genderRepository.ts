import { db } from "../../lib/db";
import { gender } from "../../lib/schema";
import type { Gender, NewGender } from "../../lib/schema";
import { eq, ilike, count, desc } from "drizzle-orm";
import type { SearchOptions } from "../repositories/searchOptions";

export async function searchGenders(
  options: SearchOptions<Gender> = {}
): Promise<{ data: Gender[]; total: number }> {
  const { search = "", page = 1, pageSize = 10, sortBy = "id", sortDir = "asc" } = options;

  const where = search ? ilike(gender.name, `%${search}%`) : undefined;

  // Count total
  const [{ total }] = await db.select({ total: count() }).from(gender).where(where);

  // Fetch data
  const data = await db
    .select()
    .from(gender)
    .where(where)
    .orderBy(sortDir === "asc" ? gender[sortBy] : desc(gender[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, total: Number(total) };
}

// Create
export async function createGender(data: NewGender): Promise<Gender> {
  const [created] = await db.insert(gender).values(data).returning();
  return created;
}

// Get by ID
export async function getGenderById(id: number): Promise<Gender | undefined> {
  const [result] = await db.select().from(gender).where(eq(gender.id, id));
  return result;
}

// Update
export async function updateGender(
  id: number,
  data: Partial<NewGender>
): Promise<Gender | undefined> {
  const [updated] = await db.update(gender).set(data).where(eq(gender.id, id)).returning();
  return updated;
}

// Delete
export async function deleteGender(id: number): Promise<void> {
  await db.delete(gender).where(eq(gender.id, id));
}
