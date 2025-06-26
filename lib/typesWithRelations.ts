import type { Address, AddressType, Country, State, Contact, Gender } from "./schema";

export type AddressWithRelations = Address & {
  address_type?: AddressType;
  country?: Country;
  state?: State;
};

export type ContactWithRelations = Contact & {
  gender?: Gender;
};
