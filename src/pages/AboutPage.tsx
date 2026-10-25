import { Heart, Users, TrendingUp, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#00A690] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            KapKurtar Hakkında
          </h1>
          <p className="text-xl text-[#FFFFF0] max-w-2xl mx-auto">
            Gıda israfıyla mücadele etmek için işletmeleri ve tüketicileri birbirine bağlayan bir platform
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            KapKurtar basit bir tespitle doğdu: her gün binlerce mükemmel tüketilebilir gıda ürünü
            çöpe atılıyor. Misyonumuz, satılmayan ürünleri olan işletmelerle indirimli fiyatlarla
            kaliteli ürün arayan tüketiciler arasında bir köprü kurmaktır.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-[#00A690] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">İsraf Karşıtı</h3>
            <p className="text-gray-600">
              Kaliteli satılmayan ürünlere ikinci bir şans vererek gıda israfını azaltmak
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-[#F75C00] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Yerel Dayanışma</h3>
            <p className="text-gray-600">
              Yerel işletmeleri desteklemek ve işletmelerle sakinler arasında bağ kurmak
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Erişilebilirlik</h3>
            <p className="text-gray-600">
              İndirimli fiyatlarla kaliteli beslenmeyi herkes için erişilebilir kılmak
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Hikayemiz</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              KapKurtar, 2024 yılında Antalya'da net bir vizyonla başlatıldı: işletmelere ve tüketicilere
              hizmet ederken gıda israfı sorununu çözmek için teknolojiyi kullanmak.
            </p>
            <p className="mb-4">
              Türkiye'de her yıl 2,3 milyon tondan fazla gıdanın israf edildiğini fark eden
              tutkulu küçük ekibimiz, somut olarak harekete geçmeye karar verdi. Fikir basitti: işletmelerin
              satılmayan ürünlerini atmak yerine değerlendirebilecekleri bir platform oluşturmak.
            </p>
            <p className="mb-4">
              Bugün Antalya'daki yerel işletmeleri, satılmayan ürünlerini indirimli fiyatlarla
              değerlendirmek isteyen müşterilerle buluşturuyoruz. Ama bu sadece başlangıç.
            </p>
            <p>
              Hedefimiz mi? Türkiye'de israf karşıtı hareketin referansı olmak ve bir ekonomik
              modelin aynı anda karlı, ekolojik ve dayanışmacı olabileceğini kanıtlamak.
            </p>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="bg-[#00A690] rounded-xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Hedeflerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Yerel</div>
              <div className="text-[#FFFFF0]">İşletmeleri desteklemek</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Uygun</div>
              <div className="text-[#FFFFF0]">Fiyatlı kaliteli gıda</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Daha az</div>
              <div className="text-[#FFFFF0]">Gıda israfı</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Yeni</div>
              <div className="text-[#FFFFF0]">Şehirlere yayılmak</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tutkulu Bir Ekip</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            KapKurtar, her şeyden önce yerel olarak hareket ederek işleri değiştirebileceğine inanan
            tutkulu bir ekiptir. Geliştiriciler, tasarımcılar, ticaret ve lojistik uzmanları:
            KapKurtar'ı günlük hayatta basit, etkili ve kullanışlı bir araç haline getirmek için birlikte çalışıyoruz.
          </p>
        </div>

        {/* Zone Coverage */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-[#00A690] mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Hizmet Bölgelerimiz</h2>
          </div>
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Şu anda Antalya ve çevresinde aktif olan KapKurtar, ilerleyen dönemde
              Türkiye'nin diğer şehirlerine de yayılmayı planlıyor.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-[#00A690] rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">📍 Şu anda</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Antalya ve çevresi</li>
              </ul>
            </div>
            <div className="border-2 border-gray-300 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">🚀 Yakında</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Türkiye'nin diğer şehirleri</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Harekete Katılın</h2>
          <p className="text-lg text-gray-600 mb-8">
            İşletme veya tüketici olun, çözümün parçası olabilirsiniz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/merchant/auth"
              className="bg-[#00A690] text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              İşletme sahibiyim
            </a>
            <a
              href="/download"
              className="bg-[#F75C00] text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Tüketiciyim
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;