'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { RegisterDTO, registerSchema } from '../validation/register.schema';
import { registerUser } from '../actions/registerUser';

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
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterDTO) => {
    startTransition(async () => {
      const result = await registerUser(data);

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

      if (result.success) {
        router.refresh();
        router.push('/');
      }
    });
  };

  return (
    <div className="bg-background mx-auto w-full max-w-md rounded-xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Регистрация</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Создайте аккаунт, чтобы продолжить.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
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
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
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
            {...register('password')}
          />
          {errors.password?.message && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
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
            {...register('confirmPassword')}
          />
          {errors.confirmPassword?.message && (
            <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? 'Создание аккаунта...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </div>
  );
}
