import React, { useEffect, useMemo, useState } from "react";
import { Cloud, Download, KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { ContentPanel } from "../../components/ContentPanel.jsx";
import { exportLocalGameSave } from "../../storage/localSave.js";
import {
  getDemoCredentials,
  getLocalAccountSession,
  signInLocalDemoAccount,
  signOutLocalDemoAccount,
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

export function AccountPanel() {
  const demoCredentials = useMemo(() => getDemoCredentials(), []);
  const [cloudUser, setCloudUser] = useState(null);
  const [email, setEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [localSession, setLocalSession] = useState(() => getLocalAccountSession());
  const [localUsername, setLocalUsername] = useState(demoCredentials.username);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLocalLogin = (event) => {
    event.preventDefault();

    try {
      const session = signInLocalDemoAccount(localUsername, localPassword);
      setLocalSession(session);
      setLocalPassword("");
      setMessage("Local demo account active.");
      refreshSaveSummary();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLocalLogout = () => {
    signOutLocalDemoAccount();
    setLocalSession(null);
    setMessage("Local demo account signed out.");
  };

  const handleCloudAuth = async (event, action) => {
    event.preventDefault();
    setStatus(action);
    setMessage("");

    try {
      const user = action === "signup"
        ? await signUpCloudAccount(email, password)
        : await signInCloudAccount(email, password);
      setCloudUser(user);
      setPassword("");
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
        { Icon: ShieldCheck, label: "Mode", value: cloudUser ? "Cloud" : localSession ? "Demo" : "Local" },
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
            Local progress remains on this device until Cloud Save is configured and a cloud account is signed in.
          </p>
          {message ? <p className="account-message" role="status">{message}</p> : null}
        </section>

        <section className="account-section">
          <div className="account-section-head">
            <span>Local Demo</span>
            <strong>Admin</strong>
          </div>
          {localSession ? (
            <button className="account-button" onClick={handleLocalLogout} type="button">
              <LogOut size={17} strokeWidth={2.8} />
              <span>Logout Demo</span>
            </button>
          ) : (
            <form className="account-form" onSubmit={handleLocalLogin}>
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
                  placeholder={demoCredentials.password}
                  type="password"
                  value={localPassword}
                />
              </label>
              <button className="account-button" type="submit">
                <KeyRound size={17} strokeWidth={2.8} />
                <span>Login Demo</span>
              </button>
            </form>
          )}
        </section>

        <section className="account-section">
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
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
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
        </section>

        <section className="account-section">
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
        </section>
      </div>
    </ContentPanel>
  );
}

