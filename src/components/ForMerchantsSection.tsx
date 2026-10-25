import { TrendingUp, Users, Leaf, ArrowRight } from 'lucide-react';

const ForMerchantsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Geliri Artırın',
      description: 'Fazla gıdayı israf yerine kâra dönüştürün'
    },
    {
      icon: Users,
      title: 'Yeni Müşteriler Kazanın',
      description: 'Bölgenizdeki bilinçli tüketicilere ulaşın'
    },
    {
      icon: Leaf,
      title: 'İsrafı Azaltın',
      description: 'Çevre üzerinde olumlu etki yaratın'
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              İşletmeler İçin: İsrafı Gelire Dönüştürün
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              İlerici düşünen restoranlar ağımıza katılın. Gıda israfını azaltın,
              yeni müşteriler çekin ve KapKurtar ile kârınızı artırın.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-[#FFFFF0] p-3 rounded-lg">
                    <benefit.icon className="w-6 h-6 text-[#00A690]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/for-merchants"
                className="bg-[#00A690] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#F75C00] transition-colors duration-300 inline-flex items-center"
              >
                Ortak Olun
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/for-merchants"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Daha Fazla Bilgi
              </a>
            </div>
          </div>

          {/* Right side - Image/Visual */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Restoran mutfağı"
              className="rounded-lg shadow-lg"
            />
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4">
              <div className="text-2xl font-bold text-[#00A690]">Ek Gelir</div>
              <div className="text-sm text-gray-600">Satılmayan ürünlerden</div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4">
              <div className="text-2xl font-bold text-[#00A690]">Yerel</div>
              <div className="text-sm text-gray-600">Restoran, fırın ve marketler</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForMerchantsSection;