import { Bell, MapPin, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { GOOGLE_PLAY_URL, GOOGLE_PLAY_QR_SRC } from '../lib/appLinks';

const DownloadPage = () => {
  const features = [
    {
      icon: Bell,
      title: 'Anlık Bildirimler',
      description: 'Yakınınızda yeni bir teklif yayınlandığında hemen haberdar olun'
    },
    {
      icon: MapPin,
      title: 'Konuma Göre Teklifler',
      description: 'Bölgenizdeki restoran, fırın ve marketlerin fırsatlarını harita üzerinde keşfedin'
    },
    {
      icon: Star,
      title: 'Kolay Rezervasyon',
      description: 'Birkaç dokunuşla rezerve edin, ödemeyi ürünü teslim alırken işletmede yapın'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title="KapKurtar Uygulamasını İndir | Android'de Yayında"
        description="KapKurtar Android uygulamasını Google Play'den indirin. Yakınınızdaki restoran, fırın ve marketlerin indirimli fırsatlarını keşfedin ve yeni teklifler için bildirim alın. iOS sürümü yakında."
        canonical="/download"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">KapKurtar Uygulamasını İndirin</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Yakınınızdaki indirimli fırsatları cebinizden takip edin, hiçbir teklifi kaçırmayın!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - QR Code and Download */}
          <div className="text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-6 p-2">
                <img
                  src={GOOGLE_PLAY_QR_SRC}
                  alt="Google Play'de KapKurtar uygulaması için QR kodu"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-gray-600 mb-6 font-medium">Android için QR kodu tarayın</p>
              
              {/* Download Text */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Anında haberdar olun. Uygulamayı hemen indirin.
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Favori işletmelerinizin fırsatlarını kaçırmayın. Yakınınızdaki yeni teklifler için bildirim alın.
                </p>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-col gap-4">
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/tr_badge_web_generic.png"
                    alt="Google Play'den alın"
                    className="h-14 mx-auto"
                  />
                </a>

                <div
                  aria-disabled="true"
                  className="h-14 mx-auto px-6 rounded-lg bg-gray-300 text-gray-500 font-semibold flex items-center justify-center cursor-not-allowed opacity-60"
                >
                  App Store – Yakında
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Neden Uygulamayı İndirmelisiniz?
            </h2>
            
            <div className="space-y-8 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-[#FFFFF0] p-4 rounded-lg">
                    <feature.icon className="w-8 h-8 text-[#00A690]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#00A690] py-16 px-6 rounded-2xl">
              <h3 className="font-semibold text-white mb-2">📱 Bildirimleri Etkinleştirin</h3>
              <p className="text-white leading-relaxed">
                Uygulamayı açtığınızda bildirim iznini verin: yakınınızda yeni bir teklif yayınlandığında anında haberdar olursunuz.
              </p>
            </div>
          </div>
        </div>

        {/* Phone Mockup Section */}
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">KapKurtar Mobilde</h2>
          
          <div className="flex justify-center relative">
            <div className="mx-auto w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Phone screen content */}
                <div className="bg-gradient-to-br from-green-400 to-green-500 h-24 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-white">
                    <img src="/images/logo-round.webp" alt="KapKurtar logosu" className="w-8 h-8 rounded-lg" />
                    <span className="font-bold text-lg">KapKurtar</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-[#00A690] rounded-full"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-20"></div>
                        <div className="h-2 bg-gray-200 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute top-32 left-2 right-2 bg-white rounded-lg shadow-lg p-3 border-l-4 border-[#00A690]">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-[#00A690]" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Yakınınızda yeni teklif!</div>
                      <div className="text-xs text-gray-600">Bir işletme yeni bir paket yayınladı</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">Tasarruf etmeye ve israfı azaltmaya hazır mısınız?</p>
          <a
            href="/offers"
            className="bg-[#00A690] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#F75C00] transition-colors inline-block text-lg"
          >
            Teklifleri Keşfet
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;