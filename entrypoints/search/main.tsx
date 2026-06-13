import ReactDOM from "react-dom/client";
import TabSearch from "../../components/TabSearch";
import "./style.css";

// Rendered inside the fallback popup window (used on chrome:// / New Tab pages
// where a content-script overlay can't be injected). Closing the search just
// closes the popup window.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <TabSearch onClose={() => window.close()} />
);
