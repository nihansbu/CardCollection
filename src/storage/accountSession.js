import { readJson, writeJson } from "./jsonStorage.js";
import { localStorageKeys } from "./storageKeys.js";

const DEMO_ADMIN_USERNAME = "Admin";
const DEMO_ADMIN_PASSWORD = "Admin";

export function getLocalAccountSession() {
  return readJson(localStorageKeys.localAccountSession, null);
}

export function signInLocalDemoAccount(username, password) {
  if (username !== DEMO_ADMIN_USERNAME || password !== DEMO_ADMIN_PASSWORD) {
    throw new Error("Invalid local demo credentials.");
  }

  const session = {
    displayName: "Admin",
    id: "local-demo-admin",
    mode: "local-demo",
    signedInAt: new Date().toISOString(),
  };

  writeJson(localStorageKeys.localAccountSession, session);
  return session;
}

export function signOutLocalDemoAccount() {
  window.localStorage.removeItem(localStorageKeys.localAccountSession);
}

export function getDemoCredentials() {
  return {
    password: DEMO_ADMIN_PASSWORD,
    username: DEMO_ADMIN_USERNAME,
  };
}

