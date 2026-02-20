import Image from "next/image";

const images = [
  "/works/1.jpg",
  "/works/2.jpg",
  "/works/3.jpg",
  "/works/4.jpg",
  "/works/5.jpg",
  "/works/6.jpg",
];


export function Portfolio() {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <h2 id="works" className="font-serif text-2xl font-semibold tracking-tight">
          Портфолио
        </h2>
        <span className="text-xs text-muted-foreground">{images.length} фото</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 lg:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-2xl border"
          >
            <Image
              src={src}
              alt={`Работа ${i + 1}`}
              fill
              sizes="(max-width:768px) 33vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}