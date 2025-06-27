import { db } from "../../lib/db";
import { contact } from "../../lib/schema";
import type { Contact, NewContact } from "../../lib/schema";
import { eq, ilike, count, desc, and } from "drizzle-orm";
import type { SearchOptions } from "./searchOptions";

export async function searchContacts(options: SearchOptions<Contact>) {
  const {
    search = "",
    page = 1,
    pageSize = 10,
    sortBy = "id",
    sortDir = "asc",
    tenantId,
  } = options;
  const where = and(
    eq(contact.tenant_id, tenantId),
    search ? ilike(contact.first_name, `%${search}%`) : undefined
  );
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
  tenantId: number,
  data: Partial<NewContact>
): Promise<Contact | undefined> {
  const [updated] = await db
    .update(contact)
    .set(data)
    .where(and(eq(contact.id, id), eq(contact.tenant_id, tenantId)))
    .returning();
  return updated;
}

export async function deleteContact(id: number, tenantId: number): Promise<void> {
  await db.delete(contact).where(and(eq(contact.id, id), eq(contact.tenant_id, tenantId)));
}

export async function getContactById(id: number, tenantId: number): Promise<Contact | undefined> {
  const [result] = await db.query.contact.findMany({
    where: (contact, { eq, and }) => and(eq(contact.id, id), eq(contact.tenant_id, tenantId)),
    with: {
      gender: true,
    },
    limit: 1,
  });
  return result;
}
