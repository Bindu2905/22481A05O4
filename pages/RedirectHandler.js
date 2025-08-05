// Page to handle redirection when user visits shortened URL
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { logEvent } from "../utils/logger";

const RedirectHandler = () => {
  const { code } = useParams();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("urls") || "{}");
    const urlData = stored[code];

    if (urlData) {
      const now = new Date();
      const expiry = new Date(urlData.expiresAt);

      if (now < expiry) {
        const click = {
          timestamp: now.toISOString(),
          source: "direct",
          location: "Unknown"
        };
        urlData.clicks.push(click);
        stored[code] = urlData;
        localStorage.setItem("urls", JSON.stringify(stored));

        logEvent("URL_CLICKED", { code, time: click.timestamp });

        window.location.href = urlData.longUrl;
        return;
      } else {
        alert("This link has expired.");
      }
    } else {
      alert("Invalid short URL.");
    }
  }, [code]);

  return null;
};

export default RedirectHandler;