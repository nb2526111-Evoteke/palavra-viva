"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  FolderTree,
  Image,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Palette,
  ScrollText,
  Settings,
  UserRound,
  Wand2,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { initials } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export function AdminShell({
  user,
  pendingComments,
  siteName,
  children,
}: {
  user: { name: string; email: string; avatar: string };
  pendingComments: number;
  siteName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: NavGroup[] = [
    {
      title: "Visão geral",
      items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
    },
    {
      title: "Conteúdo",
      items: [
        { href: "/admin/artigos", label: "Artigos", icon: FileText },
        { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
        { href: "/admin/comentarios", label: "Comentários", icon: MessageSquare, badge: pendingComments },
        { href: "/admin/biblioteca", label: "Biblioteca", icon: LibraryBig },
        { href: "/admin/gerador", label: "Gerador de temas", icon: Wand2 },
        { href: "/admin/planos", label: "Planos de leitura", icon: CalendarDays },
        { href: "/admin/biblia", label: "Bíblia", icon: BookOpen },
      ],
    },
    {
      title: "Aparência",
      items: [
        { href: "/admin/temas", label: "Temas", icon: Palette },
        { href: "/admin/midia", label: "Mídia", icon: Image },
      ],
    },
    {
      title: "Audiência",
      items: [
        { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
        { href: "/admin/mensagens", label: "Mensagens", icon: Inbox },
      ],
    },
    {
      title: "Sistema",
      items: [
        { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
        { href: "/admin/perfil", label: "Meu perfil", icon: UserRound },
        { href: "/admin/auditoria", label: "Auditoria", icon: ScrollText },
      ],
    },
  ];

  const current =
    groups.flatMap((group) => group.items).find((item) =>
      item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? null;

  return (
    <div className="a-layout">
      <aside className={`a-sidebar ${open ? "is-open" : ""}`} aria-label="Menu do painel">
        <div className="a-sidebar-brand">
          <span className="a-sidebar-mark">
            <BookOpen className="size-[18px]" aria-hidden="true" />
          </span>
          <div>
            <div className="a-sidebar-name">{siteName}</div>
            <div className="a-sidebar-sub">Painel editorial</div>
          </div>
          <button
            type="button"
            className="a-btn a-btn-ghost a-btn-icon ml-auto text-slate-400 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="a-sidebar-scroll admin-scroll">
          {groups.map((group) => (
            <div className="a-nav-group" key={group.title}>
              <div className="a-nav-title">{group.title}</div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`a-nav-link ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="a-nav-icon" aria-hidden="true" />
                      <span>{item.label}</span>
                      {item.badge ? <span className="a-nav-badge">{item.badge > 99 ? "99+" : item.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="a-sidebar-foot">
          <div className="a-sidebar-user">
            <span className="a-avatar">
              {user.avatar ? <img src={user.avatar} alt="" /> : initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold text-slate-100">{user.name}</div>
              <div className="truncate text-[10px] text-slate-500">{user.email}</div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="a-btn a-btn-ghost a-btn-icon text-slate-500 hover:text-slate-200"
                title="Sair do painel"
                aria-label="Sair do painel"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && <button type="button" className="a-overlay" aria-label="Fechar menu" onClick={() => setOpen(false)} />}

      <div className="a-main">
        <header className="a-topbar">
          <button
            type="button"
            className="a-menu-button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-4" />
          </button>
          <div className="a-topbar-title">
            <strong>{current?.label ?? "Dashboard"}</strong>
            <span className="mx-2 text-slate-300">/</span>
            <span>{siteName}</span>
          </div>
          <div className="a-topbar-spacer" />
          <Link href="/" target="_blank" className="a-topbar-link">
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Ver site</span>
          </Link>
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />
          <Link href="/admin/perfil" className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-50">
            <span className="a-avatar size-8">
              {user.avatar ? <img src={user.avatar} alt="" /> : initials(user.name)}
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-[11.5px] font-semibold leading-tight text-slate-800">{user.name}</span>
              <span className="block text-[10px] leading-tight text-slate-500">Administrador</span>
            </span>
          </Link>
        </header>

        <div className="a-content">{children}</div>
      </div>
    </div>
  );
}
