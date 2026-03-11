"use client";

export function tryOpenDeepLink(path: string) {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const vendor = typeof navigator !== 'undefined' ? navigator.vendor || '' : '';
    const platform = typeof navigator !== 'undefined' ? (navigator as any).platform || '' : '';
    const detectAndroid = () => /Android/i.test(ua || vendor || platform);
    const detectIOS = () => /iPhone|iPad|iPod/i.test(ua || vendor || platform);
    const appStore = 'https://apps.apple.com/tr/app/bulbi-%C3%A7ocuk-etkinlikleri/id6749323823';
    const playStore = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';

    const universalBase = 'https://bulbi.co/';
    const cleanedPath = String(path).replace(/^\/+/, '');
    const schemeUrl = `bulbi://${cleanedPath}`;

    // Android-first: prefer different sequences per browser to avoid opening an intermediate web page
    if (detectAndroid()) {
      const intentUrl = `intent://bulbi.co/${cleanedPath}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStore)};end`;
      const isEdge = /Edg\//i.test(ua || '');

      let handled = false;
      const onVisibilityChange = () => { if (document.hidden) handled = true; };
      document.addEventListener('visibilitychange', onVisibilityChange);

      if (isEdge) {
        // Edge on Android: try custom scheme first (bulbi://...), then intent://, then Play Store
        try {
          window.location.href = schemeUrl;
        } catch (e) {}

        const intentTimer = window.setTimeout(() => {
          try { window.location.href = intentUrl; } catch (_) {}
        }, 0);

        const storeTimer = window.setTimeout(() => {
          try { if (!handled) window.location.href = playStore; } catch (_) {}
          document.removeEventListener('visibilitychange', onVisibilityChange);
          clearTimeout(intentTimer);
          clearTimeout(storeTimer);
        }, 800);

        return;
      }

      // Default Android path (non-Edge): intent:// first, then scheme, then Play Store
      try {
        window.location.href = intentUrl;
      } catch (e) {}

      // Secondary fallback: try custom scheme immediately
      const schemeTimer = window.setTimeout(() => {
        try { window.location.href = schemeUrl; } catch (_) {}
      }, 0);

      // If not opened within 800ms, go to Play Store
      const storeTimer = window.setTimeout(() => {
        try { if (!handled) window.location.href = playStore; } catch (_) {}
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearTimeout(schemeTimer);
        clearTimeout(storeTimer);
      }, 800);

      return;
    }

    // Non-Android: use universal-first (iOS relies on AASA -> Associated Domains)
    const universalUrl = `${universalBase}${cleanedPath}`;
    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = universalUrl;
    } catch (e) {}

    const schemeTimer = window.setTimeout(() => {
      try { window.location.href = schemeUrl; } catch (_) {}
    }, 0);

    const storeTimer = window.setTimeout(() => {
      try {
        if (!handled) {
          window.location.href = detectIOS() ? appStore : playStore;
        }
      } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(schemeTimer);
      clearTimeout(storeTimer);
    }, 800);
  } catch (err) {
    // ignore
  }
}

export function tryOpenEventDeepLink(id: string) {
  return tryOpenDeepLink(`event/${id}`);
}

// Android-only intent helper: constructs intent URI with the correct host
export function tryOpenEventDeepLinkAndroid(id: string) {
  try {
    const playStore = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';
    const cleanedPath = String(`event/${id}`).replace(/^\/+/, '');
    // Use bulbi.co as the host so Android intent matches app's intent-filter for the domain
    const intentUrl = `intent://bulbi.co/${cleanedPath}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStore)};end`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      // Try intent:// which is the most reliable on Android when app links aren't available
      window.location.href = intentUrl;
    } catch (err) {
      // ignore
    }

    // fallback to Play Store if app not opened within 800ms
    const storeTimer = window.setTimeout(() => {
      try {
        if (!handled) window.location.href = playStore;
      } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 800);
  } catch (err) {
    // ignore
  }
}

export function tryOpenBlogDeepLink(id: string) {
  return tryOpenDeepLink(`blog/${id}`);
}

// Android-only blog intent helper
export function tryOpenBlogDeepLinkAndroid(id: string) {
  try {
    const playStore = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';
    const cleanedPath = String(`blog/${id}`).replace(/^\/+/, '');
    const intentUrl = `intent://bulbi.co/${cleanedPath}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStore)};end`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = intentUrl;
    } catch (err) {}

    const storeTimer = window.setTimeout(() => {
      try { if (!handled) window.location.href = playStore; } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 800);
  } catch (err) {}
}

export function tryOpenOrganizationDeepLink(id: string) {
  return tryOpenDeepLink(`organization/${id}`);
}

// Android-only organization intent helper
export function tryOpenOrganizationDeepLinkAndroid(id: string) {
  try {
    const playStore = 'https://play.google.com/store/apps/details?id=com.sheydo.bulbi';
    const cleanedPath = String(`organization/${id}`).replace(/^\/+/, '');
    const intentUrl = `intent://bulbi.co/${cleanedPath}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStore)};end`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = intentUrl;
    } catch (err) {}

    const storeTimer = window.setTimeout(() => {
      try { if (!handled) window.location.href = playStore; } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 800);
  } catch (err) {}
}

export default function DeepLinkHandler({ path }: { path: string }) {
  // component wrapper if someone prefers JSX usage
  tryOpenDeepLink(path);
  return null;
}
