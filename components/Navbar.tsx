export default function Navbar() {
  return (
    <nav className="navbar bg-base-300 border-b border-base-200 dark:border-base-300">
      {/* Left: Logo */}
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl font-bold tracking-tight">MyContacts</a>
      </div>
      {/* Middle: Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>About</a>
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
