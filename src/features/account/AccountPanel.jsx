import React, { useEffect, useState } from "react";
import { Cloud, Download, KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import { exportLocalGameSave } from "../../storage/localSave.js";
import {
  createLocalAccount,
  getLocalAccountUsername,
  getLocalAccountSession,
  hasLocalAccount,
  signInLocalAccount,
  signOutLocalAccount,
} from "../../storage/accountSession.js";
import {
  getAuthConfigStatus,
  getCloudAuthUser,
  signInCloudAccount,
  signOutCloudAccount,
  signUpCloudAccount,
} from "../../storage/authService.js";

function getSaveSummary() {
  const save = exportLocalGameSave();

  return {
    activities: save.activities.length,
    activityLog: save.activityLog.length,
    rap: Math.floor(save.rap),
    skills: save.skills.length,
  };
}

export function AccountPanel({ isGate = false, onAuthenticated }) {
  const [accountExists, setAccountExists] = useState(() => hasLocalAccount());
  const [cloudPassword, setCloudPassword] = useState("");
  const [cloudUser, setCloudUser] = useState(null);
  const [email, setEmail] = useState("");
  const [localMode, setLocalMode] = useState(() => hasLocalAccount() ? "signin" : "create");
  const [localPassword, setLocalPassword] = useState("");
  const [localPasswordConfirm, setLocalPasswordConfirm] = useState("");
  const [localSession, setLocalSession] = useState(() => getLocalAccountSession());
  const [localUsername, setLocalUsername] = useState(() => getLocalAccountUsername());
  const [message, setMessage] = useState("");
  const [saveSummary, setSaveSummary] = useState(() => getSaveSummary());
  const [status, setStatus] = useState("idle");
  const { cloudConfigured } = getAuthConfigStatus();
  const activeName = cloudUser?.email || localSession?.displayName || "Guest";

  useEffect(() => {
    let isMounted = true;

    async function loadCloudUser() {
      if (!cloudConfigured) return;

      try {
        const user = await getCloudAuthUser();
        if (isMounted) setCloudUser(user);
      } catch (error) {
        if (isMounted) setMessage(error.message);
      }
    }

    loadCloudUser();

    return () => {
      isMounted = false;
    };
  }, [cloudConfigured]);

  const refreshSaveSummary = () => {
    setSaveSummary(getSaveSummary());
  };

  const handleLocalSubmit = async (event) => {
    event.preventDefault();
    setStatus(localMode);
    setMessage("");

    try {
      if (localMode === "create" && localPassword !== localPasswordConfirm) {
        throw new Error("Passwords do not match.");
      }

      const session = localMode === "create"
        ? await createLocalAccount(localUsername, localPassword)
        : await signInLocalAccount(localUsername, localPassword);
      setLocalSession(session);
      setAccountExists(true);
      setLocalMode("signin");
      setLocalPassword("");
      setLocalPasswordConfirm("");
      setMessage(localMode === "create" ? "Account created." : "Signed in.");
      refreshSaveSummary();
      onAuthenticated?.(session);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setStatus("idle");
    }
  };

  const handleLocalLogout = () => {
    signOutLocalAccount();
    setLocalSession(null);
    setMessage("Signed out.");
    onAuthenticated?.(null);
  };

  const handleCloudAuth = async (event, action) => {
    event.preventDefault();
    setStatus(action);
    setMessage("");

    try {
      const user = action === "signup"
        ? await signUpCloudAccount(email, cloudPassword)
        : await signInCloudAccount(email, cloudPassword);
      setCloudUser(user);
      setCloudPassword("");
      setMessage(action === "signup" ? "Cloud account created. Confirm email if Supabase requires it." : "Cloud account signed in.");
      refreshSaveSummary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setStatus("idle");
    }
  };

  const handleCloudLogout = async () => {
    setStatus("signout");
    setMessage("");

    try {
      await signOutCloudAccount();
      setCloudUser(null);
      setMessage("Cloud account signed out.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <ContentPanel
      className="account-panel"
      stats={[
        { Icon: UserRound, label: "User", value: activeName },
        { Icon: Cloud, label: "Cloud", value: cloudConfigured ? "Ready" : "Off" },
        { Icon: ShieldCheck, label: "Mode", value: cloudUser ? "Cloud" : localSession ? "Account" : accountExists ? "Locked" : "Setup" },
      ]}
      title="Account"
    >
      <div className="account-body">
        <section className="account-section">
          <div className="account-section-head">
            <span>Current Session</span>
            <strong>{activeName}</strong>
          </div>
          <p>
            Create a local account to unlock this device. Cloud Save can be connected after Supabase is configured.
          </p>
          {message ? <p className="account-message" role="status">{message}</p> : null}
        </section>

        <section className="account-section">
          <div className="account-section-head">
            <span>Local Account</span>
            <strong>{localSession ? localSession.displayName : accountExists ? "Sign In" : "Create"}</strong>
          </div>
          {localSession ? (
            <button className="account-button" onClick={handleLocalLogout} type="button">
              <LogOut size={17} strokeWidth={2.8} />
              <span>Logout</span>
            </button>
          ) : (
            <form className="account-form" onSubmit={handleLocalSubmit}>
              <label>
                <span>Username</span>
                <input
                  autoComplete="username"
                  onChange={(event) => setLocalUsername(event.target.value)}
                  value={localUsername}
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  onChange={(event) => setLocalPassword(event.target.value)}
                  type="password"
                  value={localPassword}
                />
              </label>
              {localMode === "create" ? (
                <label>
                  <span>Repeat Password</span>
                  <input
                    autoComplete="new-password"
                    onChange={(event) => setLocalPasswordConfirm(event.target.value)}
                    type="password"
                    value={localPasswordConfirm}
                  />
                </label>
              ) : null}
              <button className="account-button" disabled={status !== "idle"} type="submit">
                <KeyRound size={17} strokeWidth={2.8} />
                <span>{localMode === "create" ? "Create Account" : "Sign In"}</span>
              </button>
              {!isGate && accountExists ? (
                <button
                  className="account-button account-button-secondary"
                  onClick={() => {
                    setLocalMode((current) => current === "create" ? "signin" : "create");
                    setMessage("");
                  }}
                  type="button"
                >
                  <span>{localMode === "create" ? "Use Existing" : "New Account"}</span>
                </button>
              ) : null}
            </form>
          )}
        </section>

        {!isGate ? <section className="account-section">
          <div className="account-section-head">
            <span>Cloud Account</span>
            <strong>{cloudConfigured ? "Supabase" : "Not Configured"}</strong>
          </div>
          <form className="account-form" onSubmit={(event) => handleCloudAuth(event, "signin")}>
            <label>
              <span>Email</span>
              <input
                autoComplete="email"
                disabled={!cloudConfigured}
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                value={email}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                autoComplete="current-password"
                disabled={!cloudConfigured}
                onChange={(event) => setCloudPassword(event.target.value)}
                type="password"
                value={cloudPassword}
              />
            </label>
            <div className="account-button-row">
              <button className="account-button" disabled={!cloudConfigured || status !== "idle"} type="submit">
                <KeyRound size={17} strokeWidth={2.8} />
                <span>Sign In</span>
              </button>
              <button
                className="account-button"
                disabled={!cloudConfigured || status !== "idle"}
                onClick={(event) => handleCloudAuth(event, "signup")}
                type="button"
              >
                <ShieldCheck size={17} strokeWidth={2.8} />
                <span>Create</span>
              </button>
            </div>
          </form>
          {cloudUser ? (
            <button className="account-button account-button-secondary" disabled={status !== "idle"} onClick={handleCloudLogout} type="button">
              <LogOut size={17} strokeWidth={2.8} />
              <span>Cloud Logout</span>
            </button>
          ) : null}
        </section> : null}

        {!isGate ? <section className="account-section">
          <div className="account-section-head">
            <span>Local Save</span>
            <strong>{saveSummary.skills} Skills</strong>
          </div>
          <div className="account-save-grid">
            <div>
              <span>RAP</span>
              <strong>{saveSummary.rap}</strong>
            </div>
            <div>
              <span>Activities</span>
              <strong>{saveSummary.activities}</strong>
            </div>
            <div>
              <span>Log</span>
              <strong>{saveSummary.activityLog}</strong>
            </div>
          </div>
          <button className="account-button account-button-secondary" onClick={refreshSaveSummary} type="button">
            <Download size={17} strokeWidth={2.8} />
            <span>Refresh Save</span>
          </button>
        </section> : null}
      </div>
    </ContentPanel>
  );
}
