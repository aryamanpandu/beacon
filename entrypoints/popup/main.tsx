import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function BeaconLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L12 8" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L7 20H17L12 8Z" stroke="#f5c842" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20H15" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8L4 5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M12 8L20 5" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// Turn "Command+B" / "⌘B" into nicely separated key chips
function formatShortcut(raw: string): string[] {
  if (!raw) return [];
  return raw
    .replace(/Command/gi, "⌘")
    .replace(/Ctrl/gi, "⌃")
    .replace(/Shift/gi, "⇧")
    .replace(/Alt|Option/gi, "⌥")
    .replace(/MacCtrl/gi, "⌃")
    // Some platforms return the symbols already concatenated (e.g. "⌘B")
    .split("+")
    .flatMap((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) =>
      // Split a concatenated symbol cluster like "⌘B" into ["⌘", "B"]
      /^[⌘⌃⇧⌥]/.test(part) && part.length > 1 ? part.match(/[⌘⌃⇧⌥]|[^⌘⌃⇧⌥]+/g) ?? [part] : [part]
    );
}

function Popup() {
  const [keys, setKeys] = useState<string[]>([]);
  const [isSet, setIsSet] = useState(true);

  useEffect(() => {
    browser.commands.getAll().then((cmds) => {
      const cmd = cmds.find((c) => c.name === "open-tab-search");
      const shortcut = cmd?.shortcut ?? "";
      setIsSet(Boolean(shortcut));
      setKeys(formatShortcut(shortcut));
    });
  }, []);

  const isFirefox = import.meta.env.BROWSER === "firefox";

  const openShortcuts = () => {
    if (isFirefox) {
      // Firefox blocks tabs.create for about: pages. The only reliable way to
      // get the user to the shortcut manager is to open about:addons via the
      // native API — which isn't exposed — so we navigate the current tab there.
      browser.tabs.update({ url: "about:addons" }).catch(() => {});
    } else {
      browser.tabs.create({ url: "chrome://extensions/shortcuts" }).catch(() => {});
    }
    window.close();
  };

  return (
    <div style={{ padding: "16px 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <BeaconLogo />
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "0.01em" }}>Beacon</div>
          <div style={{ fontSize: "11px", color: "#4e6a8a" }}>Find any open tab</div>
        </div>
      </div>

      {/* Current shortcut */}
      <div style={{ fontSize: "11px", color: "#4e6a8a", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Shortcut
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px", minHeight: "26px" }}>
        {isSet ? (
          keys.map((k, i) => (
            <kbd
              key={i}
              style={{
                fontSize: "13px",
                color: "#f5c842",
                background: "rgba(245,200,66,0.08)",
                border: "1px solid rgba(245,200,66,0.22)",
                borderRadius: "6px",
                padding: "3px 9px",
                minWidth: "16px",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              {k}
            </kbd>
          ))
        ) : (
          <span style={{ fontSize: "13px", color: "#8a6d3b" }}>Not set</span>
        )}
      </div>

      {/* Customize button */}
      <button
        onClick={openShortcuts}
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: "13px",
          color: "#060e1c",
          background: "#f5c842",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500,
          transition: "filter 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
      >
        Customize shortcut
      </button>
      <div style={{ fontSize: "10.5px", color: "#2e4a66", marginTop: "9px", lineHeight: 1.5 }}>
        {isFirefox
          ? "Opens about:addons. Click the ⚙ gear → Manage Extension Shortcuts to change Beacon's keys."
          : "Opens Chrome's shortcuts page, where you can change or clear Beacon's key combo."}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Popup />);
