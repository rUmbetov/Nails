"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth";
import { useUser } from "@/store/UserStoreProvider";

export function LogoutButton() {
const { setUser } = useUser();  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();

      setUser(null);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Ошибка при выходе", error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ cursor: "pointer" }}>
      Выйти
    </button>
  );
}
