import { useState } from 'react';
import { Shield, FileText, Lock } from 'lucide-react';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'mentions'>('terms');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#00A690] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Yasal Bildirim
          </h1>
          <p className="text-xl text-[#FFFFF0]">
            Kullanım koşulları, gizlilik politikası ve yasal bildirim
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'border-[#00A690] text-[#00A690]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Kullanım Koşulları</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-[#00A690] text-[#00A690]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Gizlilik Politikası</span>
            </button>
            <button
              onClick={() => setActiveTab('mentions')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'mentions'
                  ? 'border-[#00A690] text-[#00A690]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Yasal Bildirim</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'terms' && (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Genel Kullanım Koşulları</h2>
            <p className="text-sm text-gray-600 mb-8">Son güncelleme: Kasım 2024</p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Amaç</h3>
            <p className="text-gray-700 mb-4">
              Bu Genel Kullanım Koşulları (GKK), web sitesi ve mobil uygulama aracılığıyla erişilebilen
              KapKurtar platformunun kullanım şartlarını ve koşullarını tanımlamayı amaçlamaktadır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Koşulların Kabulü</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar platformunun kullanımı, bu GKK'nın tam ve eksiksiz kabulünü gerektirir.
              Bu koşulları kabul etmiyorsanız, lütfen hizmetimizi kullanmayın.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Hizmet Açıklaması</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar, satılmayan gıda ürünlerini indirimli fiyatlarla sunan işletmeleri tüketicilerle
              buluşturan dijital bir platformdur. Platform şunları sağlar:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>İşletmelerin satılmayan ürün tekliflerini yayınlaması</li>
              <li>Tüketicilerin bu ürünleri indirimli fiyatlarla rezerve edip satın alması</li>
              <li>Rezervasyonların yönetimi (ödeme, teslim alırken işletmede yapılır)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Kayıt ve Kullanıcı Hesabı</h3>
            <p className="text-gray-700 mb-4">
              <strong>4.1.</strong> KapKurtar'ı kullanmak için doğru ve güncel bilgiler vererek bir hesap oluşturmalısınız.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>4.2.</strong> Giriş bilgilerinizin gizliliğinden siz sorumlusunuz.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>4.3.</strong> Hesap oluşturmak için en az 18 yaşında olmalısınız.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Kullanıcı Yükümlülükleri</h3>
            <p className="text-gray-700 mb-4">
              <strong>Tüketiciler için:</strong>
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Rezerve edilen ürünleri teklifin teslim alma süresi bitmeden teslim almak</li>
              <li>Rezerve edilen ürünlerin ödemesini teslim alırken işletmede yapmak</li>
              <li>Rezervasyon sistemini kötüye kullanmamak</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>İşletmeler için:</strong>
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Yürürlükteki sağlık standartlarına uygun ürünler sunmak</li>
              <li>Belirtilen fiyatlara ve saatlere uymak</li>
              <li>Rezerve edilen siparişleri yerine getirmek</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. İşlemler ve Ödemeler</h3>
            <p className="text-gray-700 mb-4">
              <strong>6.1.</strong> Ödeme, ürün teslim alınırken doğrudan işletmede yapılır. Platform üzerinden online ödeme alınmaz.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>6.2.</strong> KapKurtar gerçekleştirilen her işlemden %15 komisyon alır.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>6.3.</strong> Ödeme işletmeye yapıldığından, iade ve geri ödeme talepleri ilgili işletme ile çözülür.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Sorumluluk</h3>
            <p className="text-gray-700 mb-4">
              <strong>7.1.</strong> KapKurtar, işletmeler ve tüketiciler arasında aracı olarak hareket eder.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>7.2.</strong> Ürünlerin kalitesi ve uygunluğu işletmelerin sorumluluğundadır.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>7.3.</strong> KapKurtar, bir işletme ile tüketici arasındaki anlaşmazlık durumunda sorumlu tutulamaz.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Fikri Mülkiyet</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar platformunun tüm unsurları (logo, marka, tasarım, içerik) fikri mülkiyet
              hakları ile korunmaktadır ve izinsiz kullanılamaz.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. GKK'nın Değiştirilmesi</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar, bu GKK'yı herhangi bir zamanda değiştirme hakkını saklı tutar. Kullanıcılar
              önemli değişikliklerden haberdar edilecektir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Uygulanacak Hukuk</h3>
            <p className="text-gray-700 mb-4">
              Bu GKK Türk hukukuna tabidir. Herhangi bir anlaşmazlık durumunda Türk mahkemeleri yetkilidir.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h2>
            <p className="text-sm text-gray-600 mb-8">Son güncelleme: Kasım 2024</p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Giriş</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar, kullanıcılarının gizliliğini korumayı taahhüt eder. Bu politika,
              kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Toplanan Veriler</h3>
            <p className="text-gray-700 mb-4">Aşağıdaki veri türlerini topluyoruz:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Kimlik verileri:</strong> Ad, soyad, e-posta, telefon numarası</li>
              <li><strong>Konum verileri:</strong> Adres, GPS konumu (izin verilirse)</li>
              <li><strong>Kullanım verileri:</strong> Sipariş geçmişi, tercihler</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Verilerin Kullanımı</h3>
            <p className="text-gray-700 mb-4">Verileriniz şunlar için kullanılır:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
              <li>Rezervasyonlarınızı işlemek</li>
              <li>Size ilgili bildirimler göndermek</li>
              <li>Deneyiminizi kişiselleştirmek</li>
              <li>Platformun güvenliğini sağlamak</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Verilerin Paylaşımı</h3>
            <p className="text-gray-700 mb-4">
              Kişisel verilerinizi asla satmayız. Verileriniz yalnızca şunlarla paylaşılabilir:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li>Siparişlerinizle ilgili işletmeler (ad, sipariş numarası)</li>
              <li>Hizmet sağlayıcılarımız (barındırma) sıkı gizlilik sözleşmesi altında</li>
              <li>Kanun gerektiriyorsa yasal makamlar</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Veri Güvenliği</h3>
            <p className="text-gray-700 mb-4">
              Verilerinizi yetkisiz erişim, değişiklik, ifşa veya yok etmeye karşı korumak için
              teknik ve organizasyonel güvenlik önlemleri uyguluyoruz.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Haklarınız</h3>
            <p className="text-gray-700 mb-4">KVKK (Kişisel Verilerin Korunması Kanunu) uyarınca aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Erişim hakkı:</strong> Kişisel verilerinizi görüntüleme</li>
              <li><strong>Düzeltme hakkı:</strong> Hatalı verilerinizi düzeltme</li>
              <li><strong>Silme hakkı:</strong> Hesabınızı ve verilerinizi silme</li>
              <li><strong>İtiraz hakkı:</strong> Belirli işlemleri reddetme</li>
              <li><strong>Taşınabilirlik hakkı:</strong> Verilerinizi alma</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Haklarınızı kullanmak için iletişim formumuzu kullanarak bize ulaşın.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Çerezler</h3>
            <p className="text-gray-700 mb-4">
              Deneyiminizi geliştirmek için çerezler kullanıyoruz. Çerez tercihlerinizi
              tarayıcınızın ayarlarından yönetebilirsiniz.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Verilerin Saklanması</h3>
            <p className="text-gray-700 mb-4">
              Verileriniz, toplandıkları amaçlar için gerekli olan süre boyunca saklanır,
              ardından yasal yükümlülüklere uygun olarak arşivlenir veya silinir.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. İletişim</h3>
            <p className="text-gray-700 mb-4">
              Bu gizlilik politikası hakkında sorularınız için iletişim formumuzu veya
              WhatsApp'ı kullanarak bize ulaşın.
            </p>
          </div>
        )}

        {activeTab === 'mentions' && (
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Yasal Bildirim</h2>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Platform Yayıncısı</h3>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-2"><strong>İsim:</strong> KapKurtar</p>
              <p className="text-gray-700 mb-2"><strong>Yasal statü:</strong> Kuruluş aşamasında</p>
              <p className="text-gray-700 mb-2"><strong>Adres:</strong> Eski Hisar, 9501. Sk. No:3, 07600 Manavgat/Antalya, Türkiye</p>
              <p className="text-gray-700 mb-2"><strong>İletişim:</strong> İletişim formu veya WhatsApp aracılığıyla</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Barındırma</h3>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-2"><strong>Hizmet:</strong> Supabase</p>
              <p className="text-gray-700 mb-2"><strong>Barındırma:</strong> Bulut altyapısı</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Fikri Mülkiyet</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar platformunun tüm içeriği (metinler, görseller, logolar, tasarım) fikri mülkiyet
              hakları ile korunmaktadır. Yetkisiz herhangi bir çoğaltma veya kullanım kesinlikle yasaktır.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sorumluluk</h3>
            <p className="text-gray-700 mb-4">
              KapKurtar, platformu erişilebilir ve işlevsel tutmak için çaba gösterir. Ancak, %100
              kullanılabilirlik garanti edemeyiz ve hizmetin geçici kesintisi durumunda hiçbir
              sorumluluk kabul etmeyiz.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Uygulanacak Hukuk ve Yetki</h3>
            <p className="text-gray-700 mb-4">
              Bu yasal bildirim Türk hukukuna tabidir. Herhangi bir anlaşmazlık durumunda,
              Antalya mahkemeleri münhasıran yetkilidir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalPage;