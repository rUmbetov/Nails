export const PROFILE = {
  name: 'Снежана Кириллова',
  tagline: 'Маникюр • покрытие • дизайн',
  instagramHandle: '@kirillovaaa.sn',
  instagramUrl: 'https://instagram.com/kirillovaaa.sn',
  phonePretty: '+7 (909) 838-11-19',
  phoneRaw: '+79098381119',
} as const;

export const SERVICES = [
  { id: 'manicure', title: 'Маникюр' },
  { id: 'coating', title: 'Покрытие' },
  { id: 'design', title: 'Дизайн' },
  { id: 'removal', title: 'Снятие' },
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];
