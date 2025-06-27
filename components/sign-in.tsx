import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SignIn({
  redirectUrl,
  label = "Sign In",
  variant = "default",
}: {
  redirectUrl?: string;
  label?: string;
  variant?: "default" | "outline";
}) {
  const redirectTo = redirectUrl || "/dashboard";
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <Button type="submit" variant={variant}>
        {label}
      </Button>
    </form>
  );
}
