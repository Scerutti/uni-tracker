import { Mail } from "lucide-react";
import packageJson from "@/package.json";
import { CONTACTO_EMAIL } from "@/lib/links";

/** Versión de la app; sale de `package.json`, que se sube en cada release. */
const VERSION = packageJson.version;

const CHANGELOG_URL = "https://github.com/Scerutti/uni-tracker/blob/main/CHANGELOG.md";

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
            href={`mailto:${CONTACTO_EMAIL}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="size-3.5" />
            <span>Contacto</span>
          </a>
          <span className="text-border">|</span>
          <span>{currentYear}</span>
          <span className="text-border">|</span>
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Qué cambió en cada versión"
            className="font-mono text-xs transition-colors hover:text-foreground"
          >
            v{VERSION}
          </a>
        </div>
      </div>
    </footer>
  );
}
