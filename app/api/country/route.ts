import { NextRequest, NextResponse } from "next/server";
import { searchCountries, createCountry } from "@/lib/repositories/countryRepository";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const sortBy = (searchParams.get("sortBy") as keyof import("@/lib/schema").Country) || "id";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";
  const result = await searchCountries({ search, page, pageSize, sortBy, sortDir });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createCountry(body);
  return NextResponse.json(created);
}
