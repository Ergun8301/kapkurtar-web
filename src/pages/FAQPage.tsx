import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      name: 'Müşteriler İçin',
      faqs: [
        {
          question: 'KapKurtar nasıl çalışır?',
          answer: 'KapKurtar, israfı önlemek için indirimli fiyatlarla ürün sunan yerel işletmelerle sizi buluşturur. Mevcut tekliflere göz atın, işletmenin seçtiği moda göre rezervasyon yapın veya doğrudan mağazaya gelin.'
        },
        {
          question: 'Rezervasyon yapmam mı gerekiyor yoksa doğrudan gelebilir miyim?',
          answer: 'Bu işletmeye bağlı! Bazı teklifler uygulama üzerinden rezervasyon gerektirir, diğerleri ise "ilk gelen, ilk alır" şeklinde çalışır. Mod her teklifte açıkça belirtilir.'
        },
        {
          question: 'Ürünler hala taze ve güvenli mi?',
          answer: 'Kesinlikle! Tüm ürünler taze ve gıda güvenliği standartlarına uygundur. Yalnızca sıkı protokollere sahip onaylanmış işletmelerle çalışıyoruz.'
        },
        {
          question: 'Ne kadar tasarruf edebilirim?',
          answer: 'İndirim oranını her işletme kendisi belirler; işletmeler genellikle %30 ile %70 arasında indirim uygular. Her teklifin indirimli fiyatı uygulamada görünür.'
        },
        {
          question: 'Arama yarıçapı nedir?',
          answer: 'Varsayılan olarak, KapKurtar çevrenizdeki 0 ile 30 km arasındaki teklifleri gösterir. Aramanızı genişletmek isterseniz bu mesafenin ötesindeki tekliflere de bakabilirsiniz.'
        },
        {
          question: 'Rezervasyonumu iptal edebilir miyim?',
          answer: 'Evet, rezervasyonunuzu teslim almadan önce uygulama üzerinden iptal edebilirsiniz. Ödeme ürünü teslim alırken işletmede yapıldığı için önceden herhangi bir ücret tahsil edilmez.'
        }
      ]
    },
    {
      name: 'İşletmeler İçin',
      faqs: [
        {
          question: 'KapKurtar ortağı nasıl olurum?',
          answer: 'İşletmeler, satıcı kayıt sürecimiz aracılığıyla kayıt olabilir. Her başvuruyu inceliyor ve kalite standartlarımızı karşılayan işletmelerle çalışıyoruz.'
        },
        {
          question: 'Hangi tür ürünleri sunabilirim?',
          answer: 'Her türlü taze gıda ürünü: hamur işleri, hazır yemekler, meyve ve sebzeler, süt ürünleri vb. Önemli olan kaliteli ve hala tüketilebilir olmalarıdır.'
        },
        {
          question: 'Fiyatlarımı nasıl belirlerim?',
          answer: 'İndirimli fiyatlarınızı özgürce belirlersiniz. İşletmeler genellikle %30 ile %70 arasında indirim uygular.'
        },
        {
          question: 'KapKurtar komisyon alıyor mu?',
          answer: 'Evet, KapKurtar platformu sürdürmek için gerçekleşen her satıştan %15 komisyon alır. Satış olmadığında herhangi bir ücret ödemezsiniz.'
        },
        {
          question: 'Satış modunu seçebilir miyim?',
          answer: 'Evet! Tekliflerinizin rezervasyon gerektirip gerektirmediğini veya "ilk gelen, ilk alır" şeklinde olup olmayacağını siz seçersiniz.'
        }
      ]
    },
    {
      name: 'KapKurtar Hakkında',
      faqs: [
        {
          question: 'KapKurtar nerede kullanılabilir?',
          answer: 'KapKurtar şu anda Antalya ve çevresinde kullanılabilir. Yakında hizmetlerimizi Türkiye\'nin diğer şehirlerine yaymayı planlıyoruz.'
        },
        {
          question: 'KapKurtar ücretsiz mi?',
          answer: 'Evet, uygulamanın indirilmesi ve kullanımı müşteriler için tamamen ücretsizdir. Yalnızca satın aldığınız ürünler için, ürünü teslim alırken işletmede ödeme yaparsınız.'
        },
        {
          question: 'Destek ekibiyle nasıl iletişime geçebilirim?',
          answer: 'Sitemizin İletişim sayfası üzerinden veya doğrudan uygulama içinden bize ulaşabilirsiniz. Ekibimiz 24 saat içinde yanıt verir.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const globalIndex = categoryIndex * 100 + faqIndex;
    setOpenFAQ(openFAQ === globalIndex ? null : globalIndex);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-kk-paper">
      {/* Hero Section */}
      <div className="bg-kk-night text-white py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Sıkça Sorulan <span className="text-kk-lime">Sorular</span>
          </h1>
          <p className="text-xl text-white/70 mb-8">
            KapKurtar hakkındaki sorularınızın yanıtlarını hızlıca bulun
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Bir soru arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="kk-input rounded-full pl-12 pr-4 py-4"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mb-6">
              {category.name}
            </h2>
            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const globalIndex = categoryIndex * 100 + faqIndex;
                return (
                  <div key={faqIndex} className="kk-card overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-black/[0.02] transition-colors duration-300"
                    >
                      <span className="font-display font-bold text-kk-night pr-4">{faq.question}</span>
                      {openFAQ === globalIndex ? (
                        <ChevronUp className="w-8 h-8 p-1.5 rounded-full bg-kk-lime text-kk-night flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-8 h-8 p-1.5 rounded-full bg-gray-100 text-kk-night flex-shrink-0" />
                      )}
                    </button>
                    {openFAQ === globalIndex && (
                      <div className="px-6 pb-5 border-t border-black/5">
                        <p className="text-gray-600 pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">"{searchTerm}" için hiçbir soru bulunamadı</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-kk-night text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Cevabınızı bulamadınız mı?
          </h3>
          <p className="text-white/70 mb-8">
            Ekibimiz size yardımcı olmak için burada
          </p>
          <a
            href="/contact"
            className="kk-btn-primary px-8 py-3"
          >
            Bize ulaşın
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;