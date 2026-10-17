import HomeClientView, { HomeSummaryData } from "./HomeClientView";
import { clientConfig } from "@/lib/config";

export const revalidate = 180; // ISR: Pre-render and revalidate catalog every 3 minutes

async function getHomeCatalogData(): Promise<HomeSummaryData> {
  try {
    const baseUrl = clientConfig.apiUrl.replace(/\/+$/, "");
    const res = await fetch(`${baseUrl}/categories/summary`, {
      next: { revalidate: 180 },
    });

    if (!res.ok) {
      return { categories: [], subjects: [], popularQuizzes: [] };
    }

    const json = await res.json();
    return json.data || { categories: [], subjects: [], popularQuizzes: [] };
  } catch {
    return { categories: [], subjects: [], popularQuizzes: [] };
  }
}

export default async function HomePage() {
  const initialData = await getHomeCatalogData();
  return <HomeClientView initialData={initialData} />;
}
