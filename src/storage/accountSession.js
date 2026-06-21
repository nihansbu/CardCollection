import { readJson, writeJson } from "./jsonStorage.js";
import { localStorageKeys } from "./storageKeys.js";

const HASH_ITERATIONS = 210000;
const HASH_NAME = "SHA-256";
const KEY_LENGTH = 256;

function bytesToBase64(bytes) {
  return window.btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(base64) {
  return Uint8Array.from(window.atob(base64), (character) => character.charCodeAt(0));
}

function normalizeUsername(username) {
  return String(username || "").trim();
}

async function hashPassword(password, saltBase64) {
  const encoder = new TextEncoder();
  const salt = saltBase64 ? base64ToBytes(saltBase64) : window.crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      hash: HASH_NAME,
      iterations: HASH_ITERATIONS,
      name: "PBKDF2",
      salt,
    },
    keyMaterial,
    KEY_LENGTH,
  );

  return {
    hash: bytesToBase64(hash),
    salt: bytesToBase64(salt),
  };
}

function createSession(username) {
  return {
    displayName: username,
    id: `local-${username.toLowerCase()}`,
    mode: "local",
    signedInAt: new Date().toISOString(),
  };
}

function getLocalAccountCredentials() {
  return readJson(localStorageKeys.localAccountCredentials, null);
}

export function getLocalAccountSession() {
  const session = readJson(localStorageKeys.localAccountSession, null);
  return session?.mode === "local" ? session : null;
}

export function hasLocalAccount() {
  return Boolean(getLocalAccountCredentials());
}

export async function createLocalAccount(username, password) {
  const nextUsername = normalizeUsername(username);

  if (hasLocalAccount()) {
    throw new Error("A local account already exists on this device.");
  }

  if (nextUsername.length < 3) {
    throw new Error("Username must be at least 3 characters.");
  }

  if (String(password || "").length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const passwordHash = await hashPassword(password);
  const credentials = {
    createdAt: new Date().toISOString(),
    hash: passwordHash.hash,
    iterations: HASH_ITERATIONS,
    salt: passwordHash.salt,
    username: nextUsername,
  };
  const session = createSession(nextUsername);

  writeJson(localStorageKeys.localAccountCredentials, credentials);
  writeJson(localStorageKeys.localAccountSession, session);
  return session;
}

export async function signInLocalAccount(username, password) {
  const credentials = getLocalAccountCredentials();
  const nextUsername = normalizeUsername(username);

  if (!credentials) {
    throw new Error("Create an account first.");
  }

  if (credentials.username !== nextUsername) {
    throw new Error("Invalid username or password.");
  }

  const passwordHash = await hashPassword(password, credentials.salt);

  if (credentials.hash !== passwordHash.hash) {
    throw new Error("Invalid username or password.");
  }

  const session = createSession(credentials.username);
  writeJson(localStorageKeys.localAccountSession, session);
  return session;
}

export function signOutLocalAccount() {
  window.localStorage.removeItem(localStorageKeys.localAccountSession);
}

export function getLocalAccountUsername() {
  return getLocalAccountCredentials()?.username || "";
}
