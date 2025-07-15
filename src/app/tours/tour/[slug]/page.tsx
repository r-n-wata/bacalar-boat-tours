import TourPage from "@/tours/nextjs/components/tour";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function DashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const fullUser = await getCurrentUser({ withFullUser: true });

  return <TourPage />;
}
