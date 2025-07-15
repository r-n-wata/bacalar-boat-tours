import Image from "next/image";

interface ImageGalleryGridProps {
  images: string[];
}

export default function ImageGalleryGrid({ images }: ImageGalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <div key={index} className="rounded overflow-hidden">
          <Image
            src={img}
            alt={`Gallery image ${index + 1}`}
            className="object-cover w-full h-48"
            width={300}
            height={200}
          />
        </div>
      ))}
    </div>
  );
}
