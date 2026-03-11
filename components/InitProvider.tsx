"use client";

import { useEffect } from "react";

// Basit UUIDv4 üretici (küçük, bağımsız)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function detectOSType() {
  try {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'android';
  } catch {
    return 'android';
  }
}

export default function InitProvider() {
  useEffect(() => {
    initializeUser();
  }, []);

  async function initializeUser() {
    try {
      const existingToken = localStorage.getItem('token');
      if (existingToken) return; // zaten kayıtlı

      // deviceId: localStorage veya yeni uuid
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem('deviceId', deviceId);
      }

      const osType = detectOSType();

      // language: öncelikle URL'den ilk segmenti al (ör. /tr/...), fallback navigator
      let language = 'tr';
      try {
        const p = window.location.pathname.split('/').filter(Boolean);
        if (p && p[0]) language = p[0];
        else language = (navigator.language || 'tr').split('-')[0];
      } catch {
        language = 'tr';
      }

      const body = {
        device: {
          deviceId,
          manufacturer: 'web',
          model: 'browser',
          osType,
          osVersion: navigator.platform || 'browser',
          pushNotificationToken: '',
          language,
          appVersion: 1,
          idfa: '',
        },
      };

      const res = await fetch('https://user-api-gw.bulbi.co/user/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          language,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);
      if (!data) return;

      const token = data?.data?.token;
      const returnedDeviceId = data?.data?.user?.deviceId;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (returnedDeviceId) {
        localStorage.setItem('deviceId', returnedDeviceId);
      }
    } catch (err) {
      console.error('InitProvider init error:', err);
    }
  }

  return null;
}
