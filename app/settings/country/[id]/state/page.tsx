"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useDebounce } from "use-debounce";
import { SEARCH_DEBOUNCE_MS, PAGE_SIZE } from "@/lib/constants";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationContent,
} from "@/components/ui/pagination";
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

function getStateUrl({ countryId, search, page, pageSize, sortBy, sortDir }: any) {
  const params = new URLSearchParams({
    countryId: String(countryId),
    search: search || "",
    page: String(page || 1),
    pageSize: String(pageSize || PAGE_SIZE),
    sortBy: String(sortBy || "id"),
    sortDir: sortDir || "asc",
  });
  return `/api/state?${params.toString()}`;
}

export default function CountryStatesPage() {
  const params = useParams();
  const router = useRouter();
  const countryId = params.id;
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deletingState, setDeletingState] = useState<any>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { data, isLoading } = useSWR(
    getStateUrl({ countryId, search: debouncedSearch, page, pageSize, sortBy, sortDir }),
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { keepPreviousData: true }
  );

  const safeCountryId = countryId ? String(countryId) : "";
  const { data: countryData, isLoading: isCountryLoading } = useSWR(
    safeCountryId ? `/api/country/${safeCountryId}` : null,
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch country");
      return res.json();
    }
  );

  const total = data?.total || 0;
  const states = data?.data || [];
  const totalPages = Math.ceil(total / pageSize);
  const allIds = states.map((s: any) => String(s.id));
  const allSelected = allIds.length > 0 && allIds.every((id: string) => selectedIds.includes(id));

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
      <h2 className="text-2xl font-bold mb-4">
        {isCountryLoading
          ? "States"
          : countryData?.name
          ? `States - ${countryData.name}`
          : "States"}
      </h2>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Search states..."
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
            onClick={() => {
              router.push(`/settings/country/${countryId}/state/create`);
            }}
            className="flex items-center gap-1"
          >
            <Plus size={16} className="mr-1" /> Create State
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selectedIds.length === 0}
            variant="destructive"
            onClick={() => setBulkDeleteDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
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
              <TableCell colSpan={3}>Loading...</TableCell>
            </TableRow>
          ) : states.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No states found.</TableCell>
            </TableRow>
          ) : (
            states.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(s.id))}
                    onChange={() => toggleOne(s.id)}
                    aria-label={`Select state ${s.name}`}
                  />
                </TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell className="text-center flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Edit"
                    onClick={() => router.push(`/settings/country/${countryId}/state/${s.id}`)}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    aria-label="Delete"
                    onClick={() => {
                      setDeletingState(s);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete state?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete state
              {deletingState ? ` "${deletingState.name}"` : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deletingState) return;
                await fetch(`/api/state/${deletingState.id}`, { method: "DELETE" });
                setDeleteDialogOpen(false);
                setDeletingState(null);
                const url = getStateUrl({
                  countryId,
                  search: debouncedSearch,
                  page,
                  pageSize,
                  sortBy,
                  sortDir,
                });
                mutate(url);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected states?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} selected state
              {selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isBulkDeleting}
              onClick={async () => {
                setIsBulkDeleting(true);
                await Promise.all(
                  selectedIds.map((id) => fetch(`/api/state/${id}`, { method: "DELETE" }))
                );
                setBulkDeleteDialogOpen(false);
                setIsBulkDeleting(false);
                setSelectedIds([]);
                const url = getStateUrl({
                  countryId,
                  search: debouncedSearch,
                  page,
                  pageSize,
                  sortBy,
                  sortDir,
                });
                mutate(url);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
