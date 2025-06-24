import React from "react";

export interface Contact {
  id: string | number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  // Add more fields as needed
}

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  showActions?: boolean;
}

export function ContactCard({ contact, onEdit, onDelete, showActions = true }: ContactCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-white">
      <div className="font-semibold text-lg">
        {contact.firstName} {contact.lastName}
      </div>
      {contact.email && <div className="text-gray-600 text-sm">{contact.email}</div>}
      {contact.phone && <div className="text-gray-600 text-sm">{contact.phone}</div>}
      {showActions && (
        <div className="flex gap-2 mt-2">
          {onEdit && (
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => onEdit(contact)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="text-red-600 hover:underline"
              onClick={() => onDelete(contact)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
