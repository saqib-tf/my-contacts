"use client";
import { useParams } from "next/navigation";
import GenderForm from "../GenderForm";

export default function EditGenderPage() {
  const params = useParams();
  const genderId = params.id as string;
  return <GenderForm genderId={genderId} />;
}
