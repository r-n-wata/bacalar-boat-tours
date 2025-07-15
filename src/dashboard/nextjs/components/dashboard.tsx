import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Sidebar from "../../../components/molecules/dashboard/operator/SideBar";
import Header from "@/components/molecules/dashboard/operator/Header";
import StatCard from "@/components/molecules/dashboard/operator/StatCard";
import ToursTable from "@/components/molecules/dashboard/operator/ToursTable";
import RecentBookingsTable from "@/components/molecules/dashboard/operator/RecentBookingsTable";

export default function Dashboard() {
  const tours = [
    { name: "Sunset Sail", date: "March 25, 2025" },
    { name: "Island Adventure", date: "March 28, 2025" },
    { name: "Reef Snorkeling", date: "April 2, 2025" },
  ];

  const bookings = [
    { tour: "Island Adventure", customer: "Jane Smith", date: "Mar 28, 2025" },
    { tour: "Sunset Sail", customer: "Michael Johnson", date: "Mar 26, 2025" },
    {
      tour: "Mangrove Exploration",
      customer: "Emily Davis",
      date: "Mar 23, 2025",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-100">
        {" "}
        <section className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon="📅" label="Total Tours" value="12" />
            <StatCard icon="✅" label="New Bookings" value="65" />
            <StatCard icon="👥" label="Total Customers" value="134" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToursTable tours={tours} />
            <RecentBookingsTable bookings={bookings} />
          </div>
        </section>
      </main>
    </div>
  );
}
