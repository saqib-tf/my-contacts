"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import useSWR from "swr";

function useCount(api: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(api, fetcher, { refreshInterval: 60000 });
  return {
    count: data?.total ?? 0,
    isLoading,
    isError: !!error,
  };
}

export default function DashboardPage() {
  const contacts = useCount("/api/contact/count");
  const countries = useCount("/api/country/count");
  const addressTypes = useCount("/api/address-type/count");
  const genders = useCount("/api/gender/count");

  return (
    <div className="max-w-2xl mx-auto mt-4 p-6 bg-white dark:bg-gray-900 ">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Welcome to your dashboard! Here you can manage your contacts, view analytics, and access
        settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>
              {contacts.isLoading ? "Loading..." : `There are ${contacts.count} contacts.`}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>
              {countries.isLoading ? "Loading..." : `There are ${countries.count} countries.`}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Address Types</CardTitle>
            <CardDescription>
              {addressTypes.isLoading
                ? "Loading..."
                : `There are ${addressTypes.count} address types.`}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Genders</CardTitle>
            <CardDescription>
              {genders.isLoading ? "Loading..." : `There are ${genders.count} genders.`}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
