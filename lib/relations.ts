import { relations } from "drizzle-orm";
import { contact, gender, address, address_type, country, state } from "./schema";

export const contactRelations = relations(contact, ({ one }) => ({
  gender: one(gender, {
    fields: [contact.gender_id],
    references: [gender.id],
  }),
}));

export const addressRelations = relations(address, ({ one }) => ({
  address_type: one(address_type, {
    fields: [address.address_type_id],
    references: [address_type.id],
  }),
  country: one(country, {
    fields: [address.country_id],
    references: [country.id],
  }),
  state: one(state, {
    fields: [address.state_id],
    references: [state.id],
  }),
}));
