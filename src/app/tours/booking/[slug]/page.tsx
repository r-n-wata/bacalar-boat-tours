import BookingPage from "@/tours/nextjs/components/booking";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function DashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const fullUser = await getCurrentUser({ withFullUser: true });

  return <BookingPage user={fullUser} />;
}
