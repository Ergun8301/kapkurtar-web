import { Search, ShoppingCart, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Teklifleri Keşfet',
      description: 'Yakınınızdaki yerel restoranlardan harika fırsatlar görün. Favori yerlerinizden indirimli yemekler bulun.',
      step: '01'
    },
    {
      icon: ShoppingCart,
      title: 'Yemeğinizi Rezerve Edin',
      description: 'İstediğiniz teklifi seçin ve uygulamadan anında rezerve edin. Ödemeyi ürünü teslim alırken işletmede yaparsınız.',
      step: '02'
    },
    {
      icon: MapPin,
      title: 'Alın ve Tadını Çıkarın',
      description: 'Teklif sona ermeden işletmeye gidin, ödemenizi yerinde yapıp yemeğinizi alın ve harika fiyatlarla tadını çıkarın.',
      step: '03'
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-kk-night mb-4">Nasıl Çalışır</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Üç basit adımda tasarruf edin ve gıda israfını azaltın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative kk-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
              {/* Card */}
              <div className="kk-card p-8 h-full transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  {/* Step Number */}
                  <span className="font-display font-extrabold tracking-tight text-6xl leading-none text-kk-night">
                    {step.step}
                  </span>
                  <div className="bg-kk-lime w-14 h-14 rounded-full flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-kk-night" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-kk-night mb-3">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-kk-night/15 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/customer/teaser"
            className="kk-btn-dark px-8 py-3"
          >
            Hemen Tasarruf Etmeye Başlayın
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;