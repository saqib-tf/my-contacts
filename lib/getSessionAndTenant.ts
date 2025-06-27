import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/repositories/userRepository";

/**
 * Returns the current session and tenantId for the logged-in user, or null if unauthenticated or user not found.
 */
export async function getSessionAndTenant() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  const dbUser = await getUserByEmail(email);
  if (!dbUser) return null;
  return { session, tenantId: dbUser.tenant_id, user: dbUser };
}
