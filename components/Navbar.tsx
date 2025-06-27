import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 px-4 py-2 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 transition"
        >
          MyContacts
        </Link>
      </div>
      {/* Middle: Links */}
      <div className="hidden lg:flex">
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              About
            </Link>
          </li>
        </ul>
      </div>
      {/* Right: User Avatar */}
      <div>
        <UserAvatar />
      </div>
    </nav>
  );
}
