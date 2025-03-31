"use client";

import { PokeballIcon } from '@/components/ui/pk-icons';
import { useToast } from '@/components/ui/Toast/toast-context';
import { getRgbaColor } from '@/util/get-rgba';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import '@/components/auth/auth-form.scss';
import { useServerAction } from 'zsa-react';
import { signUpAction } from "./actions";
import { registerSchema } from './schema';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const primaryColor = '#ff5a5f';
  const colorValues = {
    base: getRgbaColor(primaryColor, 1),
    visible: getRgbaColor(primaryColor, 0.8),
    invisible: getRgbaColor(primaryColor, 0),
  };

  const { execute, isPending, error } = useServerAction(signUpAction, {
    onError({ err }) {
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess(data) {
      toast({
        title: "Registration successful",
        description: "Welcome to our platform!",
      });
      
      if (data?.data?.success) {
        router.push('/');
        router.refresh();
      }
    },
  });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(`values `, values)
    execute(values);
  }

  return (
    <div className="auth-page__container">
      <div className="auth-page__form-container">
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
                {error.message}
              </div>
            )}
            
            <form className="auth-form__form" onSubmit={form.handleSubmit(onSubmit)}>
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
              
              <div className="auth-form__field">
                <label htmlFor="passwordConfirmation" className="auth-form__label">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  className="auth-form__input"
                  {...form.register("passwordConfirmation")}
                />
                {form.formState.errors.passwordConfirmation && (
                  <span className="auth-form__error-text">{form.formState.errors.passwordConfirmation.message}</span>
                )}
              </div>
              
              <button
                type="submit"
                className="auth-form__button"
                disabled={isPending}
              >
                {isPending ? 'Registering...' : 'Register'}
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
      </div>
    </div>
  );
}