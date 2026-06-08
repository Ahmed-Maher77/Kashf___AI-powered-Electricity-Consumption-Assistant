import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Smartphone, History, Trash2, ChevronRight, X, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import Button from "../premium/Button";
import { useAuth } from "../../hooks/useAuth";
import { setUser, logout as logoutAction } from "../../store/auth/authSlice";
import { getAccessToken } from "../../auth/authStorage";
import { decodeJwtPayload } from "../../auth/tokenUtils";
import {
  changePassword,
  setup2fa,
  enable2fa,
  disable2fa,
  getDevices,
  revokeDevice,
  getLoginHistory,
  deleteAccount
} from "../../services/securityService";

// Helper to parse user agents into a clean browser + OS description
const parseUA = (ua, t) => {
  if (!ua) return t("security.devicesModal.unknown") || "Unknown Device";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edge")) browser = "Edge";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

  return `${browser} on ${os}`;
};

const SecuritySettings = () => {
  const { t: translate, i18n } = useTranslation();
  const t = (key, options) => {
    if (key && key.startsWith("security.")) {
      return translate("profile." + key, options);
    }
    return translate(key, options);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRTL = i18n.dir() === "rtl";

  // Get current session ID from accessToken
  const token = getAccessToken();
  const tokenPayload = token ? decodeJwtPayload(token) : null;
  const currentSessionId = tokenPayload?.sessionId;

  // Active Modals State
  const [activeModal, setActiveModal] = useState(null); // 'password' | '2fa' | 'devices' | 'history' | 'delete'

  // General Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // 2FA state
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [passwordFor2faDisable, setPasswordFor2faDisable] = useState("");

  // Devices & History states
  const [devices, setDevices] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  // Account Delete State
  const [deletePassword, setDeletePassword] = useState("");

  // Clean state when opening a modal
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setError("");
    setSuccess("");
    setLoading(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTwoFactorSecret("");
    setTwoFactorCode("");
    setPasswordFor2faDisable("");
    setDeletePassword("");
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // 1. Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(t("security.changePasswordModal.mismatch"));
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(t("security.changePasswordModal.success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // 2. 2FA setups & toggles
  // Fetch secret on 2FA modal open if 2FA is currently disabled
  useEffect(() => {
    if (activeModal === "2fa" && !user.twoFactorEnabled) {
      const init2faSetup = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await setup2fa();
          setTwoFactorSecret(res?.data?.secret || "");
        } catch (err) {
          setError(err.message || "Failed to initialize 2FA setup.");
        } finally {
          setLoading(false);
        }
      };
      init2faSetup();
    }
  }, [activeModal, user.twoFactorEnabled]);

  const handleEnable2fa = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await enable2fa(twoFactorCode);
      dispatch(setUser({ ...user, twoFactorEnabled: true }));
      setSuccess(t("security.twoFactorModal.successEnabled"));
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      setError(err.message || "Failed to enable 2FA.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2fa = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await disable2fa(passwordFor2faDisable);
      dispatch(setUser({ ...user, twoFactorEnabled: false }));
      setSuccess(t("security.twoFactorModal.successDisabled"));
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      setError(err.message || "Failed to disable 2FA.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Active Devices fetch & revoke
  useEffect(() => {
    if (activeModal === "devices") {
      fetchDevices();
    }
  }, [activeModal]);

  const fetchDevices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDevices();
      setDevices(res?.data?.sessions || []);
    } catch (err) {
      setError(err.message || "Failed to retrieve active devices.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (sessionId) => {
    setError("");
    try {
      await revokeDevice(sessionId);
      setSuccess(t("security.devicesModal.revokeSuccess"));
      // Refresh list
      await fetchDevices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to revoke device.");
    }
  };

  // 4. Login History fetch
  useEffect(() => {
    if (activeModal === "history") {
      const fetchHistory = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await getLoginHistory();
          setLoginHistory(res?.data?.history || []);
        } catch (err) {
          setError(err.message || "Failed to retrieve login history.");
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [activeModal]);

  // 5. Account Delete handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await deleteAccount(deletePassword);
      setSuccess(t("security.deleteModal.success"));
      setTimeout(() => {
        dispatch(logoutAction());
        navigate("/register", { replace: true });
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete account.");
      setLoading(false);
    }
  };

  const securityOptions = [
    {
      type: "password",
      icon: Lock,
      label: t("security.changePassword"),
      description: t("security.changePasswordDesc"),
      action: t("security.changePassword"),
    },
    {
      type: "2fa",
      icon: Shield,
      label: t("security.twoFactorAuth"),
      description: t("security.twoFactorAuthDesc"),
      action: user.twoFactorEnabled ? t("security.actions.disable") : t("security.actions.enable"),
    },
    {
      type: "devices",
      icon: Smartphone,
      label: t("security.activeDevices"),
      description: t("security.activeDevicesDesc"),
      action: t("security.actions.view"),
    },
    {
      type: "history",
      icon: History,
      label: t("security.loginHistory"),
      description: t("security.loginHistoryDesc"),
      action: t("security.actions.view"),
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-kashf-blue" />
        <h2 className="text-lg font-semibold text-white">{t("security.title")}</h2>
      </div>

      <div className="space-y-3 mb-6">
        {securityOptions.map((option) => (
          <div
            key={option.type}
            className="flex items-center justify-between p-4 bg-kashf-bg/50 rounded-xl border border-kashf-border/50 hover:border-kashf-blue/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-kashf-blue/10 rounded-lg p-2">
                <option.icon className="w-4 h-4 text-kashf-blue" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">{option.label}</p>
                  {option.type === "2fa" && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${user.twoFactorEnabled ? "bg-green-500/20 text-green-400" : "bg-neutral-500/20 text-neutral-400"}`}>
                      {user.twoFactorEnabled ? t("security.status.enabled") : t("security.status.disabled")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{option.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => openModal(option.type)}>
              {option.action}
              {isRTL ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-kashf-border/50">
        <Button variant="danger" size="sm" className="flex items-center gap-2" onClick={() => openModal("delete")}>
          <Trash2 className="w-4 h-4" />
          {t("security.deleteAccount")}
        </Button>
      </div>

      {/* ─── Change Password Modal ────────────────────────────────────────── */}
      {activeModal === "password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm">
          <div className="bg-neutral-900/95 border border-neutral-800 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-neutral-400 hover:text-neutral-200 transition-colors`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{t("security.changePasswordModal.title")}</h3>

            {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && (
              <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.changePasswordModal.currentPassword")}</label>
                <input
                  type={showPass.current ? "text" : "password"}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-kashf-blue"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                  className={`absolute bottom-2.5 ${isRTL ? "left-3" : "right-3"} text-neutral-500 hover:text-neutral-300`}
                >
                  {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.changePasswordModal.newPassword")}</label>
                <input
                  type={showPass.new ? "text" : "password"}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-kashf-blue"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                  className={`absolute bottom-2.5 ${isRTL ? "left-3" : "right-3"} text-neutral-500 hover:text-neutral-300`}
                >
                  {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.changePasswordModal.confirmPassword")}</label>
                <input
                  type={showPass.confirm ? "text" : "password"}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-kashf-blue"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                  className={`absolute bottom-2.5 ${isRTL ? "left-3" : "right-3"} text-neutral-500 hover:text-neutral-300`}
                >
                  {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("security.actions.save")}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ─── Two-Factor Authentication Modal ──────────────────────────────── */}
      {activeModal === "2fa" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm">
          <div className="bg-neutral-900/95 border border-neutral-800 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-neutral-400 hover:text-neutral-200 transition-colors`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{t("security.twoFactorModal.title")}</h3>

            {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && (
              <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {!user.twoFactorEnabled ? (
              <form onSubmit={handleEnable2fa} className="space-y-4 text-center">
                <p className="text-sm text-neutral-300 mb-4">{t("security.twoFactorModal.enableInstructions")}</p>

                {loading && !twoFactorSecret ? (
                  <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 text-kashf-blue animate-spin" /></div>
                ) : (
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl mb-4">
                    <span className="block text-xs text-neutral-400 mb-1">{t("security.twoFactorModal.secretKey")}</span>
                    <span className="font-mono text-white text-sm select-all tracking-wider">{twoFactorSecret}</span>
                  </div>
                )}

                <div className="text-right">
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.twoFactorModal.enterCode")}</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-kashf-blue font-mono text-center tracking-widest text-lg"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("security.actions.enable")}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleDisable2fa} className="space-y-4">
                <p className="text-sm text-neutral-300 text-center mb-4">{t("security.twoFactorModal.disableInstructions")}</p>

                <div className="relative text-right">
                  <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.twoFactorModal.confirmPassword")}</label>
                  <input
                    type={showPass.current ? "text" : "password"}
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-kashf-blue text-left"
                    value={passwordFor2faDisable}
                    onChange={(e) => setPasswordFor2faDisable(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                    className={`absolute bottom-2.5 ${isRTL ? "left-3" : "right-3"} text-neutral-500 hover:text-neutral-300`}
                  >
                    {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Button type="submit" variant="danger" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("security.actions.disable")}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Active Devices Modal ────────────────────────────────────────── */}
      {activeModal === "devices" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm">
          <div className="bg-neutral-900/95 border border-neutral-800 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-neutral-400 hover:text-neutral-200 transition-colors`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{t("security.devicesModal.title")}</h3>

            {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{success}</div>}

            {loading && devices.length === 0 ? (
              <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 text-kashf-blue animate-spin" /></div>
            ) : devices.length === 0 ? (
              <p className="text-center text-sm text-neutral-400 py-6">{t("security.devicesModal.empty") || "No active devices found."}</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {devices.map((device, idx) => {
                  const isCurrent = currentSessionId ? (currentSessionId === device._id) : (idx === 0);
                  return (
                    <div key={device._id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-neutral-400" />
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <span className="block text-sm text-white font-medium">{parseUA(device.userAgent, t)}</span>
                          <span className="block text-xs text-neutral-500 font-mono">{device.ip}</span>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] font-semibold text-kashf-blue bg-kashf-blue/10 px-2 py-0.5 rounded-full">
                          {t("security.devicesModal.current")}
                        </span>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10" onClick={() => handleRevokeDevice(device._id)}>
                          {t("security.actions.revoke")}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Login History Modal ─────────────────────────────────────────── */}
      {activeModal === "history" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm">
          <div className="bg-neutral-900/95 border border-neutral-800 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-neutral-400 hover:text-neutral-200 transition-colors`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{t("security.historyModal.title")}</h3>

            {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

            {loading && loginHistory.length === 0 ? (
              <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 text-kashf-blue animate-spin" /></div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto pr-1">
                <table className="w-full text-xs text-neutral-300 text-center">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400">
                      <th className="py-2 text-right">{t("security.historyModal.time")}</th>
                      <th className="py-2">{t("security.historyModal.ip")}</th>
                      <th className="py-2 text-left">{t("security.historyModal.device")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((history) => (
                      <tr key={history._id} className="border-b border-neutral-800/40 hover:bg-neutral-950/40">
                        <td className="py-2 text-right">{new Date(history.createdAt).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US", { dateStyle: "short", timeStyle: "short" })}</td>
                        <td className="py-2 font-mono">{history.metadata?.ip || "Unknown"}</td>
                        <td className="py-2 text-left truncate max-w-[120px]" title={history.metadata?.userAgent}>{parseUA(history.metadata?.userAgent, t)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Delete Account Modal ────────────────────────────────────────── */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm">
          <div className="bg-neutral-900/95 border border-red-900/35 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
            <button onClick={closeModal} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer`}>
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-red-500 mb-4 text-center">{t("security.deleteModal.title")}</h3>

            {error && <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && <div className="p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{success}</div>}

            <p className="text-xs text-red-400 px-1 py-3 rounded-xl mb-4 leading-relaxed text-right">
              {t("security.deleteModal.warning")}
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="relative text-right">
                <label className="block text-xs font-semibold text-neutral-400 mb-2">{t("security.deleteModal.confirmText")}</label>
                <input
                  type={showPass.current ? "text" : "password"}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                  className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"} text-neutral-500 hover:text-neutral-300`}
                >
                  {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" variant="danger" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("security.deleteModal.button")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
