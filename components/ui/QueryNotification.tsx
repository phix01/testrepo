"use client";
import { useEffect, useState } from "react";

export default function QueryNotification() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // check for common partner form query params
      if (
        params.get("org_name") ||
        params.get("tax_id") ||
        params.get("manager_first_name") ||
        params.get("manager_last_name") ||
        params.get("email")
      ) {
        setMessage("Başvurunuz gönderildi. Teşekkürler!");
        setShow(true);

        // remove query string so the banner doesn't reappear on refresh
        try {
          const u = new URL(window.location.href);
          u.search = "";
          window.history.replaceState({}, "", u.toString());
        } catch (err) {
          // ignore
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999]">
      <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
        <span>{message}</span>
        <button onClick={() => setShow(false)} className="text-sm font-semibold opacity-90 hover:opacity-100">
          Kapat
        </button>
      </div>
    </div>
  );
}
