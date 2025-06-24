import { NextRequest, NextResponse } from "next/server";
import { getStateById, updateState, deleteState } from "@/lib/repositories/stateRepository";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const state = await getStateById(Number(id));
  if (!state) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(state);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const updated = await updateState(Number(id), body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await deleteState(Number(id));
  return NextResponse.json({ success: true });
}
