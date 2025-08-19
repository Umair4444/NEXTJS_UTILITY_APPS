import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center text-sm">
      <Link href={"https://upwork.com/freelancers/umairk13"} target="blank">
        © {new Date().getFullYear()} Developed by {""}
        <span className="font-semibold">Umair</span>
      </Link>
    </footer>
  );
}
