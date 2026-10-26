import { Calendar, User, ArrowLeft, Heart, TrendingDown, Utensils } from 'lucide-react';

const BlogArticle9 = () => {
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
              İsraf Karşıtı
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            KapKurtar ile tasarruf ederken sağlıklı beslenmek
          </h1>
          <div className="flex flex-wrap items-center text-kk-muted mb-8">
            <User className="w-5 h-5 mr-2" />
            <span className="mr-6">Diyetisyen Elif</span>
            <Calendar className="w-5 h-5 mr-2" />
            <span>30 Eylül 2024</span>
            <span className="mx-3">•</span>
            <span>7 dk okuma</span>
          </div>
          <img
            src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Sağlıklı ve dengeli öğün"
            className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none kk-card p-6 md:p-10">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sağlıklı beslenmenin pahalı olduğu sık duyulur. KapKurtar ile, kaliteli satılmayan ürünler
            sayesinde kısıtlı bütçeyi dengeli beslenme ile nasıl uzlaştıracağınızı keşfedin.
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <TrendingDown className="inline w-6 h-6 mr-2 text-kk-mint-text" />
            "Sağlıklı yemek = pahalı" efsanesi
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Yaygın kanaatin aksine, dengeli beslenme mutlaka daha pahalı değildir.
            Sorun? Taze ve kaliteli ürünler genellikle birçok aile için bütçe dışı.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 my-8 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-3">📊 Türkiye'de bazı rakamlar:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• 4 kişilik bir aile beslenme için ayda ortalama <strong>4.000-5.000 TL</strong> harcıyor</li>
              <li>• Taze meyve ve sebzeler bu bütçenin <strong>%30-40'ını</strong> oluşturuyor</li>
              <li>• Türklerin <strong>%60'ı</strong> fiyatlar nedeniyle taze ürün tüketimlerini azalttıklarını bildiriyor</li>
            </ul>
          </div>

          <blockquote className="border-l-4 border-kk-mint pl-6 my-8 italic text-gray-700">
            "KapKurtar sabah satılanlara eşdeğer kalitede ürünlere, fakat yarı fiyatına erişim sağlıyor.
            Sağlıklı beslenme erişimi için bir devrim."
            <br />
            <span className="text-sm not-italic">- Dr. Elif Yıldız, diyetisyen</span>
          </blockquote>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Heart className="inline w-6 h-6 mr-2 text-kk-coral-text" />
            Dengeli beslenmenin temelleri
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Tasarruftan bahsetmeden önce, Türk Sağlık Bakanlığı tavsiyelerine göre
            dengeli bir tabağın ne olduğunu hatırlayalım.
          </p>

          <div className="bg-kk-lime/15 rounded-2xl p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-4">🍽️ İdeal tabak:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-900 mb-2">%50 Sebze</p>
                <p className="text-sm text-gray-700">Taze, pişmiş veya çiğ. Renkleri çeşitlendirin!</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">%25 Protein</p>
                <p className="text-sm text-gray-700">Et, balık, yumurta, baklagiller</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">%25 Nişasta</p>
                <p className="text-sm text-gray-700">Ekmek, pirinç, makarna, bulgur, patates</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">+ Süt ürünleri</p>
                <p className="text-sm text-gray-700">Peynir, yoğurt, ayran</p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">
            <Utensils className="inline w-6 h-6 mr-2 text-kk-mint-text" />
            KapKurtar dengeli beslenmeyi nasıl kolaylaştırıyor
          </h2>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">1. Taze meyve ve sebzeye kolay erişim</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Manavlar hafif solmuş veya fazla meyve ve sebzeleri
            indirimli fiyatlarla sunabiliyor.
          </p>
          <div className="bg-green-50 rounded-2xl p-6 my-6">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Örnek:</strong> Bir manav akşamları domates, salatalık, biber ve patlıcandan
              oluşan karışık bir sebze sepetini indirimli fiyatla sunabilir.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Sonuç:</strong> Kalabalık bir aile için sebze harcamalarında
              kayda değer bir tasarruf sağlayabilir!
            </p>
          </div>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">2. Uygun fiyatlı dengeli hazır yemekler</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Restoranlar genellikle servis sonunda satılmayan günlük yemeklerini sunuyor.
            Yemek pişirmeye vakti olmayanlar için bir nimet.
          </p>
          <div className="bg-blue-50 rounded-2xl p-6 my-6">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Örnek:</strong> Bir restoran servis sonunda tam menüyü
              (çorba + ana yemek + garnitür) indirimli fiyatla sunabilir.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Beslenme kalitesi:</strong> Taze sebzeler, kaliteli proteinler, bol porsiyonlar.
              Öğle servisi ile aynı!
            </p>
          </div>

          <h3 className="font-display text-xl font-extrabold text-kk-night mt-8 mb-3">3. Tam buğday ekmek ve tahıl ürünleri</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Beyaz ekmekten daha besleyici olan tam buğday ekmek genellikle daha pahalıdır.
            KapKurtar'ta gün sonunda indirimli bulursunuz.
          </p>
          <div className="bg-amber-50 rounded-2xl p-6 my-6">
            <p className="text-sm text-gray-700">
              <strong>Bilinmesi gereken:</strong> Bir günlük ekmek tamamen tüketilebilir ve
              tüm besin değerlerini korur. Daha az nemli olduğu için sindirim için bile daha iyidir!
            </p>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">KapKurtar ile haftalık menü fikirleri</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Geleneksel alışverişi ve KapKurtar tekliflerini birleştirerek tipik bir hafta örneği.
          </p>

          <div className="space-y-4 my-8">
            {[
              { gun: 'Pazartesi', ogle: 'Mercimek salatası + KapKurtar tam buğday ekmek', aksam: 'Balık + KapKurtar buharda sebze' },
              { gun: 'Salı', ogle: 'Balık artığı + pirinç', aksam: 'KapKurtar restoran menüsü (çorba + ana yemek)' },
              { gun: 'Çarşamba', ogle: 'Yumurta + KapKurtar sote sebze', aksam: 'Makarna + ev yapımı domates sosu (KapKurtar domates)' },
              { gun: 'Perşembe', ogle: 'KapKurtar ekmek + peynir + çiğ sebze sandviç', aksam: 'Fırında tavuk + patates püresi + salata' },
              { gun: 'Cuma', ogle: 'KapKurtar sebze çorbası + ekmek', aksam: 'Ev yapımı pizza (taban olarak KapKurtar ekmek)' },
              { gun: 'Cumartesi', ogle: 'Brunch (KapKurtar hamur işleri + yumurta + meyve)', aksam: 'Köfte + bulgur + yoğurt' },
              { gun: 'Pazar', ogle: 'Geleneksel aile yemeği', aksam: 'Çorba + ekmek + KapKurtar peynir' }
            ].map((menu, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-2xl p-4">
                <h4 className="font-display font-extrabold text-kk-mint-text mb-2">{menu.gun}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div><strong>Öğle:</strong> {menu.ogle}</div>
                  <div><strong>Akşam:</strong> {menu.aksam}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-2xl">
            <h3 className="font-bold text-gray-900 mb-3">💡 Diyetisyen ipucu:</h3>
            <p className="text-gray-700 text-sm">
              KapKurtar ürünleri pişmiş preparatlar (çorba, graten, komposto, smoothie) için mükemmel.
              Bir meyve veya sebze artık görsel olarak mükemmel olmasa bile, tüm besinlerini korur!
            </p>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">Kaçınılması gereken tuzaklar</h2>
          <div className="space-y-4 my-8">
            <div className="flex items-start bg-red-50 rounded-2xl p-4">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1">İhtiyaç olmadan satın almak</p>
                <p className="text-sm text-gray-600">%50 indirimli olsa bile, tüketmezseniz israftır</p>
              </div>
            </div>
            <div className="flex items-start bg-red-50 rounded-2xl p-4">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Planlamayı ihmal etmek</p>
                <p className="text-sm text-gray-600">Menülerinizi mevcut tekliflere göre planlayın</p>
              </div>
            </div>
            <div className="flex items-start bg-red-50 rounded-2xl p-4">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Dondurmayı unutmak</p>
                <p className="text-sm text-gray-600">Fazlalıklar mı var? Hemen dondurun!</p>
              </div>
            </div>
          </div>

          <div className="not-prose bg-kk-night text-white rounded-3xl p-8 my-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">Bugünden daha iyisini daha ucuza yiyin</h3>
            <p className="mb-6 text-white/70">
              KapKurtar'ı indirin ve yakınınızdaki teklifleri keşfedin
            </p>
            <a
              href="/download"
              className="kk-btn-primary px-8 py-3"
            >
              Uygulamayı indir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle9;
