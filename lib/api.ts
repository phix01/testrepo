// YENİ: URL'ye bakarak dilin ne olduğunu anlayan yardımcı fonksiyon
function getLang() {
  if (typeof window !== "undefined") {
    // Eğer linkin başında /en varsa İngilizce, yoksa Türkçe döner
    return window.location.pathname.startsWith("/en") ? "en" : "tr";
  }
  return "tr";
}

export async function getEventList(filters: any = {}) {
  const token = localStorage.getItem("token");

  const payload: any = {
    page: filters.page || 0,
    limit: filters.limit || 200,
  };

  if (typeof filters === "string" && filters.trim() !== "") {
    payload.query = filters.trim();
  }

  if (filters.query) payload.query = filters.query;
  if (filters.categories) payload.categories = filters.categories;
  if (filters.eventType) payload.eventType = filters.eventType;
  
  // YENİ: Backend'e şehir bilgisini gönderiyoruz
  if (filters.city) payload.city = filters.city;

  const res = await fetch("https://user-api-gw.bulbi.co/event/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token || "",
      language: getLang(),
      timeZone: "",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data;
}

// 1. ŞEHİR LİSTESİ ÇEKME FONKSİYONU
export async function getCityList() {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
  try {
    const res = await fetch("https://user-api-gw.bulbi.co/city/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token || "",
        "language": "tr", 
      },
    });
    if (!res.ok) return null; 
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Şehir listesi çekilemedi:", error);
    return null;
  }
}

// 2. ANASAYFA FONKSİYONU (Kesin Çözüm: cityId)
export async function getHomepageData(cityId?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : "";
  
  let url = "https://user-api-gw.bulbi.co/homepage";
  
  // ÇÖZÜM BURADA: Backend'in tam olarak beklediği parametre "cityId"
  if (cityId) {
    url += `?cityId=${cityId}`; 
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token || "",
        "language": "tr", 
      },
    });
    
    if (!res.ok) {
      console.warn("Homepage verisi çekilirken API hatası:", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Homepage verisi çekilemedi:", error);
    return null;
  }
}

export async function getSortTypes() {
  try {
    const homepage = await getHomepageData();
    return homepage?.data?.sortTypes || [];
  } catch (err) {
    console.error("SortTypes çekilemedi:", err);
    return [];
  }
}

// BLOG LİSTESİ
export async function getBlogs(page: number = 0, limit: number = 10, lang?: string) {
  const token = localStorage.getItem("token");

  try {
    // Şimdilik page/limit göndermeden basalım, backend zaten default sayfayı döndürüyor
    const res = await fetch("https://user-api-gw.bulbi.co/blog/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Bloglar büyük ihtimalle public, token yoksa header'a hiç koymayalım
        ...(token ? { token } : {}),
        language: lang || getLang(),
        timeZone: "",
      },
    });

    const json = await res.json();
    console.log("BLOG API RESPONSE:", json); // ➜ konsolda aynısını görmen lazım

    const rawBlogs: any[] = json?.data?.blogs || [];

    // Field isimlerini component’e daha uyumlu hale getir
    const blogs = rawBlogs.map((b) => ({
      id: b.id,
      title: b.title,
      content: b.content,
      imageUrl: b.coverImage,      // 🔴 ÖNEMLİ: coverImage'ı imageUrl’e map’ledik
      createdAt: b.createdAt,      // varsa
      summary: b.description,      // backend'de description var
    }));

    return blogs;
  } catch (err) {
    console.error("getBlogs error:", err);
    return [];
  }
}

