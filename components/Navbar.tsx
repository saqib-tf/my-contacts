import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar bg-base-300 border-b border-base-200 dark:border-base-300">
      {/* Left: Logo */}
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tight">
          MyContacts
        </Link>
      </div>
      {/* Middle: Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      {/* Right: Sign In/Out Button */}
      <div className="navbar-end">
        <button className="btn btn-neutral btn-sm">Sign In</button>
      </div>
    </nav>
  );
}
