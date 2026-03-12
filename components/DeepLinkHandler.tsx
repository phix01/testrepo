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

    // Android-first: try app scheme directly, fallback to Play Store after 4s
    if (detectAndroid()) {
      let handled = false;
      const onVisibilityChange = () => { if (document.hidden) handled = true; };
      document.addEventListener('visibilitychange', onVisibilityChange);

      try { window.location.href = schemeUrl; } catch (e) {}

      const storeTimer = window.setTimeout(() => {
        try { if (!handled) window.location.href = playStore; } catch (_) {}
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearTimeout(storeTimer);
      }, 4000);

      return;
    }

    // Non-Android: Do not open universal links. For iOS try custom scheme then App Store; on desktop do nothing.
    const isIos = detectIOS();

    if (isIos) {
      let handled = false;
      const onVisibilityChange = () => { if (document.hidden) handled = true; };
      document.addEventListener('visibilitychange', onVisibilityChange);

      try {
        // Try custom scheme immediately on iOS
        window.location.href = schemeUrl;
      } catch (e) {}

      // If not opened within 1000ms, go to App Store
      const storeTimer = window.setTimeout(() => {
        try { if (!handled) window.location.href = appStore; } catch (_) {}
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearTimeout(storeTimer);
      }, 1000);
    }
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
    const schemeUrl = `bulbi://${cleanedPath}`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = schemeUrl;
    } catch (err) {
      // ignore
    }

    const storeTimer = window.setTimeout(() => {
      try {
        if (!handled) window.location.href = playStore;
      } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 4000);
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
    const schemeUrl = `bulbi://${cleanedPath}`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = schemeUrl;
    } catch (err) {}

    const storeTimer = window.setTimeout(() => {
      try { if (!handled) window.location.href = playStore; } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 4000);
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
    const schemeUrl = `bulbi://${cleanedPath}`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      window.location.href = schemeUrl;
    } catch (err) {}

    const storeTimer = window.setTimeout(() => {
      try { if (!handled) window.location.href = playStore; } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 4000);
  } catch (err) {}
}

export default function DeepLinkHandler({ path }: { path: string }) {
  // component wrapper if someone prefers JSX usage
  tryOpenDeepLink(path);
  return null;
}
