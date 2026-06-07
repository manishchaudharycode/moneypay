import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "signin" | "signup";
  title: string;
  description: string;
  submitLabel: string;
  footer: ReactNode;
};

export function AuthForm({
  mode,
  title,  
  submitLabel,
  footer,
}: AuthFormProps) {
  const isSignUp = mode === "signup";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <Link href="/" className="mb-4 text-medium font-medium  text-neutral-300">
          MoneyPay
        </Link>
        <CardTitle className="text-2xl">{title}</CardTitle>
        
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {isSignUp ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Manish Kumar"
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {footer}
      </CardFooter>
    </Card>
  );
}
