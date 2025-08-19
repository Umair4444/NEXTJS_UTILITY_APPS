import Link from "next/link";

export default function GameCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition duration-300 hover:-translate-y-1">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
