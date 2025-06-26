import { db } from "../../lib/db";
import { contact } from "../../lib/schema";
import type { Contact, NewContact } from "../../lib/schema";
import { eq, ilike, count, desc } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchContacts(options: SearchOptions<Contact> = {}) {
  const { search = "", page = 1, pageSize = 10, sortBy = "id", sortDir = "asc" } = options;
  const where = search ? ilike(contact.first_name, `%${search}%`) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(contact).where(where);
  // Use Drizzle relations API to include gender
  const data = await db.query.contact.findMany({
    with: {
      gender: true,
    },
    where,
    orderBy: sortDir === "asc" ? contact[sortBy] : desc(contact[sortBy]),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
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
  const [result] = await db.query.contact.findMany({
    where: eq(contact.id, id),
    with: {
      gender: true,
    },
    limit: 1,
  });
  return result;
}
