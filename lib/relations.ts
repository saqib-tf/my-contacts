import { relations } from "drizzle-orm";
import { contact, gender } from "./schema";

export const contactRelations = relations(contact, ({ one }) => ({
  gender: one(gender, {
    fields: [contact.gender_id],
    references: [gender.id],
  }),
}));
