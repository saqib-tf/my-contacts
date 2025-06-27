"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Trash2, Pencil, Plus, MapPin } from "lucide-react";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { useDebounce } from "use-debounce";
import type { ContactWithRelations } from "@/lib/typesWithRelations";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface ContactListProps {
  onCreate?: () => void;
  onEdit?: (contact: any) => void;
  onDelete?: (contact: any) => void;
}

function getContactUrl({ search, page, pageSize, sortBy, sortDir }: any) {
  const params = new URLSearchParams({
    search: search || "",
    page: String(page || 1),
    pageSize: String(pageSize || PAGE_SIZE),
    sortBy: String(sortBy || "id"),
    sortDir: sortDir || "asc",
  });
  return `/api/contact?${params.toString()}`;
}

export function ContactList({ onCreate, onEdit, onDelete }: ContactListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data, isLoading } = useSWR(
    getContactUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }),
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { keepPreviousData: true }
  );

  const total = data?.total || 0;
  // Change the contacts type to include gender relation
  const contacts = (data?.data || []) as ContactWithRelations[];

  const totalPages = Math.ceil(total / pageSize);
  const allIds = contacts.map((c) => String(c.id));
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));

  const toggleAll = () => {
    setSelected(allSelected ? [] : allIds);
  };

  const toggleOne = (id: string | number) => {
    const idStr = String(id);
    setSelected((prev) =>
      prev.includes(idStr) ? prev.filter((x) => x !== idStr) : [...prev, idStr]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => (window.location.href = "/contact/create")}
          >
            <Plus size={16} className="mr-1" /> Create
          </Button>
          <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={selected.length === 0}
                onClick={() => setBulkDeleteOpen(true)}
                className="flex items-center gap-1"
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Contacts</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selected.length} selected contact
                  {selected.length === 1 ? "" : "s"}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setBulkDeleteOpen(false)} disabled={bulkDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setBulkDeleting(true);
                    try {
                      await Promise.all(
                        selected.map((id) => fetch(`/api/contact/${id}`, { method: "DELETE" }))
                      );
                      setSelected([]);
                      setBulkDeleteOpen(false);
                      mutate(
                        getContactUrl({
                          search: debouncedSearch,
                          page,
                          pageSize,
                          sortBy,
                          sortDir,
                        })
                      );
                    } finally {
                      setBulkDeleting(false);
                    }
                  }}
                  disabled={bulkDeleting}
                >
                  {bulkDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={allSelected}
                onChange={toggleAll}
              />
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("id");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              ID
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("first_name");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              First Name
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("last_name");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Last Name
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("gender_id");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Gender
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("date_of_birth");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Date of Birth
            </TableHead>
            <TableHead className="font-semibold">Profile Picture</TableHead>
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9}>Loading...</TableCell>
            </TableRow>
          ) : contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>No contacts found.</TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="w-8">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${contact.id}`}
                    checked={selected.includes(String(contact.id))}
                    onChange={() => toggleOne(contact.id)}
                  />
                </TableCell>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.last_name}</TableCell>
                <TableCell>
                  {contact.gender?.name || <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell>{contact.date_of_birth}</TableCell>
                <TableCell>
                  {contact.profile_picture_url ? (
                    <img
                      src={contact.profile_picture_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => router && router.push(`/contact/${contact.id}`)}
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </Button>
                  {/* Address button */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router && router.push(`/contact/${contact.id}/address`)}
                    aria-label="Addresses"
                  >
                    <MapPin size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => setDeleteId(contact.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    {deleteId === contact.id && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete contact{" "}
                            <b>
                              {contact.first_name} {contact.last_name}
                            </b>
                            ? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setDeleteId(null)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              setIsDeleting(true);
                              try {
                                await fetch(`/api/contact/${contact.id}`, { method: "DELETE" });
                                setDeleteId(null);
                                setSelected((prev) =>
                                  prev.filter((id) => id !== String(contact.id))
                                );
                                mutate(
                                  getContactUrl({
                                    search: debouncedSearch,
                                    page,
                                    pageSize,
                                    sortBy,
                                    sortDir,
                                  })
                                );
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 min-w-[120px]">{selected.length} selected</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="text-sm text-gray-600 min-w-[120px] text-right">{total} found</div>
      </div>
    </div>
  );
}
