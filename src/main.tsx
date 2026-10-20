import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import Landing from "./pages/Landing";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";

/**
 * One React entry for four static HTML pages. Each page has its own .html file
 * (so meta/OG tags are real HTML), and this picks the right component from the
 * URL — the same way the server rewrite does in production.
 */
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const Page =
  path === "/app" ? App : path === "/thank-you" ? ThankYou : path === "/privacy" ? Privacy : Landing;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);

// Splash screen: fade out once React has drawn (two frames after render).
// requestAnimationFrame does not fire in background tabs, so a timer provides
// a guaranteed fallback — otherwise the splash would cover the page forever
// for anyone who opens the site in a background tab.
function hideSplash() {
  const splash = document.getElementById("splash");
  if (!splash || splash.classList.contains("gone")) return;
  splash.classList.add("gone");
  window.setTimeout(() => splash.remove(), 300);
}

requestAnimationFrame(() => requestAnimationFrame(hideSplash));
window.setTimeout(hideSplash, 900);
