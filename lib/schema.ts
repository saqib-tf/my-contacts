import { pgTable, serial, varchar, integer, text, date, timestamp } from "drizzle-orm/pg-core";

const defaultTimestamps = {
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  created_by: varchar("created_by", { length: 100 }),
  updated_by: varchar("updated_by", { length: 100 }),
};

export const country = pgTable("country", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  ...defaultTimestamps,
});

export const state = pgTable("state", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country_id: integer("country_id")
    .notNull()
    .references(() => country.id),
  ...defaultTimestamps,
});

export const gender = pgTable("gender", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  ...defaultTimestamps,
});

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  gender_id: integer("gender_id").references(() => gender.id),
  profile_picture_url: text("profile_picture_url"),
  date_of_birth: date("date_of_birth"),
  ...defaultTimestamps,
});

export const address_type = pgTable("address_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  ...defaultTimestamps,
});

export const address = pgTable("address", {
  id: serial("id").primaryKey(),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state_id: integer("state_id").references(() => state.id),
  country_id: integer("country_id").references(() => country.id),
  postal_code: varchar("postal_code", { length: 20 }),
  address_type_id: integer("address_type_id").references(() => address_type.id),
  person_id: integer("person_id").references(() => contact.id),
  ...defaultTimestamps,
});

export type Country = typeof country.$inferSelect;
export type NewCountry = typeof country.$inferInsert;

export type State = typeof state.$inferSelect;
export type NewState = typeof state.$inferInsert;

export type Gender = typeof gender.$inferSelect;
export type NewGender = typeof gender.$inferInsert;

export type Contact = typeof contact.$inferSelect;
export type NewContact = typeof contact.$inferInsert;

export type AddressType = typeof address_type.$inferSelect;
export type NewAddressType = typeof address_type.$inferInsert;

export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert;
