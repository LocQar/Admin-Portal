import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Cloud, RefreshCw, Plus, Power, Download, Upload, Save, ChevronRight,
  Wifi, WifiOff, Server, Cpu, Shield, Bell, Wrench, Tag, MapPin,
  Thermometer, Battery, DoorOpen, Users, Lock, Unlock, Eye, EyeOff,
  Monitor, Printer, Camera, QrCode, Fingerprint, Radio, Globe,
  CheckCircle2, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp,
  Loader2, Trash2, Settings, X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { GlassCard } from "../components/ui/Card";
import { cloudConfig } from "@/shared/config/cloud";

// API points to the NestJS dashboard-api which now exposes /stations endpoints.
const API = cloudConfig.apiUrl === "/api"
  ? (import.meta.env.VITE_LOCKER_CLOUD_URL ?? "https://api.locqar.com")
  : cloudConfig.apiUrl;
const AUTH_TOKEN = localStorage.getItem("token") ?? "";
const hdrs = { "Authorization": `Bearer ${AUTH_TOKEN}`, "Content-Type": "application/json" };

const DEFAULT_META = {
  compartments: { small: 12, medium: 8, large: 4, xl: 2 },
  screenType: "touch-15", printerEnabled: true, cameraEnabled: true,
  qrEnabled: true, pinEnabled: true, doorSensorEnabled: true,
  primaryConn: "4g", backupConn: "wifi", apn: "internet.mtn.com.gh",
  mqttBroker: "mqtt.locqar.io", mqttPort: "8883", pingInterval: "30",
  reconnectDelay: "5", tlsEnabled: true, vpnEnabled: false,
  otpEnabled: true, otpExpiry: "15", pinLength: "6", maxAttempts: "3",
  lockoutDuration: "30", adminBypass: false, auditLog: true, remoteUnlock: true,
  tempHigh: "45", batteryLow: "20", doorOpenTimeout: "120", occupancyAlert: "90",
  offlineAlert: "5", emailAlert: true, smsAlert: true, webhookAlert: false,
  alertEmail: "ops@locqar.io",
  maintenanceWindow: "02:00", maintenanceDuration: "2", autoRestart: true,
  firmwareAuto: false, firmwareVersion: "2.4.1", diagUpload: true, diagInterval: "6",
};

function parseMeta(locker) {
  try {
    if (locker.description && locker.description.startsWith("{")) {
      return { ...DEFAULT_META, ...JSON.parse(locker.description) };
    }
  } catch {}
  return { ...DEFAULT_META };
}

function serializeMeta(cfg) {
  const meta = {};
  Object.keys(DEFAULT_META).forEach(k => { meta[k] = cfg[k]; });
  return JSON.stringify(meta);
}

async function api(method, path, body) {
  const opts = { method, headers: hdrs };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}/${path}`, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data;
}

// ── Small reusable components ───────────────────────────────────────────────

const Toggle = ({ on, onToggle, theme }) => (
  <button
    onClick={onToggle}
    className="relative rounded-full transition-colors"
    style={{
      width: 40, height: 22,
      backgroundColor: on ? theme.status.success : theme.bg.tertiary,
      border: `1px solid ${on ? theme.status.success : theme.border.secondary}`,
    }}
  >
    <div
      className="absolute top-0.5 rounded-full transition-transform"
      style={{
        width: 16, height: 16,
        backgroundColor: on ? "#fff" : theme.text.muted,
        transform: on ? "translateX(20px)" : "translateX(3px)",
      }}
    />
  </button>
);

const Badge = ({ children, color, theme }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
    style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}25` }}
  >
    {children}
  </span>
);

const SectionCard = ({ title, icon: Icon, badge, children, theme, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlassCard noPadding className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
        style={{ borderBottom: open ? `1px solid ${theme.border.primary}` : "none" }}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} style={{ color: theme.text.muted }} />}
          <span className="text-sm font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono, letterSpacing: "0.03em" }}>{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {badge}
          {open ? <ChevronUp size={14} style={{ color: theme.text.muted }} /> : <ChevronDown size={14} style={{ color: theme.text.muted }} />}
        </div>
      </button>
      {open && <div className="px-5 py-4 space-y-4">{children}</div>}
    </GlassCard>
  );
};

const Field = ({ label, children, theme, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>{label}</label>
    {children}
    {error && <span className="text-xs" style={{ color: theme.status.error }}>{error}</span>}
  </div>
);

const Input = ({ theme, error, ...props }) => (
  <input
    className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors"
    style={{
      backgroundColor: theme.bg.input,
      borderColor: error ? theme.status.error : theme.border.primary,
      color: theme.text.primary,
      fontFamily: theme.font.mono,
      fontSize: 13,
    }}
    {...props}
  />
);

const Select = ({ theme, children, ...props }) => (
  <select
    className="w-full rounded-xl border px-3 py-2 text-sm outline-none appearance-none"
    style={{
      backgroundColor: theme.bg.input,
      borderColor: theme.border.primary,
      color: theme.text.primary,
      fontFamily: theme.font.mono,
      fontSize: 13,
    }}
    {...props}
  >
    {children}
  </select>
);

const InfoRow = ({ label, value, theme, valueColor }) => (
  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
    <span className="text-xs" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>{label}</span>
    <span className="text-sm font-medium" style={{ color: valueColor || theme.text.primary, fontFamily: theme.font.mono }}>{value}</span>
  </div>
);

const ToggleRow = ({ label, desc, on, onToggle, theme }) => (
  <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
    <div className="flex flex-col gap-0.5">
      <span className="text-sm" style={{ color: theme.text.primary }}>{label}</span>
      {desc && <span className="text-xs" style={{ color: theme.text.muted }}>{desc}</span>}
    </div>
    <Toggle on={on} onToggle={onToggle} theme={theme} />
  </div>
);

const StatusCard = ({ label, value, sub, color, icon: Icon, theme }) => (
  <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>{label}</span>
      {Icon && <Icon size={14} style={{ color: theme.text.muted }} />}
    </div>
    <div className="text-xl font-bold" style={{ color: color || theme.text.primary, fontFamily: theme.font.mono }}>{value}</div>
    {sub && <div className="text-xs mt-1" style={{ color: theme.text.muted }}>{sub}</div>}
  </div>
);

// ── Create Modal ────────────────────────────────────────────────────────────

const CreateLockerModal = ({ onClose, onCreated, theme }) => {
  const [form, setForm] = useState({ code: "", name: "", serialNumber: "", location: "", latitude: "", longitude: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = "Required";
    else if (!/^[A-Z0-9][A-Z0-9-]*$/.test(form.code)) e.code = "Uppercase, digits, hyphens only";
    if (!form.name.trim()) e.name = "Required";
    if (!form.serialNumber.trim()) e.serialNumber = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (form.latitude && isNaN(Number(form.latitude))) e.latitude = "Must be a number";
    if (form.longitude && isNaN(Number(form.longitude))) e.longitude = "Must be a number";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true); setError("");
    try {
      const body = {
        sn: form.serialNumber.trim(),
        name: form.name.trim(),
        location: form.location.trim(),
        doorCount: 0,
        doorStates: {},
      };
      if (form.latitude) body.lat = Number(form.latitude);
      if (form.longitude) body.lng = Number(form.longitude);
      const result = await api("POST", "stations/register", body);
      onCreated(result);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const s = (k, v) => { setForm(p => ({ ...p, [k]: v })); setFieldErrors(p => ({ ...p, [k]: undefined })); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <GlassCard noPadding className="w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <span className="text-sm font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>REGISTER NEW LOCKER</span>
          <button onClick={onClose} className="text-lg" style={{ color: theme.text.muted }}>&times;</button>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="text-xs p-3 rounded-xl" style={{ backgroundColor: `${theme.status.error}12`, color: theme.status.error, border: `1px solid ${theme.status.error}30` }}>{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Locker Code *" theme={theme} error={fieldErrors.code}>
              <Input theme={theme} error={fieldErrors.code} value={form.code} onChange={e => s("code", e.target.value.toUpperCase())} placeholder="ACCRA-MALL-01" />
            </Field>
            <Field label="Display Name *" theme={theme} error={fieldErrors.name}>
              <Input theme={theme} error={fieldErrors.name} value={form.name} onChange={e => s("name", e.target.value)} placeholder="Accra Mall Bay 1" />
            </Field>
          </div>
          <Field label="Winnsen Serial *" theme={theme} error={fieldErrors.serialNumber}>
            <Input theme={theme} error={fieldErrors.serialNumber} value={form.serialNumber} onChange={e => s("serialNumber", e.target.value)} placeholder="WINNSEN-SN-001" />
          </Field>
          <Field label="Physical Location *" theme={theme} error={fieldErrors.location}>
            <Input theme={theme} error={fieldErrors.location} value={form.location} onChange={e => s("location", e.target.value)} placeholder="Accra Mall, Spintex Road" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude" theme={theme} error={fieldErrors.latitude}>
              <Input theme={theme} error={fieldErrors.latitude} value={form.latitude} onChange={e => s("latitude", e.target.value)} placeholder="5.6037" />
            </Field>
            <Field label="Longitude" theme={theme} error={fieldErrors.longitude}>
              <Input theme={theme} error={fieldErrors.longitude} value={form.longitude} onChange={e => s("longitude", e.target.value)} placeholder="-0.187" />
            </Field>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
          <button onClick={onClose} className="btn-outline px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Creating..." : "Create Locker"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

// ── Deactivate Modal ────────────────────────────────────────────────────────

const DeactivateModal = ({ locker, onClose, onDone, theme }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const code = locker.code || locker.id;

  const handle = async () => {
    setSaving(true); setError("");
    try {
      await api("PATCH", `stations/${code}`, { name: locker.name, location: locker.location });
      onDone(code);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <GlassCard noPadding className="w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <span className="text-sm font-semibold" style={{ color: theme.status.error, fontFamily: theme.font.mono }}>DEACTIVATE LOCKER</span>
          <button onClick={onClose} className="text-lg" style={{ color: theme.text.muted }}>&times;</button>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="text-xs p-3 rounded-xl" style={{ backgroundColor: `${theme.status.error}12`, color: theme.status.error, border: `1px solid ${theme.status.error}30` }}>{error}</div>}
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${theme.status.error}08`, border: `1px solid ${theme.status.error}20` }}>
            <p className="text-sm" style={{ color: theme.text.primary }}>
              This will deactivate <strong>{code}</strong> ({locker.name || "unnamed"}). It will no longer appear in customer or partner listings.
            </p>
            <p className="text-xs mt-2" style={{ color: theme.text.muted }}>This can be reversed by re-activating the locker.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
          <button onClick={onClose} className="btn-outline px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handle} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2" style={{ backgroundColor: `${theme.status.error}18`, color: theme.status.error, border: `1px solid ${theme.status.error}40` }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Processing..." : "Deactivate"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

// ── NAV CONFIG ──────────────────────────────────────────────────────────────

const NAV = [
  { id: "status",      icon: Server,   label: "Live Status" },
  { id: "identity",    icon: Tag,      label: "Identity" },
  { id: "hardware",    icon: Cpu,      label: "Hardware" },
  { id: "network",     icon: Globe,    label: "Network" },
  { id: "access",      icon: Shield,   label: "Access Control" },
  { id: "alerts",      icon: Bell,     label: "Alerts" },
  { id: "maintenance", icon: Wrench,   label: "Maintenance" },
];

// ── MAIN PAGE ───────────────────────────────────────────────────────────────

export const CloudConfigPage = ({ addToast }) => {
  const { theme } = useTheme();
  const [tab, setTab] = useState("status");
  const [apiStatus, setApiStatus] = useState("checking");
  const [lockers, setLockers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showFirmwareUpdate, setShowFirmwareUpdate] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const fileRef = useRef(null);

  const [cfg, setCfg] = useState({
    displayName: "", lockerCode: "", location: "", region: "Greater Accra",
    operator: "LocQar Ghana Ltd.", timezone: "Africa/Accra", currency: "GHS",
    notes: "", serialNumber: "", active: true, latitude: "", longitude: "",
    ...DEFAULT_META,
  });

  const set = (k, v) => { setCfg(p => ({ ...p, [k]: v })); setDirty(true); };
  const setComp = (k, v) => { setCfg(p => ({ ...p, compartments: { ...p.compartments, [k]: v } })); setDirty(true); };

  const totalComps = useMemo(() => cfg.compartments ? Object.values(cfg.compartments).reduce((a, b) => a + b, 0) : 0, [cfg.compartments]);

  // ── Fetch ─────────────────────────────────────────────────────────────

  const fetchLockers = useCallback(async (silent = false) => {
    try {
      const res = await fetch(`${API}/stations`, { headers: hdrs });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.data || data.lockers || []);
        // Map station fields to the shape the page expects
        const mapped = items.map(s => ({
          ...s,
          code: s.sn || s.code || s.id,
          name: s.name,
          serialNumber: s.sn,
          location: s.location,
          latitude: s.lat,
          longitude: s.lng,
          active: s.status !== 'offline',
        }));
        setLockers(mapped);
        setApiStatus("connected");
        setLastSync(new Date());
        if (!silent && mapped.length > 0) {
          setSelected(mapped[0].code || mapped[0].id);
          loadCfg(mapped[0]);
        }
        return mapped;
      }
      setApiStatus("error");
      if (!silent) loadDemo();
    } catch {
      setApiStatus("error");
      if (!silent) loadDemo();
    }
    return [];
  }, []);

  useEffect(() => {
    fetchLockers().then(() => setLoading(false));
    const iv = setInterval(() => fetchLockers(true), 30000);
    return () => clearInterval(iv);
  }, [fetchLockers]);

  const loadDemo = () => {
    const demo = [
      { code: "ACC-001", name: "Accra Mall", location: "Spintex Road, Accra", active: true, serialNumber: "DEMO-SN-001" },
      { code: "ACC-002", name: "West Hills Mall", location: "Weija, Accra", active: true, serialNumber: "DEMO-SN-002" },
      { code: "KSI-001", name: "Kumasi City Mall", location: "Kumasi", active: true, serialNumber: "DEMO-SN-003" },
      { code: "TMA-001", name: "Tema Community 1", location: "Tema", active: false, serialNumber: "DEMO-SN-004" },
    ];
    setLockers(demo);
    setSelected("ACC-001");
    loadCfg(demo[0]);
  };

  const loadCfg = (locker) => {
    const code = locker.code || locker.id || "N/A";
    const meta = parseMeta(locker);
    setCfg({
      displayName: locker.name || code,
      lockerCode: code,
      region: meta.region || "Greater Accra",
      location: locker.location || "",
      operator: meta.operator || "LocQar Ghana Ltd.",
      timezone: meta.timezone || "Africa/Accra",
      currency: meta.currency || "GHS",
      notes: meta.notes || "",
      serialNumber: locker.serialNumber || "",
      active: locker.active !== false,
      latitude: locker.latitude || "",
      longitude: locker.longitude || "",
      ...meta,
    });
    setDirty(false);
  };

  const handleSelect = (locker) => {
    setSelected(locker.code || locker.id);
    loadCfg(locker);
    setTab("status");
  };

  // ── Save ──────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { name: cfg.displayName, location: cfg.location };
      if (cfg.helpPhoneNumber) body.helpPhoneNumber = cfg.helpPhoneNumber;
      await api("PATCH", `stations/${cfg.lockerCode}`, body);
      setDirty(false);
      setLastSync(new Date());
      addToast?.({ type: "success", message: `Config saved for ${cfg.lockerCode}` });
      const items = await fetchLockers(true);
      const updated = items.find(l => (l.code || l.id) === cfg.lockerCode);
      if (updated) loadCfg(updated);
    } catch (e) {
      addToast?.({ type: "error", message: `Save failed: ${e.message}` });
    }
    setSaving(false);
  };

  const handleApplyAll = async () => {
    setSaving(true);
    let ok = 0, fail = 0;
    const metaJson = serializeMeta(cfg);
    for (const l of lockers) {
      try { await api("PATCH", `stations/${l.code || l.id}`, { name: l.name, location: l.location }); ok++; } catch { fail++; }
    }
    setSaving(false);
    addToast?.({ type: fail ? "warning" : "success", message: fail ? `${ok} updated, ${fail} failed` : `Applied to all ${ok} units` });
  };

  // ── Import / Export ───────────────────────────────────────────────────

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ ...cfg, _exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${cfg.lockerCode}-config.json`; a.click();
    URL.revokeObjectURL(url);
    addToast?.({ type: "info", message: "Config exported as JSON" });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const preserved = { lockerCode: cfg.lockerCode, displayName: cfg.displayName, serialNumber: cfg.serialNumber };
        setCfg(prev => ({ ...prev, ...data, ...preserved }));
        setDirty(true);
        addToast?.({ type: "success", message: `Imported config from ${file.name}` });
      } catch (err) {
        addToast?.({ type: "error", message: `Import failed: ${err.message}` });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const selectedLocker = lockers.find(l => (l.code || l.id) === selected);

  const compMeta = {
    small:  { label: "SMALL",  dims: "25\u00D725\u00D740 cm" },
    medium: { label: "MEDIUM", dims: "35\u00D735\u00D745 cm" },
    large:  { label: "LARGE",  dims: "45\u00D745\u00D755 cm" },
    xl:     { label: "XL",     dims: "60\u00D745\u00D765 cm" },
  };

  // ── Loading state ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="animate-spin mx-auto" style={{ color: theme.text.muted }} />
          <p className="text-sm" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>Connecting to LocQar API...</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-6 space-y-6">
      <input type="file" ref={fileRef} accept=".json" style={{ display: "none" }} onChange={handleImport} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Cloud Config</h1>
          <p className="text-sm" style={{ color: theme.text.muted }}>
            Manage locker hardware configuration across your network.
            <span className="ml-3 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: apiStatus === "connected" ? theme.status.success : theme.status.error }} />
              <span style={{ color: apiStatus === "connected" ? theme.status.success : theme.status.error, fontFamily: theme.font.mono, fontSize: 11 }}>
                {apiStatus === "connected" ? "CONNECTED" : "OFFLINE"}
              </span>
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => fetchLockers(true)} className="btn-outline flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={handleExport} className="btn-outline flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={14} /> Export
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-outline flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Upload size={14} /> Import
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Plus size={14} /> New Locker
          </button>
        </div>
      </div>

      {/* Locker selector + config layout */}
      <div className="flex gap-6">

        {/* Left sidebar - locker list + nav */}
        <div className="w-56 flex-shrink-0 space-y-4">
          {/* Locker chips */}
          <GlassCard className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>
                Units ({lockers.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lockers.map(l => {
                const id = l.code || l.id;
                const isActive = l.active !== false;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelect(l)}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      fontFamily: theme.font.mono,
                      backgroundColor: selected === id ? `${theme.accent.primary}18` : theme.bg.secondary,
                      color: selected === id ? theme.accent.primary : theme.text.muted,
                      border: `1px solid ${selected === id ? `${theme.accent.primary}40` : theme.border.primary}`,
                    }}
                    title={`${l.name || id}${!isActive ? " (inactive)" : ""}`}
                  >
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? theme.status.success : theme.status.error }} />
                    {id}
                  </button>
                );
              })}
            </div>
            {selectedLocker && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.secondary, border: `1px solid ${theme.border.primary}` }}>
                <div className="text-xs font-medium" style={{ color: theme.accent.primary, fontFamily: theme.font.mono }}>{selectedLocker.name || selected}</div>
                <div className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{selectedLocker.location || "\u2014"}</div>
                <div className="mt-2">
                  <Badge color={selectedLocker.active !== false ? theme.status.success : theme.status.error} theme={theme}>
                    {selectedLocker.active !== false ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Section nav */}
          <GlassCard className="space-y-0.5" style={{ padding: '0.5rem' }}>
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all"
                style={{
                  backgroundColor: tab === n.id ? `${theme.accent.primary}12` : "transparent",
                  color: tab === n.id ? theme.accent.primary : theme.text.muted,
                }}
              >
                <n.icon size={15} />
                {n.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Right - config panels */}
        <div className="flex-1 space-y-5 min-w-0">

          {/* ── LIVE STATUS ──────────────────────────────────────────── */}
          {tab === "status" && (<>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>LIVE STATUS</h2>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Real-time overview for {cfg.lockerCode}</p>
              </div>
              {selectedLocker && (
                <button onClick={() => setShowDeactivate(true)} className="btn-outline flex items-center gap-2 px-3 py-2 rounded-xl border text-xs" style={{ borderColor: `${theme.status.error}40`, color: theme.status.error }}>
                  <Power size={13} /> Deactivate
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatusCard label="Compartments" value={totalComps} sub={`${cfg.compartments.small}S / ${cfg.compartments.medium}M / ${cfg.compartments.large}L / ${cfg.compartments.xl}XL`} color={theme.chart.amber} icon={Cpu} theme={theme} />
              <StatusCard label="Connectivity" value={apiStatus === "connected" ? "Online" : "Offline"} sub={`${cfg.primaryConn?.toUpperCase()} + ${cfg.backupConn?.toUpperCase()}`} color={apiStatus === "connected" ? theme.status.success : theme.status.error} icon={apiStatus === "connected" ? Wifi : WifiOff} theme={theme} />
              <StatusCard label="Firmware" value={`v${cfg.firmwareVersion}`} sub={cfg.firmwareAuto ? "Auto-update ON" : "Manual"} color={theme.chart.blue} icon={Settings} theme={theme} />
              <StatusCard label="Last Sync" value={lastSync ? lastSync.toLocaleTimeString() : "\u2014"} sub={lastSync ? lastSync.toLocaleDateString() : "No data"} color={theme.text.primary} icon={RefreshCw} theme={theme} />
            </div>

            <SectionCard title="UNIT DETAILS" icon={Tag} theme={theme}>
              <InfoRow label="Locker Code" value={cfg.lockerCode} theme={theme} />
              <InfoRow label="Display Name" value={cfg.displayName} theme={theme} />
              <InfoRow label="Serial Number" value={cfg.serialNumber || "\u2014"} theme={theme} />
              <InfoRow label="Location" value={cfg.location || "\u2014"} theme={theme} />
              <InfoRow label="Coordinates" value={cfg.latitude && cfg.longitude ? `${cfg.latitude}, ${cfg.longitude}` : "\u2014"} theme={theme} />
              <InfoRow label="Operator" value={cfg.operator} theme={theme} />
              <InfoRow label="Timezone" value={cfg.timezone} theme={theme} />
              <InfoRow label="Currency" value={cfg.currency} theme={theme} />
            </SectionCard>

            <SectionCard title="ALERT THRESHOLDS" icon={AlertTriangle} theme={theme}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCard label="Temp Limit" value={`${cfg.tempHigh}\u00B0C`} icon={Thermometer} color={theme.chart.coral} theme={theme} />
                <StatusCard label="Battery Alert" value={`${cfg.batteryLow}%`} icon={Battery} color={theme.status.error} theme={theme} />
                <StatusCard label="Door Timeout" value={`${cfg.doorOpenTimeout}s`} icon={DoorOpen} color={theme.chart.blue} theme={theme} />
                <StatusCard label="Occupancy" value={`${cfg.occupancyAlert}%`} icon={Users} color={theme.chart.amber} theme={theme} />
              </div>
            </SectionCard>

            <SectionCard title="SECURITY OVERVIEW" icon={Shield} theme={theme}>
              <InfoRow label="OTP Access" value={cfg.otpEnabled ? "Enabled" : "Disabled"} valueColor={cfg.otpEnabled ? theme.status.success : theme.text.muted} theme={theme} />
              <InfoRow label="PIN Length" value={`${cfg.pinLength} digits`} theme={theme} />
              <InfoRow label="Max Attempts" value={cfg.maxAttempts} theme={theme} />
              <InfoRow label="Lockout" value={`${cfg.lockoutDuration} min`} theme={theme} />
              <InfoRow label="Admin Bypass" value={cfg.adminBypass ? "ENABLED" : "Disabled"} valueColor={cfg.adminBypass ? theme.status.warning : theme.text.muted} theme={theme} />
              <InfoRow label="Audit Logging" value={cfg.auditLog ? "Full" : "Minimal"} theme={theme} />
              <InfoRow label="Remote Unlock" value={cfg.remoteUnlock ? "Enabled" : "Disabled"} theme={theme} />
            </SectionCard>
          </>)}

          {/* ── IDENTITY ─────────────────────────────────────────────── */}
          {tab === "identity" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>IDENTITY</h2>
            <SectionCard title="UNIT IDENTITY" icon={Tag} badge={<Badge color={cfg.active ? theme.status.success : theme.status.error} theme={theme}>{cfg.active ? "ACTIVE" : "INACTIVE"}</Badge>} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Display Name" theme={theme}><Input theme={theme} value={cfg.displayName} onChange={e => set("displayName", e.target.value)} /></Field>
                <Field label="Locker Code" theme={theme}><Input theme={theme} value={cfg.lockerCode} readOnly style={{ opacity: 0.5 }} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Serial Number" theme={theme}><Input theme={theme} value={cfg.serialNumber} onChange={e => set("serialNumber", e.target.value)} /></Field>
                <Field label="Status" theme={theme}>
                  <div className="flex items-center gap-3 pt-1">
                    <Toggle on={cfg.active} onToggle={() => set("active", !cfg.active)} theme={theme} />
                    <span className="text-sm font-medium" style={{ color: cfg.active ? theme.status.success : theme.status.error, fontFamily: theme.font.mono }}>{cfg.active ? "ACTIVE" : "INACTIVE"}</span>
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Region" theme={theme}>
                  <Select theme={theme} value={cfg.region} onChange={e => set("region", e.target.value)}>
                    <option>Greater Accra</option><option>Ashanti</option><option>Western</option><option>Central</option><option>Northern</option>
                  </Select>
                </Field>
                <Field label="Timezone" theme={theme}>
                  <Select theme={theme} value={cfg.timezone} onChange={e => set("timezone", e.target.value)}>
                    <option value="Africa/Accra">Africa/Accra (GMT+0)</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  </Select>
                </Field>
              </div>
              <Field label="Physical Location" theme={theme}>
                <Input theme={theme} value={cfg.location} onChange={e => set("location", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude" theme={theme}><Input theme={theme} value={cfg.latitude} onChange={e => set("latitude", e.target.value)} placeholder="5.6037" /></Field>
                <Field label="Longitude" theme={theme}><Input theme={theme} value={cfg.longitude} onChange={e => set("longitude", e.target.value)} placeholder="-0.187" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Operating Entity" theme={theme}><Input theme={theme} value={cfg.operator} onChange={e => set("operator", e.target.value)} /></Field>
                <Field label="Currency" theme={theme}>
                  <Select theme={theme} value={cfg.currency} onChange={e => set("currency", e.target.value)}>
                    <option value="GHS">GHS — Ghana Cedi</option><option value="USD">USD — US Dollar</option>
                  </Select>
                </Field>
              </div>
              <Field label="Internal Notes" theme={theme}>
                <textarea className="w-full rounded-xl border px-3 py-2 text-sm outline-none resize-y" rows={3} style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, fontFamily: theme.font.mono, fontSize: 13 }} value={cfg.notes} onChange={e => set("notes", e.target.value)} />
              </Field>
            </SectionCard>

            <SectionCard title="UNIT METADATA" icon={Info} theme={theme}>
              <InfoRow label="Firmware Version" value={cfg.firmwareVersion} theme={theme} />
              <InfoRow label="LocQar Serial" value={`LQ-${cfg.lockerCode}-2024`} theme={theme} />
              <InfoRow label="Last Sync" value={lastSync ? lastSync.toLocaleString() : "N/A"} theme={theme} />
              <InfoRow label="Total Compartments" value={totalComps} theme={theme} />
            </SectionCard>
          </>)}

          {/* ── HARDWARE ─────────────────────────────────────────────── */}
          {tab === "hardware" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>HARDWARE</h2>
            <SectionCard title="COMPARTMENT LAYOUT" icon={Cpu} badge={<Badge color={theme.chart.amber} theme={theme}>{totalComps} TOTAL</Badge>} theme={theme}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(compMeta).map(([k, m]) => (
                  <div key={k} className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
                    <div className="text-xs font-semibold" style={{ color: theme.chart.amber, fontFamily: theme.font.mono }}>{m.label}</div>
                    <div className="text-xs" style={{ color: theme.text.muted }}>{m.dims}</div>
                    <div className="flex items-center gap-3 pt-1">
                      <button onClick={() => setComp(k, Math.max(0, cfg.compartments[k] - 1))} className="w-6 h-6 rounded-lg flex items-center justify-center text-sm border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>&minus;</button>
                      <span className="text-lg font-bold" style={{ color: theme.text.primary, fontFamily: theme.font.mono, minWidth: 28, textAlign: "center" }}>{cfg.compartments[k]}</span>
                      <button onClick={() => setComp(k, cfg.compartments[k] + 1)} className="w-6 h-6 rounded-lg flex items-center justify-center text-sm border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="DISPLAY & PERIPHERALS" icon={Monitor} theme={theme}>
              <Field label="Screen Type" theme={theme}>
                <Select theme={theme} value={cfg.screenType} onChange={e => set("screenType", e.target.value)}>
                  <option value="touch-15">15" Touchscreen</option><option value="touch-10">10" Touchscreen</option><option value="lcd-7">7" LCD (non-touch)</option>
                </Select>
              </Field>
              <ToggleRow label="Receipt Printer" desc="Thermal printer for transaction receipts" on={cfg.printerEnabled} onToggle={() => set("printerEnabled", !cfg.printerEnabled)} theme={theme} />
              <ToggleRow label="Security Camera" desc="Wide-angle locker-facing camera" on={cfg.cameraEnabled} onToggle={() => set("cameraEnabled", !cfg.cameraEnabled)} theme={theme} />
              <ToggleRow label="QR Code Scanner" desc="For scanning delivery barcodes and user QR codes" on={cfg.qrEnabled} onToggle={() => set("qrEnabled", !cfg.qrEnabled)} theme={theme} />
              <ToggleRow label="PIN Pad" desc="Physical numeric keypad for PIN entry" on={cfg.pinEnabled} onToggle={() => set("pinEnabled", !cfg.pinEnabled)} theme={theme} />
              <ToggleRow label="Door Open Sensors" desc="Magnetic sensors on each compartment door" on={cfg.doorSensorEnabled} onToggle={() => set("doorSensorEnabled", !cfg.doorSensorEnabled)} theme={theme} />
            </SectionCard>
          </>)}

          {/* ── NETWORK ──────────────────────────────────────────────── */}
          {tab === "network" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>NETWORK</h2>
            <SectionCard title="CONNECTIVITY" icon={Wifi} badge={<Badge color={theme.status.success} theme={theme}>ONLINE</Badge>} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Primary Connection" theme={theme}>
                  <Select theme={theme} value={cfg.primaryConn} onChange={e => set("primaryConn", e.target.value)}>
                    <option value="4g">4G LTE</option><option value="wifi">Wi-Fi</option><option value="ethernet">Ethernet</option>
                  </Select>
                </Field>
                <Field label="Backup Connection" theme={theme}>
                  <Select theme={theme} value={cfg.backupConn} onChange={e => set("backupConn", e.target.value)}>
                    <option value="wifi">Wi-Fi</option><option value="4g">4G LTE</option><option value="none">None</option>
                  </Select>
                </Field>
              </div>
              <Field label="APN (Mobile Data)" theme={theme}><Input theme={theme} value={cfg.apn} onChange={e => set("apn", e.target.value)} /></Field>
            </SectionCard>
            <SectionCard title="MQTT / MESSAGING" icon={Radio} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Broker Host" theme={theme}><Input theme={theme} value={cfg.mqttBroker} onChange={e => set("mqttBroker", e.target.value)} /></Field>
                <Field label="Port" theme={theme}><Input theme={theme} value={cfg.mqttPort} onChange={e => set("mqttPort", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ping Interval (s)" theme={theme}><Input theme={theme} type="number" value={cfg.pingInterval} onChange={e => set("pingInterval", e.target.value)} /></Field>
                <Field label="Reconnect Delay (s)" theme={theme}><Input theme={theme} type="number" value={cfg.reconnectDelay} onChange={e => set("reconnectDelay", e.target.value)} /></Field>
              </div>
              <ToggleRow label="TLS Encryption" desc="Encrypt all MQTT traffic (port 8883)" on={cfg.tlsEnabled} onToggle={() => set("tlsEnabled", !cfg.tlsEnabled)} theme={theme} />
              <ToggleRow label="VPN Tunnel" desc="Route all traffic through LocQar VPN gateway" on={cfg.vpnEnabled} onToggle={() => set("vpnEnabled", !cfg.vpnEnabled)} theme={theme} />
            </SectionCard>
          </>)}

          {/* ── ACCESS CONTROL ───────────────────────────────────────── */}
          {tab === "access" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>ACCESS CONTROL</h2>
            <SectionCard title="OTP SETTINGS" icon={Lock} theme={theme}>
              <ToggleRow label="Enable OTP Access" desc="One-time passcodes sent via SMS for locker opening" on={cfg.otpEnabled} onToggle={() => set("otpEnabled", !cfg.otpEnabled)} theme={theme} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="OTP Expiry (min)" theme={theme}><Input theme={theme} type="number" value={cfg.otpExpiry} onChange={e => set("otpExpiry", e.target.value)} /></Field>
                <Field label="PIN Length" theme={theme}>
                  <Select theme={theme} value={cfg.pinLength} onChange={e => set("pinLength", e.target.value)}>
                    <option value="4">4 digits</option><option value="6">6 digits</option><option value="8">8 digits</option>
                  </Select>
                </Field>
              </div>
            </SectionCard>
            <SectionCard title="LOCKOUT POLICY" icon={Shield} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Max Failed Attempts" theme={theme}><Input theme={theme} type="number" value={cfg.maxAttempts} onChange={e => set("maxAttempts", e.target.value)} /></Field>
                <Field label="Lockout Duration (min)" theme={theme}><Input theme={theme} type="number" value={cfg.lockoutDuration} onChange={e => set("lockoutDuration", e.target.value)} /></Field>
              </div>
            </SectionCard>
            <SectionCard title="ADMIN & AUDIT" icon={Eye} theme={theme}>
              <ToggleRow label="Admin Emergency Bypass" desc="Allow admin override code to open any compartment" on={cfg.adminBypass} onToggle={() => set("adminBypass", !cfg.adminBypass)} theme={theme} />
              <ToggleRow label="Full Audit Logging" desc="Record every open/close event with timestamp and user ID" on={cfg.auditLog} onToggle={() => set("auditLog", !cfg.auditLog)} theme={theme} />
              <ToggleRow label="Remote Unlock (Ops)" desc="Allow LocQar ops to remotely open compartments via dashboard" on={cfg.remoteUnlock} onToggle={() => set("remoteUnlock", !cfg.remoteUnlock)} theme={theme} />
            </SectionCard>
          </>)}

          {/* ── ALERTS ───────────────────────────────────────────────── */}
          {tab === "alerts" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>ALERTS</h2>
            <SectionCard title="THRESHOLDS" icon={AlertTriangle} theme={theme}>
              {[
                { key: "tempHigh", label: "High Temperature Alert", unit: "\u00B0C" },
                { key: "batteryLow", label: "Low Battery Alert", unit: "%" },
                { key: "doorOpenTimeout", label: "Door Open Timeout", unit: "s" },
                { key: "occupancyAlert", label: "Occupancy Alert", unit: "%" },
                { key: "offlineAlert", label: "Offline Alert After", unit: "min" },
              ].map(({ key, label, unit }) => (
                <div key={key} className="flex items-center gap-4 py-2.5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <span className="flex-1 text-sm" style={{ color: theme.text.primary }}>{label}</span>
                  <input
                    type="number"
                    className="w-20 rounded-lg border px-3 py-1.5 text-sm text-right outline-none"
                    style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, fontFamily: theme.font.mono }}
                    value={cfg[key]}
                    onChange={e => set(key, e.target.value)}
                  />
                  <span className="text-xs w-8" style={{ color: theme.text.muted }}>{unit}</span>
                </div>
              ))}
            </SectionCard>
            <SectionCard title="NOTIFICATION CHANNELS" icon={Bell} theme={theme}>
              <ToggleRow label="Email Alerts" desc="Send critical alerts to ops email" on={cfg.emailAlert} onToggle={() => set("emailAlert", !cfg.emailAlert)} theme={theme} />
              <ToggleRow label="SMS Alerts" desc="Send alerts to registered phone number" on={cfg.smsAlert} onToggle={() => set("smsAlert", !cfg.smsAlert)} theme={theme} />
              <ToggleRow label="Webhook" desc="POST alerts to external endpoint" on={cfg.webhookAlert} onToggle={() => set("webhookAlert", !cfg.webhookAlert)} theme={theme} />
              <Field label="Alert Email" theme={theme}><Input theme={theme} value={cfg.alertEmail} onChange={e => set("alertEmail", e.target.value)} /></Field>
            </SectionCard>
          </>)}

          {/* ── MAINTENANCE ──────────────────────────────────────────── */}
          {tab === "maintenance" && (<>
            <h2 className="text-base font-semibold" style={{ color: theme.text.primary, fontFamily: theme.font.mono }}>MAINTENANCE</h2>
            <SectionCard title="MAINTENANCE WINDOW" icon={Wrench} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Time (Local)" theme={theme}><Input theme={theme} type="time" value={cfg.maintenanceWindow} onChange={e => set("maintenanceWindow", e.target.value)} /></Field>
                <Field label="Duration (hrs)" theme={theme}>
                  <Select theme={theme} value={cfg.maintenanceDuration} onChange={e => set("maintenanceDuration", e.target.value)}>
                    <option value="1">1 hour</option><option value="2">2 hours</option><option value="4">4 hours</option>
                  </Select>
                </Field>
              </div>
              <ToggleRow label="Auto-Restart During Window" desc="Restart unit controller during maintenance window nightly" on={cfg.autoRestart} onToggle={() => set("autoRestart", !cfg.autoRestart)} theme={theme} />
            </SectionCard>
            <SectionCard title="FIRMWARE" icon={Settings} theme={theme}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Installed Version" theme={theme}><Input theme={theme} value={cfg.firmwareVersion} readOnly style={{ opacity: 0.5 }} /></Field>
                <Field label="Latest Available" theme={theme}><Input theme={theme} value="2.5.0" readOnly style={{ color: theme.status.success }} /></Field>
              </div>
              <ToggleRow label="Auto-Update Firmware" desc="Install updates automatically during maintenance window" on={cfg.firmwareAuto} onToggle={() => set("firmwareAuto", !cfg.firmwareAuto)} theme={theme} />
              <button onClick={() => setShowFirmwareUpdate(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl border text-sm w-fit" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                Push Update Now <ChevronRight size={14} />
              </button>
            </SectionCard>
            <SectionCard title="DIAGNOSTICS" icon={Server} theme={theme}>
              <ToggleRow label="Upload Diagnostic Logs" desc="Automatically upload logs to LocQar cloud" on={cfg.diagUpload} onToggle={() => set("diagUpload", !cfg.diagUpload)} theme={theme} />
              <Field label="Upload Interval (hrs)" theme={theme}>
                <Select theme={theme} value={cfg.diagInterval} onChange={e => set("diagInterval", e.target.value)} style={{ maxWidth: 220 }}>
                  <option value="1">Every 1 hour</option><option value="6">Every 6 hours</option><option value="12">Every 12 hours</option><option value="24">Every 24 hours</option>
                </Select>
              </Field>
            </SectionCard>
          </>)}

          {/* ── Footer save bar ──────────────────────────────────────── */}
          <GlassCard className="flex items-center justify-between" style={{ borderColor: dirty ? `${theme.status.warning}40` : undefined }}>
            <span className="text-xs" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>
              {saving ? "Saving..." : dirty ? <span>Editing <strong style={{ color: theme.accent.primary }}>{cfg.lockerCode}</strong> — unsaved changes</span> : <span>Viewing <strong style={{ color: theme.accent.primary }}>{cfg.lockerCode}</strong></span>}
            </span>
            <div className="flex gap-3">
              <button disabled={saving} onClick={() => { setDirty(false); selectedLocker && loadCfg(selectedLocker); }} className="btn-outline px-3 py-2 rounded-xl border text-xs" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Reset</button>
              <button disabled={saving || lockers.length < 2} onClick={handleApplyAll} className="btn-outline px-3 py-2 rounded-xl border text-xs" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Apply to All</button>
              <button disabled={saving || !dirty} onClick={handleSave} className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${dirty ? 'btn-primary' : ''}`} style={{ backgroundColor: dirty ? theme.accent.primary : theme.bg.tertiary, color: dirty ? theme.accent.contrast : theme.text.muted }}>
                {saving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : <>
                  <Save size={12} /> Save Config
                </>}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      {showCreate && <CreateLockerModal onClose={() => setShowCreate(false)} onCreated={(r) => { addToast?.({ type: "success", message: `Locker ${r.code} created` }); setShowCreate(false); fetchLockers(false).then(() => setLoading(false)); }} theme={theme} />}
      {showDeactivate && selectedLocker && <DeactivateModal locker={selectedLocker} onClose={() => setShowDeactivate(false)} onDone={(code) => { addToast?.({ type: "info", message: `Locker ${code} deactivated` }); setShowDeactivate(false); fetchLockers(false).then(() => setLoading(false)); }} theme={theme} />}

      {/* Firmware Update Modal */}
      {showFirmwareUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowFirmwareUpdate(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.name === 'dark' ? 'rgba(10,10,10,0.95)' : '#fff', borderColor: theme.border.primary, backdropFilter: 'blur(20px)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Push Firmware Update</h3>
              <button onClick={() => setShowFirmwareUpdate(false)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>Target Locker</span>
                  <span className="text-sm font-semibold" style={{ color: theme.accent.primary, fontFamily: theme.font.mono }}>{cfg.lockerCode || 'All Units'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>Current Version</span>
                  <span className="text-sm font-mono" style={{ color: theme.text.primary }}>{cfg.firmwareVersion}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>Target Version</label>
                <select className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none appearance-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, fontFamily: theme.font.mono }}>
                  <option value="2.5.0">v2.5.0 (Latest Stable)</option>
                  <option value="2.5.1-beta">v2.5.1-beta (Pre-release)</option>
                  <option value="2.4.2">v2.4.2 (Previous Stable)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted, fontFamily: theme.font.mono }}>Schedule</label>
                <div className="flex gap-2">
                  {['Now', 'Next Maintenance Window', 'Custom Time'].map(opt => (
                    <button key={opt} className="flex-1 py-2 rounded-xl text-xs border" style={{ backgroundColor: opt === 'Now' ? `${theme.accent.primary}15` : theme.bg.tertiary, color: opt === 'Now' ? theme.accent.primary : theme.text.muted, borderColor: opt === 'Now' ? `${theme.accent.primary}40` : theme.border.primary }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl border flex items-start gap-2" style={{ borderColor: `${theme.status.warning}30`, backgroundColor: `${theme.status.warning}08` }}>
                <AlertTriangle size={14} style={{ color: theme.status.warning, marginTop: 2, flexShrink: 0 }} />
                <span className="text-xs" style={{ color: theme.text.muted }}>Firmware update will briefly restart the locker controller. Active sessions will be preserved.</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowFirmwareUpdate(false)} className="btn-outline flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => { addToast?.({ type: 'info', message: `Firmware update to v2.5.0 queued for ${cfg.lockerCode || 'all units'}` }); setShowFirmwareUpdate(false); }} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Push Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
