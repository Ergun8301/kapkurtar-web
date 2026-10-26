import { Bell, MapPin, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { GOOGLE_PLAY_URL, GOOGLE_PLAY_QR_SRC } from '../lib/appLinks';
import { LogoMark } from '../components/brand/Logo';

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
    <div className="min-h-screen bg-kk-paper py-12">
      <SEO
        title="KapKurtar Uygulamasını İndir | Android'de Yayında"
        description="KapKurtar Android uygulamasını Google Play'den indirin. Yakınınızdaki restoran, fırın ve marketlerin indirimli fırsatlarını keşfedin ve yeni teklifler için bildirim alın. iOS sürümü yakında."
        canonical="/download"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-kk-night mb-6">KapKurtar Uygulamasını İndirin</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Yakınınızdaki indirimli fırsatları cebinizden takip edin, hiçbir teklifi kaçırmayın!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - QR Code and Download */}
          <div className="text-center">
            <div className="bg-kk-night text-white p-8 rounded-3xl shadow-xl mb-8">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 p-3">
                <img
                  src={GOOGLE_PLAY_QR_SRC}
                  alt="Google Play'de KapKurtar uygulaması için QR kodu"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-white/70 mb-6 font-medium">Android için QR kodu tarayın</p>
              
              {/* Download Text */}
              <div className="mb-8">
                <h3 className="text-2xl font-display font-extrabold tracking-tight text-white mb-4">
                  Anında haberdar olun. Uygulamayı hemen indirin.
                </h3>
                <p className="text-kk-muted leading-relaxed">
                  Favori işletmelerinizin fırsatlarını kaçırmayın. Yakınınızdaki yeni teklifler için bildirim alın.
                </p>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-col gap-4">
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kk-btn-primary h-14 mx-auto px-8"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  <span>Google Play'den alın</span>
                </a>

                <div
                  aria-disabled="true"
                  className="h-14 mx-auto px-6 rounded-full bg-white/10 border border-white/10 text-white/70 font-semibold flex items-center justify-center cursor-not-allowed"
                >
                  App Store – Yakında
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div>
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-kk-night mb-8">
              Neden Uygulamayı İndirmelisiniz?
            </h2>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="kk-card p-5 flex items-start space-x-4">
                  <div className="bg-kk-mint p-4 rounded-2xl">
                    <feature.icon className="w-8 h-8 text-kk-night" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-kk-night mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-kk-night py-12 px-6 rounded-3xl">
              <h3 className="font-semibold text-white mb-2">📱 Bildirimleri Etkinleştirin</h3>
              <p className="text-white/70 leading-relaxed">
                Uygulamayı açtığınızda bildirim iznini verin: yakınınızda yeni bir teklif yayınlandığında anında haberdar olursunuz.
              </p>
            </div>
          </div>
        </div>

        {/* Phone Mockup Section */}
        <div className="kk-card p-12 text-center">
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-kk-night mb-12">KapKurtar Mobilde</h2>
          
          <div className="flex justify-center relative">
            <div className="mx-auto w-64 h-96 bg-kk-night rounded-[2rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Phone screen content */}
                <div className="bg-kk-night h-24 flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-white">
                    <LogoMark size={32} />
                    <span className="font-display font-extrabold text-lg">KapKurtar</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="bg-kk-paper rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-kk-mint rounded-full"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-20"></div>
                        <div className="h-2 bg-gray-200 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="bg-kk-paper rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-kk-lime rounded-full"></div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-12 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute top-32 left-2 right-2 bg-white rounded-lg shadow-lg p-3 border-l-4 border-kk-lime">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-kk-mint-text" />
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
          <p className="text-gray-700 mb-6 text-lg">Tasarruf etmeye ve israfı azaltmaya hazır mısınız?</p>
          <a
            href="/offers"
            className="kk-btn-primary px-8 py-4 text-lg"
          >
            Teklifleri Keşfet
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;