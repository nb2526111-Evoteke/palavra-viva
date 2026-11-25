"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  clearLoginFailures,
  createSession,
  destroySession,
  getClientIp,
  getCurrentUser,
  isRateLimited,
  loginRateLimitKey,
  registerLoginFailure,
} from "@/lib/auth";
import { logAudit } from "@/lib/queries";
import type { FormState } from "@/lib/form";

export async function loginAction(_state: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Preencha e-mail e senha." };
  }

  const ip = await getClientIp();
  const key = loginRateLimitKey(email, ip);

  if (isRateLimited(key)) {
    return {
      ok: false,
      message: "Muitas tentativas sem sucesso. Aguarde 15 minutos antes de tentar novamente.",
    };
  }

  const user = await authenticate(email, password);
  if (!user) {
    registerLoginFailure(key);
    await logAudit({ action: "auth.login_failed", entity: "user", details: email, ip });
    return { ok: false, message: "E-mail ou senha incorretos." };
  }

  clearLoginFailures(key);
  await createSession(user.id);
  await logAudit({ userId: user.id, action: "auth.login", entity: "user", entityId: user.id, ip });
  redirect("/admin");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logAudit({ userId: user.id, action: "auth.logout", entity: "user", entityId: user.id });
  }
  await destroySession();
  redirect("/admin/login");
}
