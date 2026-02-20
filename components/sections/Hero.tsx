import { Button } from "@/components/ui/button";
import { PROFILE } from "@/lib/profile";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { YandexMapEmbed } from "../ui/yandexMapEmbed";

export function Hero() {
  return (
    <section className="grid gap-4 rounded-3xl border bg-background/60 p-5 shadow-[0_18px_40px_rgba(236,153,173,0.18)] backdrop-blur md:grid-cols-[1.1fr_.9fr] md:p-8">
      <div>
        <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl text-center">
          {PROFILE.name}
        </h1>

        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base text-center">
          {PROFILE.tagline}
        </p>

        <div className="mt-6 grid gap-3">
          <a
            className="group flex items-center gap-3 rounded-2xl border bg-card/70 px-4 py-3 transition hover:bg-card"
            href={PROFILE.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border bg-primary/15 font-semibold text-foreground/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Instagram</div>
              <div className="truncate font-semibold">
                {PROFILE.instagramHandle}
              </div>
            </div>
            <span className="ml-auto text-sm text-muted-foreground transition group-hover:translate-x-0.5">
              →
            </span>
          </a>

          <a
            className="group flex items-center gap-3 rounded-2xl border bg-card/70 px-4 py-3 transition hover:bg-card"
            href={`tel:${PROFILE.phoneRaw}`}
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border bg-primary/15 font-semibold text-foreground/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-phone"
                viewBox="0 0 16 16"
              >
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Телефон</div>
              <div className="truncate font-semibold">
                {PROFILE.phonePretty}
              </div>
            </div>
            <span className="ml-auto text-sm text-muted-foreground transition group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div id="book" className="mt-6 flex gap-2">
          <BookingDialog
            trigger={
              <Button size="lg" className="rounded-2xl">
                Записаться
              </Button>
            }
          />
        </div>
      </div>

      <div className="relative min-h-[220px] overflow-hidden rounded-3xl border bg-card/70">
        <YandexMapEmbed />

        <div className="pointer-events-none absolute left-4 top-4">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2 text-sm font-semibold backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            проспект Строителей, 1
          </div>
        </div>
      </div>
    </section>
  );
}
