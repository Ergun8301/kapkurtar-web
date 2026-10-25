import { Calendar, User, ArrowLeft, TrendingUp, BarChart3, Smartphone } from 'lucide-react';

const BlogArticle5 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/blog" className="inline-flex items-center text-[#00A690] hover:text-[#F75C00] transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Bloga dön
          </a>
        </div>
      </div>

      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="bg-[#00A690] text-white px-4 py-2 rounded-full text-sm font-medium">
              Tavsiyeler
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            İsraf karşıtı işletmeler için en iyi uygulamalar
          </h1>
          <div className="flex items-center text-gray-600 mb-8">
            <User className="w-5 h-5 mr-2" />
            <span className="mr-6">KapKurtar İşletme</span>
            <Calendar className="w-5 h-5 mr-2" />
            <span>28 Ekim 2024</span>
            <span className="mx-3">•</span>
            <span>8 dk okuma</span>
          </div>
          <img
            src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="KapKurtar partner işletmesi"
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            İşletme sahibisiniz ve karlılığınızı artırırken satılmayan ürünlerinizi nasıl optimize edeceğinizi mi merak ediyorsunuz?
            Satılmayan ürünlerinizi değerlendirmek için etkili stratejileri keşfedin.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            <TrendingUp className="inline w-6 h-6 mr-2 text-[#00A690]" />
            Kayıplarınızı kara dönüştürün
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Ortalama olarak bir gıda işletmesi her gün stokunun %5 ile %15'i arasını atıyor.
            KapKurtar ile bu kayıplar ek gelir fırsatlarına dönüşüyor.
          </p>

          <div className="bg-[#FFFFF0] rounded-lg p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-3">Örnek hesaplama: bir fırın</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>KapKurtar öncesi:</strong> Günde 50 satılmayan ekmek = 200 TL kayıp</li>
              <li>• <strong>KapKurtar ile:</strong> %40 indirimle satılan 45 ekmek = 108 TL gelir</li>
              <li>• <strong>Aylık kazanç:</strong> -6.000 TL yerine +3.240 TL</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            <BarChart3 className="inline w-6 h-6 mr-2 text-[#00A690]" />
            Başarının 5 temel ilkesi
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Cazip (ama karlı) fiyatlar belirleyin</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Yaygın hata: sadece %10 veya %20 indirim sunmak. KapKurtar kullanıcıları gerçek fırsatlar arıyor.
          </p>
          <div className="bg-white border-2 border-[#00A690] rounded-lg p-6 my-6">
            <p className="font-bold text-gray-900 mb-2">Önerimiz:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Hamur işleri/Ekmek: %40 ila %60 indirim</li>
              <li>• Meyve ve sebzeler: %50 ila %70 indirim</li>
              <li>• Hazır yemekler: %40 ila %50 indirim</li>
              <li>• Süt ürünleri: %30 ila %40 indirim</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Tekliflerinizi doğru zamanda yayınlayın</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Tekliflerinizi gün içinde erken yayınlamak, müşterilere planlama ve rezervasyon için
            daha fazla zaman tanır. Satılmayacağını öngördüğünüz ürünleri mümkün olduğunca erken paylaşın.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Fotoğraflarınıza özen gösterin</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            İştah açıcı bir fotoğraf satış şansını önemli ölçüde artırır. Güzel bir fotoğraf için 2 dakika ayırın:
          </p>
          <ul className="space-y-2 text-gray-700 ml-6 mb-6">
            <li>• Doğal ışık (pencere yakını)</li>
            <li>• Temiz ve nötr arka plan</li>
            <li>• Ürüne yakın kadraj</li>
            <li>• Telefon flaşından kaçının</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Doğru satış modunu seçin</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            KapKurtar iki mod sunuyor: rezervasyon veya "ilk gelen". Faaliyet alanınıza göre seçin:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">✅ Rezervasyon</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>İdeal olduğu durumlar:</strong></p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hazır yemekler</li>
                <li>• Büyük hacimler</li>
                <li>• Hassas ürünler</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3">
                <strong>Avantaj:</strong> Sıfır israf garantisi
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">⚡ İlk gelen</h4>
              <p className="text-sm text-gray-700 mb-2"><strong>İdeal olduğu durumlar:</strong></p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ekmek/hamur işleri</li>
                <li>• Küçük hacimler</li>
                <li>• Gelip geçen müşteriler</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3">
                <strong>Avantaj:</strong> Daha fazla esneklik
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. KapKurtar müşterilerinizi sadık hale getirin</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Memnun müşteri geri gelir! Ara sıra alışveriş yapanı sadık müşteriye dönüştürmek için birkaç ipucu:
          </p>
          <ul className="space-y-3 text-gray-700 ml-6 mb-6">
            <li>• <strong>Sıcak karşılama:</strong> Bir gülümseme ve teşekkür fark yaratır</li>
            <li>• <strong>Düzenlilik:</strong> Her gün teklif yayınlayın (küçük de olsa)</li>
            <li>• <strong>Sürpriz bonus:</strong> Ara sıra küçük bir ekstra ekleyin</li>
            <li>• <strong>İletişim:</strong> Sadık müşterilerinizi en iyi tekliflerinizden haberdar edin</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
            <Smartphone className="inline w-6 h-6 mr-2 text-[#00A690]" />
            İşletme uygulamasını etkili kullanın
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            KapKurtar işletme uygulaması hızlı ve sezgisel olacak şekilde tasarlandı.
            2 dakikadan kısa sürede eksiksiz bir teklif yayınlayabilirsiniz.
          </p>

          <div className="bg-white border-2 border-[#00A690] rounded-lg p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-4">Mükemmel bir teklif için kontrol listesi:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Kaliteli fotoğraf</li>
              <li>✓ Açıklayıcı başlık (örn: "Hamur işleri" yerine "5 tereyağlı kruvasan")</li>
              <li>✓ Cazip fiyat (minimum %40 indirim önerilir)</li>
              <li>✓ Net teslimat saati</li>
              <li>✓ Mevcut miktar belirtilmiş</li>
              <li>✓ Rezervasyon/direkt modu seçilmiş</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Kaçınılması gereken hatalar</h2>
          <div className="space-y-4 my-8">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-bold text-gray-900">❌ Çok yüksek fiyatlar</p>
              <p className="text-sm text-gray-600">Kullanıcılar gerçek indirimler arıyor</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-bold text-gray-900">❌ Düşük kaliteli fotoğraflar</p>
              <p className="text-sm text-gray-600">Güzel bir fotoğraf için 30 saniye ayırın</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-bold text-gray-900">❌ Pratik olmayan teslimat saatleri</p>
              <p className="text-sm text-gray-600">Müşterilerinizin saatlerine uyum sağlayın (17:00-20:00 ideal)</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-bold text-gray-900">❌ Düzensizlik</p>
              <p className="text-sm text-gray-600">Müşterilerinizde alışkanlık oluşturmak için her gün yayınlayın</p>
            </div>
          </div>

          <div className="bg-[#00A690] text-white rounded-lg p-8 my-12 text-center">
            <h3 className="text-2xl font-bold mb-4">KapKurtar'a katılmaya hazır mısınız?</h3>
            <p className="mb-6 text-[#FFFFF0]">
              Ücretsiz kayıt olun ve satılmayan ürünlerinizi bugünden değerlendirmeye başlayın
            </p>
            <a
              href="/merchant/auth"
              className="bg-white text-[#00A690] px-8 py-3 rounded-lg font-medium hover:bg-[#FFFFF0] transition-colors duration-300 inline-block"
            >
              Partner ol
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle5;