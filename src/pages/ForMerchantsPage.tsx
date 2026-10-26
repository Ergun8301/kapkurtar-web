import { useState } from 'react';
import SEO from '../components/SEO';
import MerchantsHero from '../components/MerchantsHero';
import PricingSection3Plans from '../components/PricingSection3Plans';
import { GOOGLE_PLAY_URL } from '../lib/appLinks';
import { formatTL } from '../lib/errorMessages';

// Calculatrice Interactive Component
const CalculatorWidget = () => {
  const [productsPerDay, setProductsPerDay] = useState(10);
  const [avgPrice, setAvgPrice] = useState(50);

  const dailyLoss = productsPerDay * avgPrice;
  const monthlyLoss = dailyLoss * 25;

  const dailyGain = dailyLoss * 0.85;
  const monthlyGain = dailyGain * 25;
  const yearlyGain = monthlyGain * 12;

  const commission = dailyLoss * 0.15;

  return (
    <div className="space-y-6">
      {/* Slider 1 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Günlük atılan ürün sayısı: <span className="text-kk-mint-text font-display font-extrabold">{productsPerDay}</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={productsPerDay}
          onChange={(e) => setProductsPerDay(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-kk-mint-deep"
        />
      </div>

      {/* Slider 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ortalama ürün fiyatı: <span className="text-kk-mint-text font-display font-extrabold">{formatTL(avgPrice)}</span>
        </label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={avgPrice}
          onChange={(e) => setAvgPrice(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-kk-mint-deep"
        />
      </div>

      {/* Séparateur */}
      <div className="border-t-2 border-dashed border-black/10 my-6"></div>

      {/* Résultats */}
      <div className="space-y-4">
        {/* Perte actuelle */}
        <div className="bg-red-50 border-l-4 border-kk-coral p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">❌ Şu an (çöp)</p>
              <p className="text-xs text-red-600">Aylık kayıp</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-kk-coral-text">{formatTL(monthlyLoss)}</p>
          </div>
        </div>

        {/* Gain avec KapKurtar */}
        <div className="bg-kk-mint/10 border-l-4 border-kk-mint p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kk-mint-text">✅ KapKurtar ile (%85 sizin)</p>
              <p className="text-xs text-kk-mint-text">Aylık kazancınız</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-kk-mint-text">+{formatTL(monthlyGain)}</p>
          </div>
        </div>

        {/* Commission */}
        <div className="bg-gray-50 border-l-4 border-kk-lilac p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-kk-night">Komisyon (%15)</p>
              <p className="text-xs text-gray-600">Sadece sattığınızda</p>
            </div>
            <p className="font-display text-xl font-extrabold text-kk-night">{formatTL(commission * 25)}/ay</p>
          </div>
        </div>

        {/* Gain annuel */}
        <div className="bg-kk-night p-6 rounded-3xl text-white mt-6">
          <p className="text-sm font-medium mb-2">💰 Yıllık toplam kazanç</p>
          <p className="font-display text-4xl font-extrabold text-kk-lime">+{formatTL(yearlyGain)}</p>
          <p className="text-sm text-white/70 mt-2">
            Çöpe atılan ürünler yerine
          </p>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/merchant/auth"
        className="kk-btn-primary w-full py-4 text-lg"
      >
        Ücretsiz Başlayın →
      </a>
      <p className="text-xs text-gray-500 text-center">
        İlk 3 ay tamamen ücretsiz • Kredi kartı gerektirmez
      </p>
    </div>
  );
};

