import { Calendar, User, ArrowLeft, ChefHat } from 'lucide-react';

const BlogArticle6 = () => {
  return (
    <div className="min-h-screen bg-kk-paper">
      <div className="bg-kk-night border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/blog" className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Bloga dön
          </a>
        </div>
      </div>

      <div className="bg-kk-night text-white pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="kk-chip bg-kk-lime text-kk-night px-4 py-2 text-sm font-semibold">
              Tarifler
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Bayat ekmek: Yeniden kullanmanın 5 yaratıcı yolu
          </h1>
          <div className="flex flex-wrap items-center text-kk-muted mb-8">
            <User className="w-5 h-5 mr-2" />
            <span className="mr-6">Şef Ayşe</span>
            <Calendar className="w-5 h-5 mr-2" />
            <span>20 Ekim 2024</span>
            <span className="mx-3">•</span>
            <span>5 dk okuma</span>
          </div>
          <img
            src="https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Dönüştürülmüş bayat ekmek"
            className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none kk-card p-6 md:p-10">
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Artık sert ekmeğinizi atmayın! Bayat ekmeği lezzetli ve ekonomik
            yemeklere dönüştürmek için 5 tarif keşfedin.
          </p>

          <blockquote className="border-l-4 border-kk-mint pl-6 my-8 italic text-gray-700">
            "Türkiye'de yılda ortalama 2,3 milyon ton gıda atıyoruz.
            Ekmek bu israfın önemli bir kısmını oluşturuyor. Oysa ona ikinci bir şans vermek için
            birkaç ipucu yeterli!"
          </blockquote>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-kk-mint-text" />
            1. Süper çıtır ev yapımı krutonlar
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Ev yapımı krutonlar marketten alınanlara göre 10 kat daha iyi ve hazırlanması çok basit!
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-6 my-6">
            <h3 className="font-bold text-gray-900 mb-3">Malzemeler:</h3>
            <ul className="space-y-1 text-gray-700 mb-4">
              <li>• Bayat ekmek (istediğiniz kadar)</li>
              <li>• 3 yemek kaşığı zeytinyağı</li>
              <li>• 1 diş sarımsak</li>
              <li>• Kekik</li>
              <li>• Tuz, karabiber</li>
            </ul>
            <h3 className="font-bold text-gray-900 mb-3">Hazırlanışı:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Ekmeği 2cm küpler halinde kesin</li>
              <li>2. Yağ, ezilmiş sarımsak ve kekiği karıştırın</li>
              <li>3. Ekmek küplerini yağ karışımıyla kaplayın</li>
              <li>4. 180°C'de yarı pişirme sırasında karıştırarak 15 dakika pişirin</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600 italic">
            💡 Salatalar, çorbalar için veya aperitifde atıştırmak için mükemmel!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-kk-mint-text" />
            2. Büyükanne usulü ekmek tatlısı
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Küçük büyük herkesi memnun edecek rahatlatıcı bir tatlı. Bu geleneksel Türk tatlısı (Ekmek Tatlısı)
            kuru ekmeği tatlı bir lezzete dönüştürür.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-6 my-6">
            <h3 className="font-bold text-gray-900 mb-3">Malzemeler (4 kişilik):</h3>
            <ul className="space-y-1 text-gray-700 mb-4">
              <li>• 300g bayat ekmek</li>
              <li>• 500ml süt</li>
              <li>• 3 yumurta</li>
              <li>• 100g şeker</li>
              <li>• 1 paket vanilya şekeri</li>
              <li>• Tarçın</li>
              <li>• Tereyağı</li>
            </ul>
            <h3 className="font-bold text-gray-900 mb-3">Hazırlanışı:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Ekmeği dilimler halinde kesin</li>
              <li>2. Sıcak şekerli süte hızlıca batırın</li>
              <li>3. Yağlanmış bir tepsiye dizin</li>
              <li>4. Yumurta + şeker + vanilyayı çırpın, ekmeğin üzerine dökün</li>
              <li>5. Tarçın serpin</li>
              <li>6. 170°C'de 35 dakika pişirin</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600 italic">
            🍯 İlık olarak vanilyalı dondurma veya krema ile servis yapın!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-kk-mint-text" />
            3. Ev yapımı galeta unu
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Ev yapımı galeta unu market unu galeta unundan daha ekonomik ve lezzetli.
            Hava geçirmez bir kavanozda birkaç ay saklanabilir.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-6 my-6">
            <h3 className="font-bold text-gray-900 mb-3">Çok basit yöntem:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Ekmeği 2-3 gün tamamen kurumaya bırakın</li>
              <li>2. İnce kırıntılar elde edene kadar robotta çekin</li>
              <li>3. Düzgün bir doku için elekten geçirin</li>
              <li>4. Hava geçirmez bir kavanozda saklayın</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600 italic">
            🍗 Et, balık, sebze panelemek veya yemeklerinizi gratinlemek için ideal!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-kk-mint-text" />
            4. Ekmekli köylü çorbası (Paçanga)
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Kış akşamları için mükemmel, kalın ve rahatlatıcı geleneksel bir Türk çorbası.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-6 my-6">
            <h3 className="font-bold text-gray-900 mb-3">Malzemeler (4 kişilik):</h3>
            <ul className="space-y-1 text-gray-700 mb-4">
              <li>• 200g bayat ekmek</li>
              <li>• 1L sebze veya tavuk suyu</li>
              <li>• 2 domates</li>
              <li>• 1 soğan</li>
              <li>• 2 diş sarımsak</li>
              <li>• Pul biber, kimyon</li>
              <li>• Zeytinyağı</li>
              <li>• Taze maydanoz</li>
            </ul>
            <h3 className="font-bold text-gray-900 mb-3">Hazırlanışı:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Soğan + sarımsağı zeytinyağında kavurun</li>
              <li>2. Doğranmış domates + baharatları ekleyin</li>
              <li>3. Suyu dökün, kaynatın</li>
              <li>4. Parçalar halinde ekmeği ekleyin</li>
              <li>5. Karıştırarak 20 dakika kaynatın</li>
              <li>6. Kremsi bir doku için kısmen karıştırın</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600 italic">
            🥖 Bir tutam zeytinyağı, doğranmış maydanoz ve kızarmış ekmekle servis edin!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4 flex items-center">
            <ChefHat className="w-6 h-6 mr-2 text-kk-mint-text" />
            5. Domatesli Türk bruschettası
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Aperitif veya garnitür için mükemmel, hızlı ve lezzetli bir Akdeniz mezesi.
          </p>
          <div className="bg-kk-lime/15 rounded-2xl p-6 my-6">
            <h3 className="font-bold text-gray-900 mb-3">Malzemeler (4 kişilik):</h3>
            <ul className="space-y-1 text-gray-700 mb-4">
              <li>• Dilimlenmiş bayat ekmek</li>
              <li>• 4 olgun domates</li>
              <li>• Beyaz peynir veya feta</li>
              <li>• Taze fesleğen</li>
              <li>• 1 diş sarımsak</li>
              <li>• Zeytinyağı</li>
              <li>• Balzamik sirke</li>
              <li>• Tuz, karabiber</li>
            </ul>
            <h3 className="font-bold text-gray-900 mb-3">Hazırlanışı:</h3>
            <ol className="space-y-2 text-gray-700">
              <li>1. Ekmek dilimlerini ızgara yapın (fırında veya tavada)</li>
              <li>2. Kesilmiş sarımsak dişiyle ovun</li>
              <li>3. Domatesleri küp şeklinde kesin</li>
              <li>4. Domates + ufalanmış peynir + doğranmış fesleğeni karıştırın</li>
              <li>5. Zeytinyağı, sirke, tuz, karabiber ile baharatlayın</li>
              <li>6. Kızarmış ekmek üzerine bolca yerleştirin</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600 italic">
            🍅 Ekmeğin çıtır kalması için hemen yiyin!
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-kk-night mt-12 mb-4">Saklama tavsiyesi</h2>
          <div className="bg-white border-2 border-kk-mint rounded-3xl p-6 my-8">
            <p className="text-gray-700 mb-4">
              <strong>Profesyonel ipucu:</strong> Bayat ekmeğinizi hemen kullanmayacaksanız,
              dilimler halinde dondurun. Birkaç ay sonra bile kruton veya galeta unu yapmak için mükemmel olacaktır!
            </p>
            <p className="text-gray-700">
              <strong>Hızlı yumuşatma:</strong> Çok sert ekmeği yumuşatmak için 30 saniye su altında tutun
              sonra 150°C'de fırında 5 dakika bekletin. Yumuşak dokusunu geri kazanacaktır!
            </p>
          </div>

          <div className="not-prose bg-kk-night text-white rounded-3xl p-8 my-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">Yakınınızda indirimli ekmek bulun</h3>
            <p className="text-white/70 mb-6">
              KapKurtar ile gün sonunda fırın ekmeğini indirimli fiyatlarla satın alın
            </p>
            <a
              href="/offers"
              className="kk-btn-primary px-8 py-3"
            >
              Teklifleri görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle6;
