'use client'
import Link from 'next/link';
import { useViewer } from '../providers/AuthProvider';
import { LogoutButton } from '@/features';

export function Header() {
  const viewer = useViewer();
  return (
    <header style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/">Главная</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {viewer ? (
          <>
            <span>Роль: {viewer.role}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">Войти</Link>
        )}
      </div>
    </header>
  );
}