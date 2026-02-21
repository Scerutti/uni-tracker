import { Mail } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>
          {"Made with \u2764\uFE0F for "}
          <a
            href="https://www.linkedin.com/in/cerutti-sebasti%C3%A1ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            Seba Cerutti
          </a>
        </p>

        <div className="flex items-center gap-4">
          <a
            href="mailto:softsys95@gmail.com"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="size-3.5" />
            <span>Contacto</span>
          </a>
          <span className="text-border">|</span>
          <span>{currentYear}</span>
        </div>
      </div>
    </footer>
  );
}
