import Link from "next/link";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 bg-base-300 p-6 border-r border-base-200">
        <nav className="flex flex-col gap-4">
          <Link href="/settings/country" className="btn btn-ghost justify-start">
            Country
          </Link>
          <Link href="/settings/address-type" className="btn btn-ghost justify-start">
            Address Type
          </Link>
          <Link href="/settings/gender" className="btn btn-ghost justify-start">
            Gender
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