const ForMerchantsPage = () => {
  return (
    <div className="min-h-screen bg-kk-paper">
      <SEO
        title="İşletmeler İçin - KapKurtar"
        description="Gıda israfını önle, gelir elde et. Satıştan %85 kazanç, sadece sattığınızda %15 komisyon. Restoran, fırın ve marketler için ideal çözüm."
        canonical="/for-merchants"
        keywords="işletme gelir, gıda israfı önleme, restoran, fırın, market"
      />
      {/* Hero Section */}
      <MerchantsHero />

      {/* Comment ça marche - Design minimal */}
      <div className="bg-kk-paper py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-kk-night mb-4">Nasıl Çalışıyor?</h2>
            <p className="text-lg text-gray-600">4 basit adımda gelir elde edin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Étape 1 */}
            <div className="kk-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-kk-night rounded-full flex items-center justify-center mx-auto mb-4 text-kk-lime font-display text-2xl font-extrabold">
                1
              </div>
              <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Kayıt Olun</h3>
              <p className="text-sm text-gray-600">5 dakikada hesap oluşturun</p>
            </div>

            {/* Étape 2 */}
            <div className="kk-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-kk-lime rounded-full flex items-center justify-center mx-auto mb-4 text-kk-night font-display text-2xl font-extrabold">
                2
              </div>
              <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Teklif Yayınlayın</h3>
              <p className="text-sm text-gray-600">Fotoğraf + fiyat ekleyin</p>
            </div>

            {/* Étape 3 */}
            <div className="kk-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-kk-night rounded-full flex items-center justify-center mx-auto mb-4 text-kk-lime font-display text-2xl font-extrabold">
                3
              </div>
              <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Müşteri Rezerve Eder</h3>
              <p className="text-sm text-gray-600">Müşteri ödemeyi teslim alırken doğrudan size yapar</p>
            </div>

            {/* Étape 4 */}
            <div className="kk-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-kk-lime rounded-full flex items-center justify-center mx-auto mb-4 text-kk-night font-display text-2xl font-extrabold">
                4
              </div>
              <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Para Kazanın</h3>
              <p className="text-sm text-gray-600">Satışın %85'i sizin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculatrice Interactive */}
      <div className="bg-kk-paper py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="kk-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Gauche - Photo */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src="https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Gıda israfı"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-kk-night/90 via-kk-night/60 to-transparent flex items-center p-8">
                  <div className="text-white">
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Dur Gıda <span className="text-kk-lime">İsrafına</span></h3>
                    <p className="text-lg text-white/80 mb-4">
                      Her gün çöpe atılan ürünlerinizi gelire dönüştürün
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="kk-chip bg-white/15 backdrop-blur-sm px-3 py-1">
                        🌍 Çevreyi koruyun
                      </span>
                      <span className="kk-chip bg-white/15 backdrop-blur-sm px-3 py-1">
                        💰 Para kazanın
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Droite - Calculatrice */}
              <div className="p-8 lg:p-12 bg-white">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-kk-night mb-6">
                  🧮 Kazanç Hesaplayıcı
                </h2>
                <p className="text-gray-600 mb-8">
                  Günlük kayıplarınızı gelire dönüştürün
                </p>

                <CalculatorWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemples Types - Design sobre */}
      <div className="bg-kk-paper py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-kk-night mb-4">
              💼 İşletme Tipine Göre Kazanç Örnekleri
            </h2>
            <p className="text-lg text-gray-600">
              Varsayımsal örnek hesaplamalar (%15 komisyon ile)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Exemple 1 - Petit Boulanger */}
            <div className="kk-card p-8 border-2 border-transparent hover:border-kk-mint transition-colors">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🥖</div>
                <h3 className="font-display text-xl font-extrabold text-kk-night mb-1">Küçük Fırın</h3>
                <p className="text-sm text-gray-500">Konyaaltı, Antalya</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-center py-2 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-1">Günlük atılan ürün</p>
                  <p className="font-semibold text-gray-900">15 ekmek × 20₺</p>
                </div>

                <div className="text-center py-3 bg-red-50 rounded-2xl border-l-4 border-kk-coral">
                  <p className="text-xs text-kk-coral-text mb-1">❌ Önceki kayıp</p>
                  <p className="font-display text-xl font-extrabold text-kk-coral-text">7500₺/ay</p>
                </div>

                <div className="text-center py-3 bg-kk-mint/10 rounded-2xl border-l-4 border-kk-mint">
                  <p className="text-xs text-kk-mint-text mb-1">✅ KapKurtar ile</p>
                  <p className="font-display text-xl font-extrabold text-kk-mint-text">+6375₺/ay</p>
                  <p className="text-xs text-kk-mint-text">(%85 sizin)</p>
                </div>
              </div>

              <div className="text-center py-4 bg-kk-night rounded-2xl text-white">
                <p className="text-xs text-white/70 mb-1">Yıllık kazanç</p>
                <p className="font-display text-2xl font-extrabold text-kk-lime">76500₺</p>
              </div>
            </div>

            {/* Exemple 2 - Restaurant Moyen */}
            <div className="kk-card p-8 border-2 border-transparent hover:border-kk-mint transition-colors">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="font-display text-xl font-extrabold text-kk-night mb-1">Orta Boy Restoran</h3>
                <p className="text-sm text-gray-500">Muratpaşa, Antalya</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-center py-2 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-1">Günlük atılan porsiyon</p>
                  <p className="font-semibold text-gray-900">20 porsiyon × 80₺</p>
                </div>

                <div className="text-center py-3 bg-red-50 rounded-2xl border-l-4 border-kk-coral">
                  <p className="text-xs text-kk-coral-text mb-1">❌ Önceki kayıp</p>
                  <p className="font-display text-xl font-extrabold text-kk-coral-text">40000₺/ay</p>
                </div>

                <div className="text-center py-3 bg-kk-mint/10 rounded-2xl border-l-4 border-kk-mint">
                  <p className="text-xs text-kk-mint-text mb-1">✅ KapKurtar ile</p>
                  <p className="font-display text-xl font-extrabold text-kk-mint-text">+34000₺/ay</p>
                  <p className="text-xs text-kk-mint-text">(%85 sizin)</p>
                </div>
              </div>

              <div className="text-center py-4 bg-kk-night rounded-2xl text-white">
                <p className="text-xs text-white/70 mb-1">Yıllık kazanç</p>
                <p className="font-display text-2xl font-extrabold text-kk-lime">408000₺</p>
              </div>
            </div>

            {/* Exemple 3 - Grand Supermarché */}
            <div className="kk-card p-8 border-2 border-transparent hover:border-kk-mint transition-colors">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="font-display text-xl font-extrabold text-kk-night mb-1">Süpermarket</h3>
                <p className="text-sm text-gray-500">Lara, Antalya</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-center py-2 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-1">Günlük atılan ürün</p>
                  <p className="font-semibold text-gray-900">50 ürün × 120₺</p>
                </div>

                <div className="text-center py-3 bg-red-50 rounded-2xl border-l-4 border-kk-coral">
                  <p className="text-xs text-kk-coral-text mb-1">❌ Önceki kayıp</p>
                  <p className="font-display text-xl font-extrabold text-kk-coral-text">150000₺/ay</p>
                </div>

                <div className="text-center py-3 bg-kk-mint/10 rounded-2xl border-l-4 border-kk-mint">
                  <p className="text-xs text-kk-mint-text mb-1">✅ KapKurtar ile</p>
                  <p className="font-display text-xl font-extrabold text-kk-mint-text">+127500₺/ay</p>
                  <p className="text-xs text-kk-mint-text">(%85 sizin)</p>
                </div>
              </div>

              <div className="text-center py-4 bg-kk-night rounded-2xl text-white">
                <p className="text-xs text-white/70 mb-1">Yıllık kazanç</p>
                <p className="font-display text-2xl font-extrabold text-kk-lime">1530000₺</p>
              </div>
            </div>
          </div>

          {/* CTA sous les exemples */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Kendi kazancınızı hesaplamak ister misiniz? 👆
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <PricingSection3Plans />

      {/* FAQ Commission - Design cohérent */}
      <div className="bg-kk-paper py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-kk-night mb-4">
              ❓ Neden Abonelik Değil, Komisyon?
            </h2>
            <p className="text-lg text-gray-600">
              Başarınız bizim başarımız - Siz kazanırsanız biz kazanırız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Abonnement - Même style que Commission */}
            <div className="kk-card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-kk-coral/15 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-display text-xl font-extrabold text-kk-night">Abonelik Modeli</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-kk-coral-text mr-3 mt-1">•</span>
                  <span>Sabit aylık maliyet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-coral-text mr-3 mt-1">•</span>
                  <span>Az satış olsa bile ödeme</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-coral-text mr-3 mt-1">•</span>
                  <span>Mali baskı ve risk</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-coral-text mr-3 mt-1">•</span>
                  <span>Küçük işletmeler için ağır</span>
                </li>
              </ul>
            </div>

            {/* Commission - Même style mais avec border verte */}
            <div className="kk-card p-8 border-2 border-kk-mint">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-kk-mint rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl text-kk-night">✅</span>
                </div>
                <h3 className="font-display text-xl font-extrabold text-kk-night">Komisyon Modeli</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-kk-mint-text mr-3 mt-1">•</span>
                  <span>Sadece sattığınızda ödeme (%15)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-mint-text mr-3 mt-1">•</span>
                  <span>Satış yok = Maliyet yok</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-mint-text mr-3 mt-1">•</span>
                  <span>Sıfır risk - Tam güvenlik</span>
                </li>
                <li className="flex items-start">
                  <span className="text-kk-mint-text mr-3 mt-1">•</span>
                  <span>Başarınızla ölçeklenir</span>
                </li>
              </ul>

              {/* Exemple dans la card */}
              <div className="mt-6 pt-6 border-t border-black/10">
                <p className="text-sm font-semibold mb-3 text-gray-700">Örnek:</p>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Satış: 10000₺</span>
                    <span className="font-bold text-gray-900">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Size: 8500₺ (%85)</span>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Komisyon: 1500₺ (%15)</span>
                    <span className="font-bold text-gray-900">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact écologique */}
          <div className="kk-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <img
                src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Doğa"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-kk-night mb-2">
                  🌍 Para Kazanın + Dünyayı Kurtarın
                </h3>
                <p className="text-gray-600">
                  Her kaydettiğiniz ürün çevreye katkı sağlar
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="font-display text-3xl font-extrabold text-kk-mint-text mb-2">Daha az CO₂</div>
                <p className="text-sm text-gray-600">Atılmayan gıda, daha az emisyon</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="font-display text-3xl font-extrabold text-kk-mint-text mb-2">Su tasarrufu</div>
                <p className="text-sm text-gray-600">Üretimde harcanan kaynaklar boşa gitmez</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <div className="font-display text-3xl font-extrabold text-kk-mint-text mb-2">Daha yeşil 🌳</div>
                <p className="text-sm text-gray-600">Sürdürülebilir bir işletme imajı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-kk-night text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            📱 Mobil Uygulamamızı İndirin
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Tekliflerinizi her yerden yönetin. Android uygulaması Google Play'de, iOS sürümü yakında!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="kk-btn-primary px-8 py-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              Google Play'den İndir
            </a>
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/15 text-kk-muted px-8 py-4 font-semibold cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
              </svg>
              App Store'da Yakında
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-kk-night text-white py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Sorularınız mı <span className="text-kk-lime">var?</span></h2>
          <p className="text-xl text-white/70 mb-8">
            Ekibimiz size yardımcı olmaktan mutluluk duyar
          </p>
          <a
            href="/contact"
            className="kk-btn-primary px-8 py-4 text-lg"
          >
            Bize Ulaşın
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForMerchantsPage;
