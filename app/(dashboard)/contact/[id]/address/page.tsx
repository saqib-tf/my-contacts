"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
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
import { Trash2, Pencil, Plus } from "lucide-react";
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
import type { AddressWithRelations } from "@/lib/typesWithRelations";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function getAddressUrl({ contactId, search, page, pageSize, sortBy, sortDir }: any) {
  const params = new URLSearchParams({
    search: search || "",
    page: String(page || 1),
    pageSize: String(pageSize || PAGE_SIZE),
    sortBy: String(sortBy || "id"),
    sortDir: sortDir || "asc",
    contactId: String(contactId),
  });
  return `/api/address?${params.toString()}`;
}

const AddressPage = () => {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useSWR(
    getAddressUrl({ contactId, search, page, pageSize, sortBy, sortDir }),
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { keepPreviousData: true }
  );

  const total = data?.total || 0;
  const addresses = (data?.data || []) as AddressWithRelations[];
  const totalPages = Math.ceil(total / pageSize);
  const allIds = addresses.map((a) => String(a.id));
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
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Addresses</h2>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search addresses..."
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
            onClick={() => router.push(`/contact/${contactId}/address/create`)}
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
                <AlertDialogTitle>Delete Selected Addresses</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selected.length} selected address
                  {selected.length === 1 ? "" : "es"}? This action cannot be undone.
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
                        selected.map((id) => fetch(`/api/address/${id}`, { method: "DELETE" }))
                      );
                      setSelected([]);
                      setBulkDeleteOpen(false);
                      mutate(getAddressUrl({ contactId, search, page, pageSize, sortBy, sortDir }));
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
                setSortBy("street");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Street
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("city");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              City
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("postal_code");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Postal Code
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("address_type_id");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Type
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("country_id");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Country
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("state_id");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              State
            </TableHead>
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9}>Loading...</TableCell>
            </TableRow>
          ) : addresses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>No addresses found.</TableCell>
            </TableRow>
          ) : (
            addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="w-8">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${address.id}`}
                    checked={selected.includes(String(address.id))}
                    onChange={() => toggleOne(address.id)}
                  />
                </TableCell>
                <TableCell>{address.id}</TableCell>
                <TableCell>{address.street}</TableCell>
                <TableCell>{address.city}</TableCell>
                <TableCell>{address.postal_code}</TableCell>
                <TableCell>{address.address_type?.name || ""}</TableCell>
                <TableCell>{address.country?.name || ""}</TableCell>
                <TableCell>{address.state?.name || ""}</TableCell>
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`/contact/${contactId}/address/${address.id}`)}
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => setDeleteId(address.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    {deleteId === address.id && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete address <b>{address.street}</b>? This
                            action cannot be undone.
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
                                await fetch(`/api/address/${address.id}`, { method: "DELETE" });
                                setDeleteId(null);
                                setSelected((prev) =>
                                  prev.filter((id) => id !== String(address.id))
                                );
                                mutate(
                                  getAddressUrl({
                                    contactId,
                                    search,
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
};

export default AddressPage;
