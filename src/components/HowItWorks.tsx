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
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasıl Çalışır</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Üç basit adımda tasarruf edin ve gıda israfını azaltın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 bg-[#00A690] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10">
                {step.step}
              </div>

              {/* Card */}
              <div className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-300 h-full">
                <div className="bg-[#FFFFF0] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-[#00A690]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-green-200 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/customer/teaser"
            className="bg-[#00A690] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#F75C00] transition-colors duration-300 inline-block"
          >
            Hemen Tasarruf Etmeye Başlayın
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;