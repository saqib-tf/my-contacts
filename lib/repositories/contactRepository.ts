import { db } from "../../lib/db";
import { contact } from "../../lib/schema";
import type { Contact, NewContact } from "../../lib/schema";
import { eq, ilike, count, desc } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchContacts(options: SearchOptions<Contact> = {}) {
  const { search = "", page = 1, pageSize = 10, sortBy = "id", sortDir = "asc" } = options;
  const where = search ? ilike(contact.first_name, `%${search}%`) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(contact).where(where);
  const data = await db
    .select()
    .from(contact)
    .where(where)
    .orderBy(sortDir === "asc" ? contact[sortBy] : desc(contact[sortBy]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return { data, total: Number(total) };
}

export async function createContact(data: NewContact): Promise<Contact> {
  const [created] = await db.insert(contact).values(data).returning();
  return created;
}

export async function updateContact(
  id: number,
  data: Partial<NewContact>
): Promise<Contact | undefined> {
  const [updated] = await db.update(contact).set(data).where(eq(contact.id, id)).returning();
  return updated;
}

export async function deleteContact(id: number): Promise<void> {
  await db.delete(contact).where(eq(contact.id, id));
}

export async function getContactById(id: number): Promise<Contact | undefined> {
  const [result] = await db.select().from(contact).where(eq(contact.id, id));
  return result;
}
