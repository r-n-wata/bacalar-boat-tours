import Image from "next/image";

interface ImageGalleryProps {
  images: string[]; // first 3 images
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {/* Big image spans two rows */}
      <div className="col-span-2 row-span-2 rounded overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={images[0]}
            alt="Main tour image"
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Two small images */}
      <div className="rounded overflow-hidden">
        <div className="relative w-full h-full aspect-[1/1]">
          <Image
            src={images[1]}
            alt="Tour image 2"
            fill
            className="object-cover rounded"
          />
        </div>
      </div>

      <div className="rounded overflow-hidden">
        <div className="relative w-full h-full aspect-[1/1]">
          <Image
            src={images[2]}
            alt="Tour image 3"
            fill
            className="object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
}
