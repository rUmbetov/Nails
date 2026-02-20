"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RegisterDTO, registerSchema } from "../validation/register.schema";
import { registerUser } from "../actions/registerUser";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterDTO) => {
    startTransition(async () => {
      const result = await registerUser(data);

      if (result.error) {
        setError("root", { message: result.error });
        return;
      }

      if (result.success) {
        router.refresh();
        router.push("/");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Регистрация</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Создайте аккаунт, чтобы продолжить.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            disabled={isPending}
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Пароль"
            autoComplete="new-password"
            disabled={isPending}
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Повторите пароль</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            autoComplete="new-password"
            disabled={isPending}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Создание аккаунта..." : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}
