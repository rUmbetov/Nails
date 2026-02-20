
// Страницы (pages) в Next.js по умолчанию серверные компоненты.

import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <RegisterForm />
    </main>
  );
}