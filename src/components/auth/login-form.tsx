'use client';

import { signInSchema } from '@/app/(auth)/sign-in/schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<string | null>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onSubmit(values.email, values.password);
      if (result) {
        setError(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-form__container">
      <h2 className="auth-form__title">Sign In</h2>
      
      {error && (
        <div className="auth-form__error">
          {error}
        </div>
      )}
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="auth-form">
        <div className="auth-form__group">
          <label htmlFor="email" className="auth-form__label">Email</label>
          <input
            id="email"
            type="email"
            className="auth-form__input"
            placeholder="Enter your email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <span className="auth-form__error-text">{form.formState.errors.email.message}</span>
          )}
        </div>
        
        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">Password</label>
          <input
            id="password"
            type="password"
            className="auth-form__input"
            placeholder="Enter your password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <span className="auth-form__error-text">{form.formState.errors.password.message}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="auth-form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-form__links">
        <a href="/sign-up" className="auth-form__link">Don't have an account? Sign up</a>
        <a href="/forgot-password" className="auth-form__link">Forgot password?</a>
      </div>
    </div>
  );
}