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
    const universalUrl = `${universalBase}${cleanedPath}`;

    // Sequence to improve reliability in different environments:
    // 1) Navigate to the universal HTTPS link (https://bulbi.co/...).
    // 2) After a short delay, try the custom scheme (bulbi://...) as a fallback.
    // 3) On Android try intent:// if available.
    // 4) If none opened the app, after 1.5s redirect to the store.

    const schemeUrl = `bulbi://${cleanedPath}`;
    const intentUrl = `intent://${cleanedPath}#Intent;scheme=https;package=com.sheydo.bulbi;S.browser_fallback_url=${encodeURIComponent(playStore)};end`;

    let handled = false;
    const onVisibilityChange = () => { if (document.hidden) handled = true; };
    document.addEventListener('visibilitychange', onVisibilityChange);

    try {
      // 1) Universal link
      window.location.href = universalUrl;
    } catch (e) {
      // ignore
    }

    // 2) After 600ms try custom scheme (some browsers block instant scheme attempts)
    const schemeTimer = window.setTimeout(() => {
      try {
        // Try custom scheme (bulbi://...)
        window.location.href = schemeUrl;
      } catch (err) {
        // ignore
      }
    }, 600);

    // 3) If still not opened, after 1.5s go to store
    const storeTimer = window.setTimeout(() => {
      try {
        if (!handled) {
          const isAnd = detectAndroid();
          window.location.href = isAnd ? playStore : appStore;
        }
      } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(schemeTimer);
      clearTimeout(storeTimer);
    }, 1500);
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

    // fallback to Play Store if app not opened within 1.5s
    const storeTimer = window.setTimeout(() => {
      try {
        if (!handled) window.location.href = playStore;
      } catch (_) {}
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimeout(storeTimer);
    }, 1500);
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
    }, 1500);
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
    }, 1500);
  } catch (err) {}
}

export default function DeepLinkHandler({ path }: { path: string }) {
  // component wrapper if someone prefers JSX usage
  tryOpenDeepLink(path);
  return null;
}
