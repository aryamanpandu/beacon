import ReactDOM from "react-dom/client";
import TabSearch from "../../components/TabSearch";
import "./style.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    let mounted = false;

    const ui = await createShadowRootUi(ctx, {
      name: "tab-search-ui",
      position: "overlay",
      anchor: "body",
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(<TabSearch onClose={() => ui.remove()} />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
        mounted = false;
      },
    });

    // Toggle the overlay when the background relays the command shortcut
    browser.runtime.onMessage.addListener((message) => {
      if (message.type !== "TOGGLE_TAB_SEARCH") return;
      if (mounted) {
        ui.remove();
      } else {
        ui.mount();
        mounted = true;
      }
    });
  },
});
