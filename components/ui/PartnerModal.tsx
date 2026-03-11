"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function PartnerModal() {
  const t = useTranslations("PartnerModal");
  const [open, setOpen] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    function handler() { setOpen(true); }
    window.addEventListener("openPartnerModal", handler as EventListener);
    return () => window.removeEventListener("openPartnerModal", handler as EventListener);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Arka Plan Kaydırma Kilidi (Arka sayfanın kaymasını engeller)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999999]">
      {/* 1. KATMAN: Siyah ve Bulanık Arka Plan (Sabittir, kaymaz) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* 2. KATMAN: Tam Ekran Scroll Alanı (Siyah alanda bile scroll yapılmasını sağlar) */}
      <div 
        className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onClick={(e) => { 
          // Sadece boşluğa (arka plana) tıklandığında kapatır
          if (e.target === e.currentTarget) setOpen(false); 
        }}
      >
        {/* Ortalamak için Flex kapsayıcı */}
        <div 
          className="min-h-full flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => { 
            if (e.target === e.currentTarget) setOpen(false); 
          }}
        >
          
          {/* 3. KATMAN: Gerçek Modal Kutusu */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl my-8 flex flex-col">
            
            {/* KAPATMA BUTONU: Sticky ile ekranda asılı kalarak sizinle birlikte aşağı iner */}
            <div className="sticky top-6 right-0 z-50 flex justify-end px-6 pt-6 -mb-12 pointer-events-none">
              <button 
                onClick={() => setOpen(false)} 
                className="pointer-events-auto bg-white/90 backdrop-blur text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-full p-2.5 shadow-md border border-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Formun ve İçeriğin Olduğu Alan */}
            <div className="p-8 sm:p-12 pt-14">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-[#ff4f3b] mb-3">{t('mainTitle')}</h1>
                <p className="text-gray-600 font-medium">{t('mainSubtitle')}</p>
              </div>

              <div className="bg-[#fef9f6] rounded-3xl p-6 sm:p-10 border border-[#fde8dc]">
                {success ? (
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Başvurunuz gönderildi</h3>
                    <p className="text-gray-600 mb-6">Teşekkür ederiz. Başvurunuz incelenecektir.</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setSuccess(false);
                          setOrgName("");
                          setTaxId("");
                          setManagerFirstName("");
                          setManagerLastName("");
                          setPhone("");
                          setEmail("");
                          setDescription("");
                          setTermsChecked(false);
                        }}
                        className="px-6 py-2 rounded-full bg-white border"
                      >
                        Yeni Başvuru
                      </button>
                      <button onClick={() => setOpen(false)} className="px-6 py-2 rounded-full bg-[#ff4f3b] text-white">Kapat</button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-10" onSubmit={async (e) => {
                    e.preventDefault();
                    if (!termsChecked) { setErrorMsg('Lütfen onay kutusunu işaretleyin.'); return; }
                    setErrorMsg('');
                    setLoading(true);
                    try {
                      let baseUrl = 'https://panel-api-gw.bulbi.co';
                      try {
                        const cfg = await fetch('/config.json');
                        if (cfg.ok) {
                          const j = await cfg.json();
                          baseUrl = j.API_BASE_URL || baseUrl;
                        }
                      } catch (err) {}

                      const createResp = await fetch(`${baseUrl}/organization/application/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                      });
                      if (!createResp.ok) throw new Error('Başvuru oluşturulamadı: ' + createResp.status);
                      const createJson = await createResp.json();
                      const applicationId = createJson?.data?.application?._id || createJson?.data?._id || createJson?.data?.applicationId;
                      if (!applicationId) throw new Error('Sunucudan applicationId alınamadı');

                      const updateBody: any = {
                        applicationId,
                        userName: managerFirstName,
                        userSurname: managerLastName,
                        phoneNumber: phone.replace(/\D/g, ''),
                        email,
                        name: orgName,
                        taxIdOrNationalId: taxId.replace(/\D/g, ''),
                        source: true,
                      };
                      if (description) updateBody.description = description;

                      const updateResp = await fetch(`${baseUrl}/organization/application/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateBody)
                      });
                      if (!updateResp.ok) throw new Error('Başvuru güncellenemedi: ' + updateResp.status);

                      const webhookPayload = {
                        org_name: orgName,
                        tax_id: taxId.replace(/\D/g, ''),
                        manager_first_name: managerFirstName,
                        manager_last_name: managerLastName,
                        phone: phone.replace(/\D/g, ''),
                        email,
                        description: description || '',
                        source: 'application_form',
                        applicationId
                      };
                      fetch('https://abdullaharslan.com.tr/bulbi/portal/crm/webhook-lead.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(webhookPayload)
                      }).catch(() => {});

                      setSuccess(true);
                    } catch (err: any) {
                      setErrorMsg(err?.message || 'Başvuru sırasında hata oluştu');
                    } finally {
                      setLoading(false);
                    }
                  }}>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-[6px] border-[#e74c3c] pl-4 rounded-sm">{t('sectionCompany')}</h2>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('companyName')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="org_name" value={orgName} onChange={(e) => setOrgName(e.target.value)} type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('taxNumber')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="tax_id" value={taxId} onChange={(e) => setTaxId(e.target.value.replace(/\D/g, '').slice(0,11))} placeholder={t('taxPlaceholder')} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                          <p className="text-xs text-gray-500 mt-2 ml-1">{t('taxHelper')}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-[6px] border-[#e74c3c] pl-4 rounded-sm">{t('sectionManager')}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('managerName')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="manager_first_name" value={managerFirstName} onChange={(e) => setManagerFirstName(e.target.value)} type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('managerSurname')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="manager_last_name" value={managerLastName} onChange={(e) => setManagerLastName(e.target.value)} type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('phone')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="phone" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder={t('phonePlaceholder')} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')} <span className="text-[#ff4f3b]">*</span></label>
                          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all shadow-sm" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-[6px] border-[#e74c3c] pl-4 rounded-sm">{t('sectionExtra')}</h2>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('description')}</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('descPlaceholder')} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff4f3b]/50 transition-all min-h-[120px] resize-y shadow-sm" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#fde8dc]">
                      <div className="flex items-start mb-2 gap-3">
                        <input checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded border-gray-300 text-[#ff4f3b] focus:ring-[#ff4f3b]" />
                        <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                          <Link href="pdfs\\bulbi-acik-riza-metni.pdf" className="text-[#ff4f3b] hover:underline font-medium">{t('terms1')}</Link>,{" "}
                          <Link href="pdfs\\bulbi-aydinlatma-metni.pdf" className="text-[#ff4f3b] hover:underline font-medium">{t('terms2')}</Link> {t('termsAnd')}{" "}
                          <Link href="pdfs\\bulbi-ticari-iletisim-acik-riza-metni.pdf" className="text-[#ff4f3b] hover:underline font-medium">{t('terms3')}</Link> {t('termsEnd')}
                        </label>
                      </div>

                      {errorMsg && <div className="text-sm text-red-600 text-center mb-4">{errorMsg}</div>}

                      <div className="flex justify-center">
                        <button disabled={loading} type="submit" className="bg-gradient-to-r from-[#ff4f3b] to-[#ff7eb3] text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-60">
                          {loading ? 'Gönderiliyor...' : t('submitBtn')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPhone(v: string) {
  let input = v.replace(/\D/g, '');
  if (input.length > 10) input = input.substring(0, 10);
  let formatted = '';
  if (input.length > 0) {
    formatted = '(' + input.substring(0, 3);
    if (input.length > 3) {
      formatted += ') ' + input.substring(3, 6);
      if (input.length > 6) {
        formatted += ' ' + input.substring(6, 8);
        if (input.length > 8) {
          formatted += ' ' + input.substring(8, 10);
        }
      }
    }
  }
  return formatted;
}