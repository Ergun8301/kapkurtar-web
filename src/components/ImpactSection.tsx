import { Leaf, Store, Users, MapPin } from 'lucide-react';
import { LogoMark } from './brand/Logo';

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
    <div className="relative py-20 overflow-hidden">
      {/* Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <LogoMark size={500} className="opacity-[0.04] grayscale select-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-kk-night mb-4">
            Etkimiz
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Birlikte daha sürdürülebilir bir gelecek yaratıyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="kk-card p-8 text-center transition-transform duration-300 hover:-translate-y-1 kk-fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-kk-mint rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-kk-night" />
              </div>
              <div className="text-4xl font-display font-extrabold tracking-tight text-kk-night mb-1">
                {stat.value}
              </div>
              {stat.unit && (
                <div className="text-lg font-semibold text-kk-mint-text mb-2">
                  {stat.unit}
                </div>
              )}
              <p className="text-gray-700 text-sm leading-relaxed">
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
