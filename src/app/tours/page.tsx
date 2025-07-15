import BoatToursPage from "@/tours/nextjs/components/tours";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function DashboardPage() {
  const fullUser = await getCurrentUser({ withFullUser: true });

  return <BoatToursPage userId={fullUser?.id} />;
}
