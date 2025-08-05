import { getCurrentUser } from "@/auth/nextjs/currentUser";
import {
  getOperatorId,
  getDashboardSummary,
  getUpcomingTours,
  getRecentBookings,
} from "../actions";
import Sidebar from "../../../components/molecules/dashboard/operator/SideBar";
import Header from "@/components/molecules/dashboard/operator/Header";
import StatCard from "@/components/molecules/dashboard/operator/StatCard";
import ToursTable from "@/components/molecules/dashboard/operator/ToursTable";
import RecentBookingsTable from "@/components/molecules/dashboard/operator/RecentBookingsTable";
import { CalendarDays, Users, CheckCircle } from "lucide-react";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-6">Not authenticated</div>;

  const operatorId = await getOperatorId(user.id);
  if (!operatorId) return <div className="p-6">No operator profile found</div>;

  const [stats, upcomingTours, recentBookings] = await Promise.all([
    getDashboardSummary(operatorId),
    getUpcomingTours(operatorId),
    getRecentBookings(operatorId),
  ]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar hidden on mobile */}
      <aside className="hidden md:block w-full md:w-64 bg-white border-r">
        <Sidebar />
      </aside>

      <main className="flex-1 bg-gray-100 overflow-x-hidden">
        <section className="px-4 sm:px-6 py-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              children={<CalendarDays size={36} />}
              label="Total Tours"
              value={stats.totalTours}
            />
            <StatCard
              children={<CheckCircle size={36} />}
              label="New Bookings"
              value={stats.totalBookings}
            />
            <StatCard
              children={<Users size={36} />}
              label="Total Customers"
              value={stats.totalCustomers}
            />
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <ToursTable
                tours={upcomingTours.map((tour) => ({
                  name: tour.title,
                  date: new Date(tour.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                }))}
              />
            </div>

            <div className="overflow-x-auto">
              <RecentBookingsTable
                bookings={recentBookings.map((b) => ({
                  tour: b.tourTitle,
                  customer: b.customerName,
                  date: new Date(b.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                }))}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
