import { useState } from "react";
import type { Tab } from "../lib/types";
import { GlobeIcon } from "../lib/icons";

// A tab's favicon, falling back to a small beacon-amber globe when the icon is
// missing, broken, or a chrome:// internal URL.
export function Favicon({ tab }: { tab: Tab }) {
  const [errored, setErrored] = useState(false);
  const src = tab.favIconUrl && !tab.favIconUrl.startsWith("chrome://") ? tab.favIconUrl : null;

  if (!src || errored) {
    return (
      <div
        style={{ background: "rgba(245,200,66,0.10)", border: "1px solid rgba(245,200,66,0.15)" }}
        className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0"
      >
        <GlobeIcon />
      </div>
    );
  }

  return (
    <img
      src={src}
      className="w-[18px] h-[18px] rounded flex-shrink-0 object-contain"
      onError={() => setErrored(true)}
      alt=""
    />
  );
}
