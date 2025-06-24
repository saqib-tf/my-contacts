import { NextRequest, NextResponse } from "next/server";
import { searchAddressTypes, createAddressType } from "@/lib/repositories/addressTypeRepository";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as any) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const result = await searchAddressTypes({ search, page, pageSize, sortBy, sortDir });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createAddressType(body);
  return NextResponse.json(created);
}
