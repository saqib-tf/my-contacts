import { db } from "../../lib/db";
import { state } from "../../lib/schema";
import type { State, NewState } from "../../lib/schema";
import { eq, ilike, count, desc, and } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchStates(options: SearchOptions<State> & { countryId?: number } = {}) {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc",
    countryId,
  } = options;
  const conditions = [];
  if (search) conditions.push(ilike(state.name, `%${search}%`));
  if (countryId !== undefined) conditions.push(eq(state.country_id, countryId));
  const where = conditions.length > 1 ? and(...conditions) : conditions[0];
  const [{ total }] = await db.select({ total: count() }).from(state).where(where);
  const data = await db
    .select()
    .from(state)
    .where(where)
    .orderBy(sortDir === "asc" ? state[sortBy] : desc(state[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return { data, total: Number(total) };
}

export async function createState(data: NewState): Promise<State> {
  const [created] = await db.insert(state).values(data).returning();
  return created;
}

export async function updateState(id: number, data: Partial<NewState>): Promise<State | undefined> {
  const [updated] = await db.update(state).set(data).where(eq(state.id, id)).returning();
  return updated;
}

export async function deleteState(id: number): Promise<void> {
  await db.delete(state).where(eq(state.id, id));
}

export async function getStateById(id: number): Promise<State | undefined> {
  const [result] = await db.select().from(state).where(eq(state.id, id));
  return result;
}
