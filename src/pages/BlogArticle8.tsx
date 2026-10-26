import { Calendar, User, ArrowLeft, Apple, Leaf, Snowflake, Sun } from 'lucide-react';

const BlogArticle8 = () => {
  return (
    <div className="min-h-screen bg-kk-paper">
      <div className="bg-kk-night border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/blog" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Bloga dön
          </a>
        </div>
      </div>

      <div className="bg-kk-night text-white pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="kk-chip bg-kk-lime text-kk-night px-4 py-2 text-sm font-semibold">
              Tavsiyeler
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Meyve ve sebze saklama: kapsamlı rehber
          </h1>
          <div className="flex flex-wrap items-center text-kk-muted mb-8">
            <User className="w-5 h-5 mr-2" />
            <span className="mr-6">Diyetisyen Elif</span>
            <Calendar className="w-5 h-5 mr-2" />
            <span>8 Ekim 2024</span>
            <span className="mx-3">•</span>
            <span>9 dk okuma</span>
          </div>
          <img
            src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Taze meyve ve sebzeler"
            className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none kk-card p-6 md:p-10">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Evdeki gıda israfının %40'ının meyve ve sebzeleri ilgilendirdiğini biliyor muydunuz?
            Daha uzun süre taze kalmalarını sağlamak için nasıl doğru saklanacağını öğrenin.
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Snowflake className="inline w-6 h-6 mr-2 text-kk-mint-text" />
            Buzdolabında (0-5°C)
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Yaygın kanaatin aksine, tüm meyve ve sebzeler buzdolabına konmaz!
            Bazıları lezzet ve dokularını kaybeder.
          </p>

          <div className="bg-blue-50 rounded-2xl p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-4">✅ Buzdolabında saklanacaklar:</h3>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Sebzeler (sebzelik bölümü):</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <strong>Yapraklı sebzeler:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Salata (nemli bir bezde)</li>
                  <li>• Ispanak</li>
                  <li>• Pazı</li>
                  <li>• Taze otlar</li>
                </ul>
              </div>
              <div>
                <strong>Diğer sebzeler:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Havuç</li>
                  <li>• Pırasa</li>
                  <li>• Brokoli</li>
                  <li>• Karnabahar</li>
                  <li>• Mantar</li>
                  <li>• Kuşkonmaz</li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold text-gray-900 mt-6 mb-2">Meyveler (üst raflar):</h4>
            <ul className="text-sm text-gray-700 ml-4 space-y-1">
              <li>• Kırmızı meyveler (çilek, ahududu, yaban mersini)</li>
              <li>• Üzüm</li>
              <li>• İncir</li>
              <li>• Kiraz</li>
            </ul>

            <div className="bg-white rounded-2xl p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>💡 İpucu:</strong> Meyve ve sebzeleri buzdolabına koymadan önce yıkamayın,
                nem bozulmalarını hızlandırır. Tüketmeden hemen önce yıkayın.
              </p>
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Sun className="inline w-6 h-6 mr-2 text-kk-coral-text" />
            Oda sıcaklığında (18-22°C)
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Birçok Akdeniz meyvesi ve sebzesi ortam havasını buzdolabı soğuğuna tercih eder.
          </p>

          <div className="bg-orange-50 rounded-2xl p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-4">🏠 Buzdolabı dışında saklanacaklar:</h3>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Sebzeler:</h4>
            <ul className="text-sm text-gray-700 ml-4 space-y-1 mb-4">
              <li>• <strong>Domates</strong> - Soğuk lezzetini yok eder!</li>
              <li>• <strong>Patates</strong> - Karanlık ve kuru bir yerde</li>
              <li>• <strong>Soğan</strong> - Havadar bir yerde</li>
              <li>• <strong>Sarımsak</strong> - Kuru bir yerde</li>
              <li>• <strong>Kabaklar</strong> - Birkaç ay saklanabilir</li>
              <li>• <strong>Patlıcan</strong> - Hızlı tüketin</li>
              <li>• <strong>Biber</strong> - Maksimum 3-4 gün</li>
              <li>• <strong>Salatalık</strong> - Soğuğa duyarlı</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-4 mb-2">Meyveler:</h4>
            <ul className="text-sm text-gray-700 ml-4 space-y-1">
              <li>• <strong>Muz</strong> - Buzdolabında kararır</li>
              <li>• <strong>Narenciye</strong> - Limon, portakal, mandalina</li>
              <li>• <strong>Çekirdekli meyveler</strong> - Şeftali, kayısı, erik (olgunlaşana kadar)</li>
              <li>• <strong>Kavun</strong> - Sadece bütün, kesildikten sonra buzdolabına</li>
              <li>• <strong>Avokado</strong> - Olgunlaşsın, sonra çok olgunsa buzdolabı</li>
              <li>• <strong>Ananas</strong></li>
              <li>• <strong>Mango</strong></li>
            </ul>

            <div className="bg-white rounded-2xl p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Dikkat:</strong> Patates ve soğanı asla bir arada saklamayın!
                Patatesler soğanları daha hızlı filizlendirir.
              </p>
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Apple className="inline w-6 h-6 mr-2 text-kk-coral-text" />
            Etilen gazı: dost mu düşman mı?
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Bazı meyveler olgunlaşmayı hızlandıran etilen adlı bir gaz üretir.
            Durumlara göre faydalı... veya sorunlu!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-red-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">🍎 Yüksek etilen üreticileri:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Elma</li>
                <li>• Muz</li>
                <li>• Avokado</li>
                <li>• Armut</li>
                <li>• Domates</li>
                <li>• Kivi</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                👉 Diğer meyvelerin olgunlaşmasını hızlandırmamak için izole edin!
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">🥒 Etilene duyarlı olanlar:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Brokoli</li>
                <li>• Karnabahar</li>
                <li>• Salatalık</li>
                <li>• Patlıcan</li>
                <li>• Salata</li>
                <li>• Havuç</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                👉 Etilen üreticilerinden uzak tutun!
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-2xl">
            <p className="font-bold text-gray-900 mb-2">💡 Profesyonel ipucu:</p>
            <p className="text-gray-700">
              Bir avokado veya armudu hızlı olgunlaştırmak mı istiyorsunuz? Bir elma veya muzla
              birlikte kağıt torbaya koyun. Konsantre etilen süreci hızlandırır!
            </p>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Leaf className="inline w-6 h-6 mr-2 text-kk-mint-text" />
            Gelişmiş saklama teknikleri
          </h2>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">1. Buz banyosu</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Yumuşamış salata ve yapraklı sebzelere gevrekliğini geri kazandırmak için.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Yöntem:</strong> Sebzeleri buz kalıplarıyla çok soğuk suyla dolu büyük bir kaseye
              15-30 dakika batırın. Süzün ve nazikçe kurulayın.
            </p>
          </div>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">2. Emici kağıt</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Yapraklı sebzelerin ve mantarların raf ömrünü uzatmak için ideal.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Yöntem:</strong> Sebzeleri buzdolabına koymadan önce hafifçe nemli emici kağıda sarın,
              sonra delikli plastik torbaya koyun.
            </p>
          </div>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">3. Beyaz sirke</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Kırmızı meyvelerin tazeliğini birkaç gün uzatır.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Yöntem:</strong> 3 ölçü suya 1 ölçü beyaz sirke karıştırın.
              Kırmızı meyveleri hızlıca batırın, temiz suyla durulayın ve nazikçe kurulayın.
              Sirke tadı değiştirmeden bakterileri yok eder.
            </p>
          </div>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">4. Akıllıca dondurma</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Çok fazla meyve veya sebzeniz mi var? Akıllıca dondurun!
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Meyveler:</strong> Yıkayın, kurulayın ve bir tepsiye yayın. 2 saat dondurun,
              sonra dondurma torbasına aktarın. Smoothie ve kompostolar için mükemmel!
            </p>
            <p className="text-sm text-gray-700">
              <strong>Sebzeler:</strong> Dondurmadan önce kaynar suda 2-3 dakika haşlayın,
              sonra buzlu suya batırın. Renk ve besinlerini korurlar.
            </p>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">Özet tablo</h2>
          <div className="overflow-x-auto my-8">
            <table className="min-w-full bg-white border border-black/10 rounded-2xl overflow-hidden text-sm">
              <thead className="bg-kk-night text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Gıda</th>
                  <th className="px-4 py-3 text-left">Nerede?</th>
                  <th className="px-4 py-3 text-left">Süre</th>
                  <th className="px-4 py-3 text-left">İpucu</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b">
                  <td className="px-4 py-3">Domates</td>
                  <td className="px-4 py-3">Ortam</td>
                  <td className="px-4 py-3">5-7 gün</td>
                  <td className="px-4 py-3">Baş aşağı</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-3">Salata</td>
                  <td className="px-4 py-3">Buzdolabı</td>
                  <td className="px-4 py-3">3-5 gün</td>
                  <td className="px-4 py-3">Nemli bez</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Muz</td>
                  <td className="px-4 py-3">Ortam</td>
                  <td className="px-4 py-3">5-7 gün</td>
                  <td className="px-4 py-3">Diğer meyvelerden izole</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-3">Havuç</td>
                  <td className="px-4 py-3">Buzdolabı</td>
                  <td className="px-4 py-3">2-3 hafta</td>
                  <td className="px-4 py-3">Buzdolabında suda</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Çilek</td>
                  <td className="px-4 py-3">Buzdolabı</td>
                  <td className="px-4 py-3">3-5 gün</td>
                  <td className="px-4 py-3">Beyaz sirke banyosu</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="not-prose bg-kk-night text-white rounded-3xl p-8 my-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">KapKurtar ile akıllıca alışveriş yapın</h3>
            <p className="text-white/70 mb-6">
              İndirimli fiyatlarla hafif solmuş meyve ve sebzeler mi? Smoothie, çorba ve kompostolar için mükemmel!
            </p>
            <a
              href="/offers"
              className="kk-btn-primary px-8 py-3"
            >
              Günün tekliflerini görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle8;
