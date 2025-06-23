"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
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
import type { Gender } from "@/lib/schema";
import type { SearchOptions } from "@/lib/repositories/searchOptions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { SEARCH_DEBOUNCE_MS, PAGE_SIZE } from "@/lib/constants";
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

function getGenderUrl({ search, page, pageSize, sortBy, sortDir }: SearchOptions<Gender>) {
  const params = new URLSearchParams({
    search: search || "",
    page: String(page || 1),
    pageSize: String(pageSize || 10),
    sortBy: String(sortBy || "id"),
    sortDir: sortDir || "asc",
  });
  return `/api/gender?${params.toString()}`;
}

export default function GenderSettingsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;
  const [sortBy, setSortBy] = useState<keyof Gender>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteManyOpen, setDeleteManyOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingMany, setDeletingMany] = useState(false);

  const { data, isLoading } = useSWR(
    getGenderUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }),
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { keepPreviousData: true }
  );

  const total = data?.total || 0;
  const genders: Gender[] = data?.data || [];
  const totalPages = Math.ceil(total / pageSize);

  const allIds = genders.map((g) => String(g.id));
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

  const handleDelete = async (id: string | number) => {
    setDeleting(true);
    try {
      await fetch(`/api/gender/${id}`, { method: "DELETE" });
      setDeleteId(null);
      mutate(getGenderUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteMany = async () => {
    setDeletingMany(true);
    try {
      await Promise.all(selectedIds.map((id) => fetch(`/api/gender/${id}`, { method: "DELETE" })));
      setSelectedIds([]);
      setDeleteManyOpen(false);
      mutate(getGenderUrl({ search: debouncedSearch, page, pageSize, sortBy, sortDir }));
    } finally {
      setDeletingMany(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gender Settings</h2>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Search genders..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-64"
        />
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={() => router.push("/settings/gender/create")}>
            Add Gender
          </Button>
          <AlertDialog open={deleteManyOpen} onOpenChange={setDeleteManyOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={selectedIds.length === 0}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Genders</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedIds.length} selected gender
                  {selectedIds.length !== 1 ? "s" : ""}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deletingMany}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMany} disabled={deletingMany}>
                  {deletingMany ? "Deleting..." : "Delete"}
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
              onClick={() => {
                setSortBy("code");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer font-semibold"
            >
              Code
            </TableHead>
            <TableHead
              onClick={() => {
                setSortBy("name");
                setSortDir(sortDir === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer font-semibold"
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
          ) : (
            genders.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(g.id))}
                    onChange={() => toggleOne(g.id)}
                    aria-label={`Select gender ${g.code}`}
                  />
                </TableCell>
                <TableCell>{g.code}</TableCell>
                <TableCell>{g.name}</TableCell>
                <TableCell className="text-center flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
                    aria-label="Edit"
                    onClick={() => router.push(`/settings/gender/${g.id}`)}
                  >
                    <Pencil size={18} />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
                        onClick={() => setDeleteId(String(g.id))}
                        aria-label="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </AlertDialogTrigger>
                    {deleteId === String(g.id) && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Gender</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete gender <b>{g.code}</b>? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)} disabled={deleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(g.id)} disabled={deleting}>
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
        <div className="text-sm text-gray-600 min-w-[120px]">
          {`${selectedIds.length} selected`}
        </div>
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
