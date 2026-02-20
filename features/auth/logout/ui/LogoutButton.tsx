'use client';

import { useRouter } from 'next/navigation';
import { logoutUser } from '../actions/logoutUser';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();

      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Ошибка при выходе', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
      Выйти
    </button>
  );
}
