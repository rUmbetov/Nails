"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PROFILE, SERVICES } from "@/lib/profile";
import { buildBookingText, buildWhatsAppUrl } from "@/lib/booking";

type Props = {
  trigger?: React.ReactNode;          // кастомный триггер (если нужно)
  defaultService?: string;
};

export function BookingDialog({ trigger, defaultService }: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [service, setService] = React.useState(defaultService ?? SERVICES[0].title);
  const [date, setDate] = React.useState("");
  const [note, setNote] = React.useState("");

  const text = React.useMemo(
    () => buildBookingText({ name, service, date, note }),
    [name, service, date, note]
  );

  const whatsappUrl = React.useMemo(() => buildWhatsAppUrl(text), [text]);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op (можно добавить toast, если используешь sonner)
    }
  }

  function reset() {
    setName("");
    setService(defaultService ?? SERVICES[0].title);
    setDate("");
    setNote("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="lg" className="rounded-2xl">Записаться</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Запись на процедуру</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Ваше имя</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Марина" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service">Услуга</Label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Желаемая дата/время</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Например, пт 17:00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Комментарий</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Например: хочу нюд + тонкий дизайн"
              className="min-h-[90px]"
            />
          </div>

          <div className="rounded-2xl border bg-muted/40 p-3 text-sm">
            <div className="mb-2 font-semibold">Текст сообщения</div>
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">{text}</pre>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-2xl" onClick={copyText}>
              Скопировать текст
            </Button>

            <Button asChild className="rounded-2xl">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                Отправить в WhatsApp
              </a>
            </Button>

            <Button asChild variant="outline" className="rounded-2xl">
              <a href={`tel:${PROFILE.phoneRaw}`} onClick={() => setOpen(false)}>
                Позвонить
              </a>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Или напишите в Instagram:{" "}
            <a className="underline underline-offset-4" href={PROFILE.instagramUrl} target="_blank" rel="noreferrer">
              {PROFILE.instagramHandle}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}