// app/page.tsx
import GoBack from "@/components/GoBack";
import ImageSlider from "@/components/ImageSlider";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-900">
      <div className="absolute top-4 left-4">
        <GoBack />
      </div>
      <ImageSlider />
    </main>
  );
}
