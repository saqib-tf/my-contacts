"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShadcnInputField } from "@/components/ui/ShadcnInputField";
import { useDebounce } from "use-debounce";
import { DEBOUNCE_DELAY } from "@/lib/constants";

const tenantSchema = z.object({
  name: z.string().min(2, "Organization name is required").max(255),
});

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState("");
  const [debouncedOrgName] = useDebounce(orgName, DEBOUNCE_DELAY);
  const [orgStatus, setOrgStatus] = useState<"idle" | "checking" | "exists" | "available">("idle");

  const user = session?.user;

  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: "" },
  });

  async function handleSubmit(values: z.infer<typeof tenantSchema>) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: values.name }),
      });
      if (!res.ok) throw new Error("Registration failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Watch for org name changes and check availability
  useEffect(() => {
    if (!debouncedOrgName || debouncedOrgName.length < 2) {
      setOrgStatus("idle");
      return;
    }
    setOrgStatus("checking");
    fetch(`/api/tenant?name=${encodeURIComponent(debouncedOrgName)}`)
      .then(async (res) => {
        if (res.ok) {
          setOrgStatus("exists");
        } else {
          setOrgStatus("available");
        }
      })
      .catch(() => setOrgStatus("idle"));
  }, [debouncedOrgName]);

  if (!user)
    return <div className="p-8 text-center">You must be signed in with Google to register.</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded-lg shadow bg-background">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="mb-6 text-muted-foreground">Your email: {user.email}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <ShadcnInputField
            form={form}
            name="name"
            label="Organization Name"
            inputProps={{
              maxLength: 255,
              placeholder: "Your company or team name",
              className: "w-full",
              value: orgName,
              onChange: (e) => {
                setOrgName(e.target.value);
                form.setValue("name", e.target.value);
              },
            }}
            disabled={loading}
            autoFocus
          />
          {orgStatus === "exists" && (
            <div className="text-yellow-600 text-sm">This organization name is already taken.</div>
          )}
          {orgStatus === "available" && debouncedOrgName.length >= 2 && (
            <div className="text-green-600 text-sm">This organization name is available!</div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            disabled={
              loading || !form.watch("name") || orgStatus === "exists" || orgStatus === "checking"
            }
            className="w-full"
          >
            {loading ? "Registering..." : "Register and Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
