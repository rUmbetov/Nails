export type Role = "ADMIN" | "EDITOR" | "USER" | string;

export type Viewer = {
  userId: string;
  role: Role;
  name?: string; // опционально, если нужно
};