import { getAuthProvider } from "./providers";

const authProvider = getAuthProvider();

export const login = (email, password) =>
  authProvider.login(email, password);

export const logout = () =>
  authProvider.logout();

export const getSession = () =>
  authProvider.getSession();
