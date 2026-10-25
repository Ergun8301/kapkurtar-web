import { Leaf, Store, Users, MapPin } from 'lucide-react';

const ImpactSection = () => {
  const stats = [
    {
      icon: Leaf,
      value: 'Daha az',
      unit: 'israf',
      label: 'Satılmayan gıdalar çöpe gitmek yerine yeni sahiplerini bulur'
    },
    {
      icon: Store,
      value: 'Yerel',
      unit: 'işletmeler',
      label: 'Mahallenizdeki restoran, fırın ve marketlerle birlikte'
    },
    {
      icon: Users,
      value: 'Herkes',
      unit: 'için',
      label: 'Kaliteli gıdaya indirimli fiyatlarla erişim'
    },
    {
      icon: MapPin,
      value: 'Antalya',
      unit: 'bölgesi',
      label: 'Şu anda hizmet verdiğimiz bölge, yeni şehirler yakında'
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/images/logo-round.webp"
          alt=""
          className="w-[500px] h-[500px] opacity-[0.03] grayscale select-none"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Etkimiz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Birlikte daha sürdürülebilir bir gelecek yaratıyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFFFF0] rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-[#00A690]" />
              </div>
              <div className="text-4xl font-bold text-[#00A690] mb-1">
                {stat.value}
              </div>
              {stat.unit && (
                <div className="text-lg font-semibold text-[#F75C00] mb-2">
                  {stat.unit}
                </div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactSection;
