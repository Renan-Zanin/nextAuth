// Rotas públicas que não exigem autenticação
export const publicRoutes = ["/", "/auth/new-verification"];

// Rotas que são utilizadas como autenticação
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/error",
  "/auth/new-password",
];

//Rotas que são utilizadas pela API com propósitos de autenticação
export const apiAuthPrefix = "/api/auth";

//Redirecionamento padrão após usuário realizar autenticação
export const DEFAULT_LOGIN_REDIRECT = "/settings";
