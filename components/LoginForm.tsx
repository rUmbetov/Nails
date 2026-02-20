'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { loginUser } from '@/actions/auth';
import { LoginDTO, loginSchema } from '@/types/types';
import { useUser } from '@/store/UserStoreProvider';

const Form = styled.form`
  display: flex; flex-direction: column; gap: 1rem; max-width: 400px; margin: 2rem auto;
`;
const ErrorText = styled.span`
  color: #ef4444; font-size: 0.875rem;
`;

export function LoginForm() {
  const router = useRouter();
const { setUser } = useUser();  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = (data: LoginDTO) => {
    startTransition(async () => {
      const result = await loginUser(data);

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

      if (result.success) {
        setUser(result.user);
        router.refresh();
        router.push('/');
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Вход</h2>

      <div>
        <input type="email" placeholder="Email" {...register('email')} disabled={isPending} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </div>

      <div>
        <input type="password" placeholder="Пароль" {...register('password')} disabled={isPending} />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </div>

      {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Вход...' : 'Войти'}
      </button>
    </Form>
  );
}