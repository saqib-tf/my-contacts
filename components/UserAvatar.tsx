import { auth } from "../auth";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "./signout-button";
import SignIn from "./sign-in";

export default async function UserAvatar() {
  const session = await auth();
  if (!session?.user) return <SignIn />;
  // console.log("UserAvatar session:", session);
  const user = session.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email ?? "User"} />
            <AvatarFallback>{user.name?.[0] ?? user.email?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col items-center gap-1">
          <Avatar className="mx-auto mb-1">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email ?? "User"} />
            <AvatarFallback>{user.name?.[0] ?? user.email?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-base">{user.name || user.email}</span>
          {user.email && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
