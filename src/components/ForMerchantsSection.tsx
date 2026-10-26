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
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-kk-night mb-6">
              İşletmeler İçin: İsrafı Gelire Dönüştürün
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              İlerici düşünen restoranlar ağımıza katılın. Gıda israfını azaltın,
              yeni müşteriler çekin ve KapKurtar ile kârınızı artırın.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="kk-card p-5 flex items-start space-x-4">
                  <div className="bg-kk-lime p-3 rounded-2xl">
                    <benefit.icon className="w-6 h-6 text-kk-night" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-kk-night mb-1">{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/for-merchants"
                className="kk-btn-primary px-8 py-3"
              >
                Ortak Olun
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/for-merchants"
                className="kk-btn-ghost px-8 py-3"
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
              className="rounded-3xl shadow-xl w-full object-cover"
            />
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-kk-night text-white rounded-2xl shadow-xl p-4">
              <div className="text-2xl font-display font-extrabold text-kk-lime">Ek Gelir</div>
              <div className="text-sm text-white/70">Satılmayan ürünlerden</div>
            </div>

            <div className="absolute -top-6 -right-2 sm:-right-6 kk-card p-4">
              <div className="text-2xl font-display font-extrabold text-kk-night">Yerel</div>
              <div className="text-sm text-gray-700">Restoran, fırın ve marketler</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForMerchantsSection;