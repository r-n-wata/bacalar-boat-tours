interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4 w-full">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-gray-500">{label}</div>
      </div>
    </div>
  );
}
