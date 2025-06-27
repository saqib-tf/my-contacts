import { db } from "@/lib/db";
import type { NewUser, User } from "@/lib/schema";
import { user } from "@/lib/schema";

export async function createUser(data: NewUser): Promise<User> {
  const [created] = await db.insert(user).values(data).returning();
  return created;
}

export async function getUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });
}
