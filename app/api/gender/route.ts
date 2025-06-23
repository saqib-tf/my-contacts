import { NextRequest, NextResponse } from "next/server";
import { searchGenders, createGender } from "@/lib/repositories/genderRepository";

export async function GET(req: NextRequest) {
  const {
    search = "",
    page = "1",
    pageSize = "10",
    sortBy = "id",
    sortDir = "asc",
  } = Object.fromEntries(req.nextUrl.searchParams.entries());
  const result = await searchGenders({
    search,
    page: Number(page),
    pageSize: Number(pageSize),
    sortBy: sortBy as any,
    sortDir: sortDir as any,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createGender(body);
  return NextResponse.json(created);
}
