import { Card } from '@/components/ui/card';

const services = [
  { title: 'Маникюр', desc: 'Чистая обработка, выравнивание, уход.' },
  { title: 'Покрытие', desc: 'Гель-лак, нюд, тонкие слои.' },
  { title: 'Дизайн', desc: 'Минималистичный, нежные акценты.' },
];

export function Services() {
  return (
    <section>
      <h2 className="mt-8 font-serif text-2xl font-semibold tracking-tight">Услуги</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {services.map((s) => (
          <Card key={s.title} className="bg-card/70 rounded-3xl p-5">
            <h3 className="text-sm font-semibold">{s.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
