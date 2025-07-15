interface Booking {
  tour: string;
  customer: string;
  date: string;
}

export default function RecentBookingsTable({
  bookings,
}: {
  bookings: Booking[];
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold mb-2">Recent Bookings</h3>
      <table className="w-full text-left">
        <thead className="text-gray-500">
          <tr>
            <th className="pb-2">Tour</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{b.tour}</td>
              <td>{b.customer}</td>
              <td>{b.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
