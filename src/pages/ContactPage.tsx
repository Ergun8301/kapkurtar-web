import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Formspree endpoint
    const formspreeEndpoint = 'https://formspree.io/f/xeovowdl';

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitError('Mesajınız gönderilemedi. Lütfen tekrar deneyin veya WhatsApp üzerinden bize ulaşın.');
      }
    } catch (error) {
      console.error('İletişim formu gönderilemedi:', error);
      setSubmitError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-kk-paper">
      {/* Hero Section */}
      <div className="bg-kk-night text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Bize <span className="text-kk-lime">Ulaşın</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Bir sorunuz mu var? Bir öneriniz mi? Ekibimiz size yardımcı olmak için burada.
          </p>
        </div>
      </div>

      {/* Contact Options + Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/33685507985?text=Merhaba%20KapKurtar,%20bir%20sorum%20var"
              target="_blank"
              rel="noopener noreferrer"
              className="block kk-card p-6 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-start">
                <div className="bg-kk-mint rounded-full p-3 group-hover:bg-kk-lime transition-colors duration-300">
                  <MessageSquare className="w-6 h-6 text-kk-night" />
                </div>
                <div className="ml-4">
                  <h3 className="font-display text-lg font-extrabold text-kk-night mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-3">
                    Hızlı yanıt için bize doğrudan WhatsApp üzerinden ulaşın
                  </p>
                  <span className="text-kk-mint-text font-semibold group-hover:underline">
                    Mesaj gönder →
                  </span>
                </div>
              </div>
            </a>

            {/* Email */}
            <div className="kk-card p-6">
              <div className="flex items-start">
                <div className="bg-kk-lilac rounded-full p-3">
                  <Mail className="w-6 h-6 text-kk-night" />
                </div>
                <div className="ml-4">
                  <h3 className="font-display text-lg font-extrabold text-kk-night mb-2">E-posta</h3>
                  <p className="text-gray-600 mb-3">
                    Karşıdaki formu doldurun, 24 saat içinde size yanıt vereceğiz
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="kk-card p-6">
              <div className="flex items-start">
                <div className="bg-kk-lime rounded-full p-3">
                  <MapPin className="w-6 h-6 text-kk-night" />
                </div>
                <div className="ml-4">
                  <h3 className="font-display text-lg font-extrabold text-kk-night mb-2">Adres</h3>
                  <p className="text-gray-600 text-sm">
                    Eski Hisar, 9501. Sk. No:3<br />
                    07600 Manavgat/Antalya<br />
                    Türkiye
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="kk-card p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-kk-mint-text mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-extrabold text-kk-night mb-2">Mesaj gönderildi!</h3>
                  <p className="text-gray-600 mb-6">
                    Mesajınız için teşekkürler. En kısa sürede size yanıt vereceğiz.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="kk-btn-dark"
                  >
                    Başka bir mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-kk-night font-semibold text-sm mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="kk-input"
                      placeholder="Adınız"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-kk-night font-semibold text-sm mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="kk-input"
                      placeholder="eposta@ornek.com"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-kk-night font-semibold text-sm mb-2">
                      Konu *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="kk-input"
                    >
                      <option value="">Bir konu seçin</option>
                      <option value="question_client">Müşteri sorusu</option>
                      <option value="question_marchand">İşletme sorusu</option>
                      <option value="probleme_technique">Teknik sorun</option>
                      <option value="partenariat">Ortaklık teklifi</option>
                      <option value="autre">Diğer</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-kk-night font-semibold text-sm mb-2">
                      Mesaj *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="kk-input"
                      placeholder="Mesajınız..."
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-kk-coral-text" role="alert">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="kk-btn-primary w-full mt-2"
                  >
                    {isSubmitting ? (
                      'Gönderiliyor...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Mesajı gönder
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;