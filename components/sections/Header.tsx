'use client'
import Link from 'next/link';
import { LogoutButton } from '../ui/LogoutButton';
import { useUser } from '@/store/UserStoreProvider';

export function Header() {
const { user } = useUser();

  return (
    <header style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/">Главная</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Роль: {user.role}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">Войти</Link>
        )}
      </div>
    </header>
  );
}