import useSWR from "swr";

export function useCountry(countryId: string | number) {
  return useSWR(countryId ? `/api/country/${countryId}` : null, async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch country");
    return res.json();
  });
}
