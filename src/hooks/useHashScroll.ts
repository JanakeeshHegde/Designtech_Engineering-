import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * After a route change settles, if the URL has a hash (#section-id)
 * this hook scrolls smoothly to that element.
 */
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // No hash — scroll to top on route change
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Wait a tick for the new page to render, then scroll
    const id = hash.replace("#", "");
    const attempt = (retries = 8) => {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } else if (retries > 0) {
        setTimeout(() => attempt(retries - 1), 100);
      }
    };

    attempt();
  }, [pathname, hash]);
}
