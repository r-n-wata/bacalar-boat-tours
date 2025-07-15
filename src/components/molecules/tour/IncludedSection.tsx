export default function IncludedSection({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
