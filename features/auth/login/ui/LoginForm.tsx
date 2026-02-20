'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { loginSchema, type LoginDTO } from '../validation/login.schema';
import { loginUser } from '../actions/loginUser';

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginDTO) => {
    const res = await loginUser(data);

    if ('error' in res && res.error) {
      setError('root', { message: res.error });
      return;
    }

    router.refresh();
    router.push('/');
  };

  return (
    <div className="bg-background mx-auto w-full max-w-md rounded-xl border p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Вход</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Введите email и пароль, чтобы войти.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email?.message && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password?.message && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Входим...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
}
