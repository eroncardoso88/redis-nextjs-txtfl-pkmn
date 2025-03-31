import { registerSchema } from '@/app/(auth)/sign-up/schema';
import { PokeballIcon } from '@/components/ui/pk-icons';
import { getRgbaColor } from '@/util/get-rgba';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import './auth-form.scss';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<string | null>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const primaryColor = '#ff5a5f';
  const colorValues = {
    base: getRgbaColor(primaryColor, 1),
    visible: getRgbaColor(primaryColor, 0.8),
    invisible: getRgbaColor(primaryColor, 0),
  };

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onSubmit(values.name, values.email, values.password);
      if (result) {
        setError(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="auth-form__wrapper"
      style={{
        "--poke-primary-visible": colorValues.visible,
        "--poke-primary-base": colorValues.base,
        "--poke-primary-invisible": colorValues.invisible,
      } as React.CSSProperties}
    >
      {/* Content */}
      <div className="auth-form__content">
        <div className="auth-form__header">
          <div className="auth-form__icon">
            <PokeballIcon />
          </div>
          <h2 className="auth-form__title">Register</h2>
        </div>
        
        {error && (
          <div className="auth-form__error">
            {error}
          </div>
        )}
        
        <form className="auth-form__form" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="auth-form__field">
            <label htmlFor="name" className="auth-form__label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="auth-form__input"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <span className="auth-form__error-text">{form.formState.errors.name.message}</span>
            )}
          </div>
          
          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-form__input"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <span className="auth-form__error-text">{form.formState.errors.email.message}</span>
            )}
          </div>
          
          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-form__input"
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-form__footer">
          <p>
            Already have an account?
            <a href="/sign-in" className="auth-form__link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}