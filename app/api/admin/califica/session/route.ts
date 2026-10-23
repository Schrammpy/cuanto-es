import { NextRequest, NextResponse } from "next/server";
import {
  adminResponse,
  clearSessionCookies,
  getAdminSession,
  getAuthClient,
  isAdminUser,
  isSameOrigin,
  setSessionCookies,
} from "@/lib/califica-admin-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const check = await getAdminSession(request);
    if (!check.authorized) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      clearSessionCookies(response);
      return response;
    }
    return adminResponse({ authenticated: true, email: check.email }, 200, check);
  } catch (error) {
    console.error("Califica admin session GET:", error);
    return NextResponse.json({ message: "No se pudo verificar el acceso." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  }

  try {
    const input = await request.json();
    const email = typeof input?.email === "string" ? input.email.trim() : "";
    const password = typeof input?.password === "string" ? input.password : "";

    if (!email || !password || password.length > 200) {
      return NextResponse.json({ message: "Ingresá correo y contraseña." }, { status: 400 });
    }

    const auth = getAuthClient();
    const { data, error } = await auth.auth.signInWithPassword({ email, password });

    if (
      error ||
      !data.user ||
      !data.session ||
      !isAdminUser(data.user.id) ||
      !data.user.email_confirmed_at
    ) {
      return NextResponse.json(
        { message: "Credenciales inválidas o acceso no autorizado." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { authenticated: true, email: data.user.email },
      { headers: { "Cache-Control": "no-store" } }
    );
    setSessionCookies(response, data.session);
    return response;
  } catch (error) {
    console.error("Califica admin session POST:", error);
    return NextResponse.json({ message: "No se pudo iniciar sesión." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  }

  // Las cookies HttpOnly se borran aunque la sesión haya expirado.
  const response = NextResponse.json({ success: true });
  clearSessionCookies(response);
  return response;
}
