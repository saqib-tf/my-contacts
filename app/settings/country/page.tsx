"use client";

import { useState } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
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
import { SEARCH_DEBOUNCE_MS, PAGE_SIZE } from "@/lib/constants";
import { useDebounce } from "use-debounce";
import type { Country } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function getCountryUrl({ search, page, pageSize, sortBy, sortDir }: any) {
  const params = new URLSearchParams({
    search: search || "",
    page: String(page || 1),
    pageSize: String(pageSize || 10),
    sortBy: String(sortBy || "id"),
    sortDir: sortDir || "asc",
  });
  return `/api/country?${params.toString()}`;
}

export default function CountrySettingsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;
  const [sortBy, setSortBy] = useState<keyof Country>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();

  const { data, isLoading } = useSWR(
    getCountryUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }),
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { keepPreviousData: true }
  );

  const total = data?.total || 0;
  const countries: Country[] = data?.data || [];
  const totalPages = Math.ceil(total / pageSize);
  const allIds = countries.map((c) => String(c.id));
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  const toggleOne = (id: string | number) => {
    const idStr = String(id);
    setSelectedIds((prev) =>
      prev.includes(idStr) ? prev.filter((x) => x !== idStr) : [...prev, idStr]
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Country Settings</h2>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Search countries..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={() => router.push("/settings/country/create")}>
            Create Country
          </Button>
          <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={selectedIds.length === 0}
                onClick={() => setBulkDeleteOpen(true)}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Countries</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <b>{selectedIds.length}</b> selected countr
                  {selectedIds.length === 1 ? "y" : "ies"}? This action cannot be undone.
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
                        selectedIds.map((id) => fetch(`/api/country/${id}`, { method: "DELETE" }))
                      );
                      setSelectedIds([]);
                      setBulkDeleteOpen(false);
                      // Optionally, refresh data
                      // mutate(getCountryUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }));
                      window.location.reload();
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
            <TableHead className="w-10 text-center font-semibold">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("code");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Code
            </TableHead>
            <TableHead
              className="font-semibold cursor-pointer"
              onClick={() => {
                setSortBy("name");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
            >
              Name
            </TableHead>
            <TableHead className="w-10 text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : countries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No countries found.</TableCell>
            </TableRow>
          ) : (
            countries.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(c.id))}
                    onChange={() => toggleOne(c.id)}
                    aria-label={`Select country ${c.code}`}
                  />
                </TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-center flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
                    aria-label="Edit"
                    onClick={() => router.push(`/settings/country/${c.id}`)}
                  >
                    <Pencil size={18} />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
                        onClick={() => setDeleteId(String(c.id))}
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </AlertDialogTrigger>
                    {deleteId === String(c.id) && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Country</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete country <b>{c.code}</b>? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)} disabled={deleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              setDeleting(true);
                              try {
                                await fetch(`/api/country/${c.id}`, { method: "DELETE" });
                                setDeleteId(null);
                                setSelectedIds((prev) => prev.filter((id) => id !== String(c.id)));
                                // Optionally, refresh data
                                // mutate(getCountryUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }));
                                window.location.reload();
                              } finally {
                                setDeleting(false);
                              }
                            }}
                            disabled={deleting}
                          >
                            {deleting ? "Deleting..." : "Delete"}
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
        {/* Left: Selected count */}
        <div className="text-sm text-gray-600 min-w-[120px]">{`${selectedIds.length} selected`}</div>
        {/* Center: Pagination */}
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
        {/* Right: Total rows found */}
        <div className="text-sm text-gray-600 min-w-[120px] text-right">{total} found</div>
      </div>
    </div>
  );
}
