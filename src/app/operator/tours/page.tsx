import Tours from "@/dashboard/nextjs/components/tours";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function DashboardPage() {
  const fullUser = await getCurrentUser({ withFullUser: true });

  return <Tours operatorId={fullUser?.id} />;
}
