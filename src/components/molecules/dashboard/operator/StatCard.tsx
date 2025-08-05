interface StatCardProps {
  value: string | number;
  label: string;
  children: React.ReactNode;
}

export default function StatCard({ value, label, children }: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4 w-full  text-gray-800">
      <div className="text-10xl">{children}</div>
      <div>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-gray-800">{label}</div>
      </div>
    </div>
  );
}
