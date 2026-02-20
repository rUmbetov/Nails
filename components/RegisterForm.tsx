'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterDTO, registerSchema } from '@/types/types';
import { registerUser } from '@/actions/auth';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 2rem auto;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
`;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = (data: RegisterDTO) => {
    startTransition(async () => {
      // Вызываем серверный экшен
      const result = await registerUser(data);

      if (result.error) {
        // Ошибка с бэкенда (например, email уже занят)
        setError('root', { message: result.error });
        return;
      }

      if (result.success) {
        // Поскольку юзер залогинен, обновляем роутер для ререндера Layout
        // и направляем в дашборд
        router.refresh();
        router.push('/');
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Регистрация</h2>

      <div>
        <input 
          type="email" 
          placeholder="Email" 
          {...register('email')} 
          disabled={isPending}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </div>

      <div>
        <input 
          type="password" 
          placeholder="Пароль" 
          {...register('password')} 
          disabled={isPending}
        />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </div>

      <div>
        <input 
          type="password" 
          placeholder="Повторите пароль" 
          {...register('confirmPassword')} 
          disabled={isPending}
        />
        {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
      </div>

      {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Создание аккаунта...' : 'Зарегистрироваться'}
      </button>
    </Form>
  );
}