// Kategori listesini backend'den çeker. Birkaç olası endpoint'i dener, yoksa boş dizi döner.
export async function getCategories() {
  const token = localStorage.getItem("token");

  try {
    // 1) Prefer the documented endpoint `/event/categories`
    const tryEventCats = await fetch("https://user-api-gw.bulbi.co/event/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
    });

    if (tryEventCats.ok) {
      const d = await tryEventCats.json();
      const cats = d?.data?.categories || d?.categories || d?.data || [];
      if (Array.isArray(cats)) return cats;
    }

    // 2) Fallback: homepage içinden kategori bilgisi olabilir
    const homepage = await getHomepageData();
    const hpCats = homepage?.data?.categories || homepage?.categories || [];
    if (Array.isArray(hpCats) && hpCats.length > 0) return hpCats;

    // 3) Try some legacy endpoints if present
    const tryList = await fetch("https://user-api-gw.bulbi.co/category/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
    });

    if (tryList.ok) {
      const d2 = await tryList.json();
      const cats2 = d2?.data?.categories || d2?.categories || d2?.data || [];
      if (Array.isArray(cats2)) return cats2;
    }

    const tryAlt = await fetch("https://user-api-gw.bulbi.co/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
    });

    if (tryAlt.ok) {
      const d3 = await tryAlt.json();
      const cats3 = d3?.data?.categories || d3?.categories || d3?.data || [];
      if (Array.isArray(cats3)) return cats3;
    }

    return [];
  } catch (err) {
    console.error("Kategori çekme hatası:", err);
    return [];
  }
}

// Fetch events filtered by backend category id(s)
export async function getEventsByCategory(categoryIds: string | string[]) {
  const token = localStorage.getItem("token");
  const categories = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

  try {
    const payload: any = {
      page: 0,
      limit: 100,
      categories,
    };

    const res = await fetch("https://user-api-gw.bulbi.co/event/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
        timeZone: "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getEventsByCategory error:", err);
    return { data: { events: [] } };
  }
}

// Etkinlik detaylarını getirir
export async function getEventDetail(id: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  try {
    const res = await fetch("https://user-api-gw.bulbi.co/event/detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
        timeZone: "",
      },
      body: JSON.stringify({ id }),
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.warn("getEventDetail: response is not valid JSON", parseErr, text);
    }

    console.log("getEventDetail HTTP", { status: res.status, ok: res.ok, body: json ?? text });

    if (!res.ok) {
      return null;
    }

    const event = json?.data?.event ?? (json?.data && (json.data.name || json.data.title) ? json.data : null) ?? json?.event ?? null;
    return event;
  } catch (err) {
    console.error("getEventDetail error:", err);
    return null;
  }
}

export async function getEventGetPrice(id: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  try {
    const res = await fetch(`https://user-api-gw.bulbi.co/event/get-price?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
        timeZone: "",
      },
    });
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("getEventGetPrice error:", err);
    return null;
  }
}

export async function getChildrenTickets(eventId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await fetch(`https://user-api-gw.bulbi.co/event/children/get-tickets?eventId=${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
        timeZone: "",
      },
    });
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("getChildrenTickets error:", err);
    return null;
  }
}

export async function addFavorite(eventId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await fetch("https://user-api-gw.bulbi.co/event/add-favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
      body: JSON.stringify({ id: eventId }),
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (err) { console.warn('addFavorite: non-json response', text); }
    console.log('addFavorite HTTP', { status: res.status, ok: res.ok, body: json ?? text, tokenPresent: !!token });
    return json ?? text;
  } catch (err) {
    console.error("addFavorite error:", err);
    return null;
  }
}

export async function removeFavorite(eventId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await fetch("https://user-api-gw.bulbi.co/event/remove-favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
      body: JSON.stringify({ id: eventId }),
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (err) { console.warn('removeFavorite: non-json response', text); }
    console.log('removeFavorite HTTP', { status: res.status, ok: res.ok, body: json ?? text, tokenPresent: !!token });
    return json ?? text;
  } catch (err) {
    console.error("removeFavorite error:", err);
    return null;
  }
}

export async function checkCanBuyTicket(payload: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await fetch("https://user-api-gw.bulbi.co/event/check-can-buy-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (err) { console.warn('checkCanBuyTicket: non-json response', text); }
    console.log('checkCanBuyTicket HTTP', { status: res.status, ok: res.ok, body: json ?? text, tokenPresent: !!token });
    return json ?? text;
  } catch (err) {
    console.error("checkCanBuyTicket error:", err);
    return null;
  }
}

export async function createTicket(payload: any) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const res = await fetch("https://user-api-gw.bulbi.co/event/create-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
        language: getLang(),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (err) { console.warn('createTicket: non-json response', text); }
    console.log('createTicket HTTP', { status: res.status, ok: res.ok, body: json ?? text, tokenPresent: !!token });
    return json ?? text;
  } catch (err) {
    console.error("createTicket error:", err);
    return null;
  }
}
