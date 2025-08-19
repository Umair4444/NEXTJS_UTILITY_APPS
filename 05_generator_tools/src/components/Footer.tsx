export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center text-sm">
      © {new Date().getFullYear()} Developed by{" "}
      <span className="font-semibold">Umair</span>
    </footer>
  );
}
