import { NextRequest, NextResponse } from "next/server";
import { searchAddresses, createAddress } from "@/lib/repositories/addressRepository";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as any) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const result = await searchAddresses({ search, page, pageSize, sortBy, sortDir });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createAddress(body);
  return NextResponse.json(created);
}
