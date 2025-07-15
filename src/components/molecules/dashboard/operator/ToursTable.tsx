interface Tour {
  name: string;
  date: string;
}

export default function ToursTable({ tours }: { tours: Tour[] }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold mb-2">Tours</h3>
      <table className="w-full text-left">
        <thead className="text-gray-500">
          <tr>
            <th className="pb-2">Tour</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{tour.name}</td>
              <td>{tour.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
