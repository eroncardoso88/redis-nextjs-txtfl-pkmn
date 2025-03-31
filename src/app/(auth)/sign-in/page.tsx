"use client";

import '@/components/auth/auth-form.scss';
import { useToast } from "@/components/ui/Toast/toast-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { signInAction } from "./actions";
import { signInSchema } from './schema';

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { execute, isPending, error } = useServerAction(signInAction, {
    onError({ err }) {
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess(data) {
      // toast({
      //   title: "Welcome back!",
      //   description: "You have successfully signed in.",
      // });
      router.push('/', {})
      router.refresh(); 
      window.location.href = "/"
    },
  });

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    execute(values);
  }

  return (
    <div className="auth-page__container">
      <div className="auth-page__form-container">
        <div className="auth-form__wrapper">
          {/* Content */}
          <div className="auth-form__content">
            <div className="auth-form__header">
              <h2 className="auth-form__title">Sign In</h2>
            </div>
            
            {error && (
              <div className="auth-form__error">
                {error.message}
              </div>
            )}
            
            <form className="auth-form__form" onSubmit={form.handleSubmit(onSubmit)}>
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
                disabled={isPending}
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-form__footer">
              <p>
                Don't have an account?
                <a href="/sign-up" className="auth-form__link">
                  Sign Up
                </a>
              </p>
              <p>
                <a href="/forgot-password" className="auth-form__link">
                  Forgot Password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}