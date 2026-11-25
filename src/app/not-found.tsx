import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <div className="hero-glow flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <Logo />
      <p className="mt-12 font-serif text-[7rem] font-semibold leading-none text-line">404</p>
      <h1 className="display mt-2 text-4xl">Esta página se perdeu no caminho.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        O endereço pode ter mudado ou o conteúdo ainda não existe. Volte ao início ou continue a leitura por outro caminho.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary h-11">
          <Home className="size-4" /> Ir para o início
        </Link>
        <Link href="/biblia" className="btn btn-outline h-11">
          <BookOpen className="size-4" /> Abrir a Bíblia
        </Link>
        <Link href="/blog" className="btn btn-ghost h-11">
          <ArrowLeft className="size-4" /> Ver artigos
        </Link>
      </div>
    </div>
  );
}
