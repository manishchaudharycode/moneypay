import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <section className="pt-5 px-4 lg:px-0 flex mx-auto max-w-6xl flex-col items-center justify-center text-center">
        <nav className="mb-5 flex w-full items-center justify-between gap-4 text-left">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span>MoneyPay</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button className="hidden sm:inline-flex" variant="ghost">
                Dashboard
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </nav>

        <div className="grid w-full border-0 border-b md:border relative grid-cols-10">
          <div
            className="absolute inset-0 "
            style={{
              background:
                "radial-gradient(80% 100% at 0% 100%, #f97316 50%, #3b82f6 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, transparent 60%)",
              maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />

          <Plus
            size={30}
            strokeWidth={0.8}
            className="absolute -top-4 -left-4"
          />
          <Plus
            size={30}
            strokeWidth={0.8}
            className="absolute -bottom-4 -right-4"
          />

          <div className="md:grid hidden w-full col-span-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="border-b last:border-0 flex-1 aspect-square"
              />
            ))}
          </div>

          <div className="md:col-span-8 col-span-10 relative">
            <div className="md:flex hidden">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border-l last:border-r flex-1 aspect-square"
                />
              ))}
            </div>

            <div className="relative w-full border -mt-0.5 flex items-center flex-col justify-center md:h-89 lg:h-116 p-6 md:p-20">
              <h1 className="flex flex-col text-center text-3xl leading-none font-semibold tracking-tight lg:text-5xl">
                Simple payments for everyday money movement.
              </h1>

              <p className="md:text-md text-muted-foreground py-6 lg:text-lg">
                MoneyPay helps you send, receive, and manage payments <br />{" "}
                from a clean account experience built for speed and clarity.
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/signup">
                  <Button
                    className="cursor-pointer rounded-full w-46 h-12"
                    variant="default"
                  >
                    <Image
                      height={200}
                      width={200}
                      className="size-4 dark:invert"
                      alt=""
                      src="/vercel.svg"
                    />
                    Start Paying
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    className="cursor-pointer rounded-full w-46 h-12"
                    variant="outline"
                  >
                    Open Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative w-full h-full">
              <div className="absolute z-10 top-15 md:top-22 lg:top-29 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Image
                  height={34}
                  width={34}
                  className="size-34 md:size-50 lg:size-66 dark:hidden"
                  alt="MoneyPay app mark"
                  src="https://raw.githubusercontent.com/aliimam-in/templates/076f7e05b77fc6d31aa3c751406c9b2123c45954/apps/vercel/public/vercel-logo-white.svg"
                  fetchPriority="high"
                />
                <Image
                  height={34}
                  width={34}
                  className="size-34 md:size-50 lg:size-66 hidden dark:block"
                  alt="MoneyPay app mark"
                  src="https://raw.githubusercontent.com/aliimam-in/templates/076f7e05b77fc6d31aa3c751406c9b2123c45954/apps/vercel/public/vercel-logo-black.svg"
                  fetchPriority="high"
                />
              </div>

              <div className="flex">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border-l last:border-r border-b flex-1 aspect-square"
                  />
                ))}
              </div>
              <div className="flex">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border-l border-b last:border-r flex-1 aspect-square"
                  />
                ))}
              </div>
              <div className="flex">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border-l last:border-r flex-1 aspect-square"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="md:grid hidden col-span-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="border-b last:border-b-0 flex-1 aspect-square"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
