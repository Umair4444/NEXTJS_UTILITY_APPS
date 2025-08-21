export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-sm md:text-base text-center">
          © {year} Developed by{" "}
          <span className="font-semibold text-white">Umair</span>
        </p>
      </div>
    </footer>
  );
}
