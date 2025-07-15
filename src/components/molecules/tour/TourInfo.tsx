export default function TourInfo({
  description,
  duration,
}: {
  description: string;
  duration: number;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">About This Tour</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <p className="text-sm text-gray-500">Duration: {duration} hours</p>
    </div>
  );
}
