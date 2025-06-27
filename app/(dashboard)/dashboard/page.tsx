export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Welcome to your dashboard! Here you can manage your contacts, view analytics, and access
        settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          <p className="text-gray-600 dark:text-gray-400">View and manage your contact list.</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            See stats about your contacts and activity.
          </p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Update your account and preferences.</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Team</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your team members and permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
