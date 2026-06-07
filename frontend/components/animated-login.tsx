"use client";

import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginApi, signUpApi } from "@/lib/api";

type AuthMode = "signin" | "signup";

type LoginPageProps = {
  mode?: AuthMode;
};

type AnimatedAuthFormProps = {
  mode: AuthMode;
  password: string;
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onShowPasswordChange: (value: boolean) => void;
  onTypingChange: (value: boolean) => void;
};

type EyeBallProps = {
  size?: number;
  pupilSize?: number;
  x: number;
  y: number;
  blinking?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function EyeBall({
  size = 18,
  pupilSize = 7,
  x,
  y,
  blinking = false,
}: EyeBallProps) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-150"
      style={{
        width: size,
        height: blinking ? 2 : size,
      }}
    >
      {!blinking ? (
        <div
          className="rounded-full bg-[#2d2d2d]"
          style={{
            width: pupilSize,
            height: pupilSize,
            transform: `translate(${x}px, ${y}px)`,
            transition: "transform 100ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

function DotEye({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="size-3 rounded-full bg-[#2d2d2d]"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 100ms ease-out",
      }}
    />
  );
}

function useBlinking() {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(
      () => {
        setBlinking(true);
        window.setTimeout(() => setBlinking(false), 150);
      },
      Math.random() * 3000 + 3000,
    );

    return () => window.clearInterval(interval);
  }, []);

  return blinking;
}

function AnimatedCharacters({
  password,
  showPassword,
  isTyping,
}: {
  password: string;
  showPassword: boolean;
  isTyping: boolean;
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0, width: 1, height: 1 });
  const [isPeeking, setIsPeeking] = useState(false);
  const purpleBlinking = useBlinking();
  const blackBlinking = useBlinking();

  useEffect(() => {
    function handlePointerMove(event: MouseEvent) {
      setMouse({
        x: event.clientX,
        y: event.clientY,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (!showPassword || password.length === 0) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setIsPeeking(true);
        window.setTimeout(() => setIsPeeking(false), 800);
      },
      Math.random() * 3000 + 2000,
    );

    return () => window.clearTimeout(timeout);
  }, [isPeeking, password.length, showPassword]);

  const lookX = clamp((mouse.x / mouse.width - 0.5) * 12, -6, 6);
  const lookY = clamp((mouse.y / mouse.height - 0.5) * 10, -5, 5);
  const bodySkew = clamp((mouse.x / mouse.width - 0.5) * -12, -6, 6);
  const hidingPassword = password.length > 0 && !showPassword;
  const sneaking = password.length > 0 && showPassword;
  const purpleEyeX = sneaking ? (isPeeking ? 4 : -4) : isTyping ? 3 : lookX;
  const purpleEyeY = sneaking ? (isPeeking ? 5 : -4) : isTyping ? 4 : lookY;
  const blackEyeX = sneaking ? -4 : isTyping ? 0 : lookX;
  const blackEyeY = sneaking ? -4 : isTyping ? -4 : lookY;

  return (
    <div className="relative" style={{ width: 550, height: 400 }}>
      <div
        className="absolute bottom-0 transition-all duration-700"
        style={{
          left: 70,
          width: 180,
          height: hidingPassword || isTyping ? 440 : 400,
          backgroundColor: "#6c3ff5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: sneaking
            ? "skewX(0deg)"
            : hidingPassword || isTyping
              ? `skewX(${bodySkew - 12}deg) translateX(40px)`
              : `skewX(${bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700"
          style={{
            left: sneaking ? 20 : isTyping ? 55 : 45 + lookX,
            top: sneaking ? 35 : isTyping ? 65 : 40 + lookY,
          }}
        >
          <EyeBall x={purpleEyeX} y={purpleEyeY} blinking={purpleBlinking} />
          <EyeBall x={purpleEyeX} y={purpleEyeY} blinking={purpleBlinking} />
        </div>
      </div>

      <div
        className="absolute bottom-0 transition-all duration-700"
        style={{
          left: 240,
          width: 120,
          height: 310,
          backgroundColor: "#2d2d2d",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: sneaking
            ? "skewX(0deg)"
            : isTyping
              ? `skewX(${bodySkew + 10}deg) translateX(20px)`
              : `skewX(${bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700"
          style={{
            left: sneaking ? 10 : isTyping ? 32 : 26 + lookX,
            top: sneaking ? 28 : isTyping ? 12 : 32 + lookY,
          }}
        >
          <EyeBall
            size={16}
            pupilSize={6}
            x={blackEyeX}
            y={blackEyeY}
            blinking={blackBlinking}
          />
          <EyeBall
            size={16}
            pupilSize={6}
            x={blackEyeX}
            y={blackEyeY}
            blinking={blackBlinking}
          />
        </div>
      </div>

      <div
        className="absolute bottom-0 transition-all duration-700"
        style={{
          left: 0,
          width: 240,
          height: 200,
          zIndex: 3,
          backgroundColor: "#ff9b6b",
          borderRadius: "120px 120px 0 0",
          transform: sneaking ? "skewX(0deg)" : `skewX(${bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200"
          style={{
            left: sneaking ? 50 : 82 + lookX,
            top: sneaking ? 85 : 90 + lookY,
          }}
        >
          <DotEye x={sneaking ? -5 : lookX} y={sneaking ? -4 : lookY} />
          <DotEye x={sneaking ? -5 : lookX} y={sneaking ? -4 : lookY} />
        </div>
      </div>

      <div
        className="absolute bottom-0 transition-all duration-700"
        style={{
          left: 310,
          width: 140,
          height: 230,
          backgroundColor: "#e8d754",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform: sneaking ? "skewX(0deg)" : `skewX(${bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200"
          style={{
            left: sneaking ? 20 : 52 + lookX,
            top: sneaking ? 35 : 40 + lookY,
          }}
        >
          <DotEye x={sneaking ? -5 : lookX} y={sneaking ? -4 : lookY} />
          <DotEye x={sneaking ? -5 : lookX} y={sneaking ? -4 : lookY} />
        </div>
        <div
          className="absolute h-1 w-20 rounded-full bg-[#2d2d2d] transition-all duration-200"
          style={{
            left: sneaking ? 10 : 40 + lookX,
            top: sneaking ? 88 : 88 + lookY,
          }}
        />
      </div>
    </div>
  );
}

function LoginPage({ mode = "signin" }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2 max-w-7xl mx-auto">
      <div className="relative hidden flex-col justify-between p-12 lg:flex">
        <div className="relative z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span>MoneyPay</span>
          </Link>
        </div>

        <div className="relative z-20 flex h-[500px] items-end justify-center">
          <AnimatedCharacters
            password={password}
            showPassword={showPassword}
            isTyping={isTyping}
          />
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/70">
          <Link
            href="/"
            className="transition-colors hover:text-primary-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="transition-colors hover:text-primary-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/"
            className="transition-colors hover:text-primary-foreground"
          >
            Contact
          </Link>
        </div>
      </div>

      <AnimatedAuthForm
        mode={mode}
        password={password}
        showPassword={showPassword}
        onPasswordChange={setPassword}
        onShowPasswordChange={setShowPassword}
        onTypingChange={setIsTyping}
      />
    </div>
  );
}

function AnimatedAuthForm({
  mode,
  password,
  showPassword,
  onPasswordChange,
  onShowPasswordChange,
  onTypingChange,
}: AnimatedAuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSignUp = mode === "signup";
  const title = isSignUp ? "Create account" : "Welcome back";
  const description = isSignUp
    ? "Enter your details to start using MoneyPay."
    : "Please enter your details to continue.";
  const submitLabel = isSignUp ? "Sign up" : "Log in";
  const loadingLabel = isSignUp ? "Creating account..." : "Signing in...";
  const footerHref = isSignUp ? "/signin" : "/signup";
  const footerLabel = isSignUp ? "Sign in" : "Sign up";
  const footerText = isSignUp
    ? "Already have an account?"
    : "Don't have an account?";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const playload = {
      email,
      name,
      password,
    };
    try {
      if (mode == "signin") {
        const { token } = await loginApi(playload);
        if (token) {
          localStorage.setItem("token", "Bearer " + token);
          window.location.href = "/dashboard";
        }
      } else {
        const res = signUpApi(playload);
        window.location.href = "/dashboard";
        return res;
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 500);
  }

  return (
    <div className="flex items-center justify-start bg-background p-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-12 flex gap-2 text-lg font-semibold lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="size-4 text-primary" />
          </div>
          <span>MoneyPay</span>
        </div>

        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-semibold text-left">{title}</h1>
          <p className="text-muted-foreground text-left">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Manish Kumar"
                value={name}
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                onFocus={() => onTypingChange(true)}
                onBlur={() => onTypingChange(false)}
                required
                className="h-12 border-border/60 bg-background focus:border-primary"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="anna@gmail.com"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => onTypingChange(true)}
              onBlur={() => onTypingChange(false)}
              required
              className="h-12 border-border/60 bg-background focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                onChange={(event) => onPasswordChange(event.target.value)}
                onFocus={() => onTypingChange(true)}
                onBlur={() => onTypingChange(false)}
                required
                className="h-12 border-border/60 bg-background pr-10 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => onShowPasswordChange(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            className="h-12 w-full text-base font-medium"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-medium text-foreground hover:underline"
          >
            {footerLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export { AnimatedAuthForm, LoginPage };
