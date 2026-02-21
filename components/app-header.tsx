"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative size-8 overflow-hidden rounded-md border">
            <Image
              src="/images/uader-logo.png"
              alt="Logo UADER"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">
              Mi Carrera
            </span>
            <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
              Lic. en Sistemas - UADER
            </span>
          </div>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
