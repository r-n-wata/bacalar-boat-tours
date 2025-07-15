export default function TourHero({ title }: { title: string }) {
  return (
    <div className="relative h-60 md:h-96 text-white flex items-center justify-center text-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-teal-600/40"
        style={{
          backgroundImage: `url('/tours-placeholder-images/sailing5.jpg')`,
        }}
      />

      {/* Overlay to darken */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
      </div>
    </div>
  );
}
