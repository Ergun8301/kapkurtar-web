# DESIGN_BRIEF — KapKurtar

Un état des lieux factuel de l'interface actuelle, établi à partir du code au 25/10/2026. Il ne contient **aucune proposition de design**.

Sources lues :
- `kapkurtar-web` (site kapkurtar.com, déployé sur Vercel via `vercel.json`)
- `kapkurtar-mobile-native` (même base React + Capacitor 7, app Android `com.kapkurtar.app`)

Les textes affichés sont cités tels quels, en turc ou dans la langue où ils apparaissent. Abréviations : **WEB** = kapkurtar-web, **MOB** = kapkurtar-mobile-native.

---

## 1. Routes et écrans par rôle

### 1.1 Visiteur (non connecté)

| Route | Écran | Remarque |
|---|---|---|
| `/` | HomePage | Sur MOB natif, c'est **UserTypeSelectionPage** à la place |
| `/offers` | OffersPage (carte + liste) | Accessible sans compte |
| `/for-merchants` | ForMerchantsPage | |
| `/download` | DownloadPage | Textes en anglais |
| `/about` | AboutPage | |
| `/faq` | FAQPage | |
| `/blog` | BlogPage | |
| `/blog/4` à `/blog/10` | BlogArticle4…10 | |
| `/contact` | ContactPage | |
| `/legal` | LegalPage (3 onglets) | |
| `/istanbul`, `/ankara`, `/izmir`, `/antalya`, `/bursa` | CityPage (SEO) | |
| `/customer/auth` | CustomerAuthPage | |
| `/merchant/auth` | MerchantAuthPage | |
| `/forgot-password` | ForgotPasswordPage (client) | |
| `/merchant/forgot-password` | MerchantForgotPasswordPage | Entièrement en français |
| `/reset-password` | ResetPasswordPage | |
| `/auth/callback` | AuthCallbackPage | Textes en français |
| `/customer/teaser` | Redirige vers `/offers` | |
| `*` | NotFoundPage (404) | |

### 1.2 Client

| Route | Écran | Remarque |
|---|---|---|
| `/offers` | OffersPage | Après connexion, `/` redirige ici |
| `/customer/dashboard` | ClientDashboardPage « Rezervasyonlarım » | |
| `/client/profile` | ClientProfilePage | WEB en français |
| `/favorites` | FavoritesPage | Orpheline (aucun lien n'y mène) |
| `/reviews` | ReviewsPage | Orpheline, en français |
| `/profile/complete` | ProfileCompletePage | Héritée, en anglais, marque « TILKAPP » |

Modals côté client :
- ProfileCompletionModal
- MerchantBottomSheet
- OfferDetailsModal
- QuantityModal
- Modal de connexion requise
- Modal de confirmation d'annulation

### 1.3 Entreprise (marchand)

| Route | Écran |
|---|---|
| `/merchant/auth` | MerchantAuthPage |
| `/merchant/forgot-password` | MerchantForgotPasswordPage |
| `/merchant/dashboard` | MerchantDashboardPage (page unique, sans onglets) |

Modals côté marchand :
- Onboarding / « Ayarlar »
- OfferForm (création et édition)
- Historique « Rezervasyon Geçmişi »
- ReservationDetailsModal (ouvert depuis la cloche)
- `confirm()` natif pour la suppression

### 1.4 Règles de redirection (`App.tsx` › SessionRedirect)

**WEB**
- Marchand : `/` mène à `/merchant/dashboard`. Les pages client renvoient vers le dashboard.
- Client avec profil complet : `/` mène à `/offers`. `/merchant/dashboard` renvoie vers `/offers`.
- Client avec profil incomplet : aucune redirection.

**MOB**
- Toute route hors d'une liste courte renvoie le marchand vers `/merchant/dashboard` et le client complet vers `/offers`.
- Conséquence : `/favorites`, `/reviews`, `/faq`, `/legal`, `/contact`, `/about` et `/download` sont inaccessibles une fois connecté.

---

## 2. Détail des écrans

### 2.1 Pages publiques

#### HomePage (`/`, web uniquement)

**But :** présenter le service et pousser au téléchargement de l'app.

**Sections, dans l'ordre :**
1. **HeroBanner** : carrousel de 5 photos Pexels, accroche « İsrafı Önle ».
2. **HowItWorks** « Nasıl Çalışır » en 3 étapes :
   - « Teklifleri Keşfet »
   - « Yemeğinizi Rezerve Edin » : « …Platformumuz üzerinden güvenli ödeme yapın. »
   - « Alın ve Tadını Çıkarın » : « Seçtiğiniz saatte restorana gidin… »
3. **FeaturedOffers** « Öne Çıkan Teklifler » (voir 2.2).
4. **ImpactSection** : stats en dur « 25 » kurtarılan gıda, « 150+ » ortak işletme, « 8000+ » aktif kullanıcı, « 5 » (« 2025'te kapsanan »).
5. **Bloc CTA** « KAPKURTAR Uygulamasını İndirin » / « Gerçek zamanlı bildirimler alın… », bouton « Şimdi İndir », qui ouvre DownloadAppModal.
6. **ForMerchantsSection** : « Geliri Artırın », « Yeni Müşteriler Kazanın », « İsrafı Azaltın », stats « 25% » Ortalama Gelir Artışı et « 500+ » Ortak Restoran.

**États :** les données dynamiques ne concernent que FeaturedOffers.

#### DownloadAppModal (header, home)

- **Contenu :**
  - Titre « KapKurtar'ı İndirin », sous-titre « Yakınınızdaki gıdayı kurtarın ».
  - QR placeholder gris « QR Kod / Yakında ».
  - Boutons désactivés « iPhone İçin » et « Android İçin ».
  - Texte « iOS ve Android'de yakında kullanılabilir ».
  - Formulaire email (Formspree) « Uygulama yayınlandığında bilgilendirilme », placeholder « email@ornek.com », bouton « Beni Bilgilendir ».
- **États :**
  - Envoi : « Gönderiliyor... »
  - Succès : « ✓ Teşekkürler! » pendant 3 s
  - Erreur : `alert('Erreur lors de l'envoi. Réessayez.')`, en français
- **Mention :** aucun lien Google Play.

#### DownloadPage (`/download`), en anglais

- « Download the KapKurtar App », « Scan to download ».
- Badges App Store et Google Play avec `href="#"`.
- Stats « 4.8★ App Rating », « 50K+ Downloads », « 1M+ Meals Saved ».
- « Why Download the App? » : « Real-time Notifications », « Location-based Offers », « Exclusive App Deals ».
- « 📱 Activate Notifications ».

#### ForMerchantsPage (`/for-merchants`)

- **Hero (MerchantsHero) :** « Satılmayan gıdalarınızı atmak yerine KapKurtar ile satın. », stats « 500+ Ortak İşletme », « 10K+ Kurtarılan Paket », « İlk 3 Ay ». Cartes « Risk Sıfır », « Hızlı Başlangıç », « Gelir Artışı ».
- **« Nasıl Çalışıyor? »**, « 4 basit adımda gelir elde edin » :
  - « Kayıt Olun »
  - « Teklif Yayınlayın »
  - « Müşteri Rezerve Eder » : « Online ödeme alırsınız »
  - « Para Kazanın » : « %80 kazanç otomatik »
- **Section « Dur Gıda İsrafına »** : exemples « Küçük Fırın », « Orta Boy Restoran », « Süpermarket ».
- **Tarifs (PricingSection3Plans) :** « İLK 3 AY TAMAMEN ÜCRETSİZ », « Abonelik Modeli », « Komisyon Modeli » (« Sadece sattığınızda ödeme (%20) »).
- **Témoignages « Bize Güvenenler »** : avatars Pexels, « KapKurtar kayıplarımı %70 azaltmamı sağladı… ».
- **Bloc app :** « Yakında Google Play ve App Store'da! », boutons désactivés « Google Play'de Yakında » et « App Store'da Yakında ».
- **« Sorularınız mı var? »** : lien vers `/contact`.
- **CTA :** vers `/merchant/auth`.

#### AboutPage (`/about`)

- Sections : « Misyonumuz », « İsraf Karşıtı / Yerel Dayanışma / Erişilebilirlik », « Hikayemiz », « Etkimiz Rakamlarla » (« 150+ », « 8 000+ », « 25 ton »), « Tutkulu Bir Ekip », « Hizmet Bölgelerimiz » (« 📍 Şu anda », « 🚀 Yakında (2025) »), « Harekete Katılın ».
- Texte « Lansmanımızdan bu yana, 25 tondan fazla gıdayı kurtarmayı başardık ».

#### FAQPage (`/faq`)

- Recherche « Bir soru arayın... ».
- Catégories « Müşteriler İçin », « İşletmeler İçin », « KapKurtar Hakkında ».
- Questions en accordéon.
- Lien vers `/contact`.

#### ContactPage (`/contact`)

- Cartes « WhatsApp » (wa.me/33685507985, texte « Merhaba TILKAPP… »), « E-posta », « Adres ».
- Formulaire Formspree : placeholders « Adınız », « eposta@ornek.com », « Mesajınız... ».
- Succès : « Mesaj gönderildi! ».

#### CityPage (`/istanbul` etc.)

- Texte SEO « %70'e varan indirimli yemek fırsatları ».
- Cartes « Restoranlar », « Fırınlar », « Marketler ».
- Boutons vers `/offers` et `/download`.

#### BlogPage et articles

- Recherche « Makale ara... ».
- 10 cartes, certains titres mentionnent « TILKAPP ».
- 7 pages d'article.

#### LegalPage (`/legal`)

- 3 onglets : « Genel Kullanım Koşulları », « Gizlilik Politikası », « Yasal Bildirim ».
- Article 6.2 : « %15 komisyon ».

#### NotFoundPage

- « 404 » avec un lien de retour.

### 2.2 Client

#### UserTypeSelectionPage (MOB natif, `/`)

- **Contenu :**
  - Logo texte « KAP » (orange) + « KURTAR » (crème)
  - « Hoş Geldiniz! » / « Gıda israfını birlikte önleyelim »
  - Rangée d'emojis « 🍎 🍕 🥕 🥬 🍞 »
  - Carte « Müşteriyim / Fırsatları keşfet ve tasarruf et », vers `/customer/auth`
  - Carte « İşletmeyim / Ürünlerini sat, israfı önle », vers `/merchant/auth`
- **Header et BottomNav :** masqués.
- **États :** aucun.

#### CustomerAuthPage (`/customer/auth`)

- **But :** connexion et inscription client par email ou Google.
- **Éléments :**
  - « Geri »
  - Logo carré « S » (WEB uniquement)
  - Titre « Hoş Geldiniz » ou « SEPET'e Katılın » (MOB : « Hesap Oluştur »)
  - Sous-titre « Yakınınızdaki tekliflere erişin » / « Gıdayı kurtarın, tasarruf edin »
  - Onglets « Giriş | Kayıt »
  - Champs « E-posta » (« email@ornek.com ») et « Şifre » (min. 6, avec un œil pour afficher)
  - « Şifremi unuttum? »
  - Bouton « Giriş Yap » / « Hesap Oluştur »
  - Séparateur « Veya şununla devam edin » (MOB : « veya »)
  - Bouton « Google »
- **États :**
  - Chargement : spinner plein écran, puis « Yükleniyor... » sur le bouton
  - Erreur : message Supabase brut (en anglais) ou « Şifre en az 6 karakter içermelidir »
  - Succès : redirection, ou ProfileCompletionModal

#### ProfileCompletionModal (bloquant, s'ouvre si le prénom ou le nom manque)

- **WEB, en français :**
  - « Bienvenue ! 🎉 », « Complétez votre profil… »
  - « Photo de profil (optionnelle) »
  - « Prénom * » (« Ex: Jean »), « Nom * » (« Ex: Dupont »)
  - « Téléphone (optionnel) » (« Ex: 06 12 34 56 78 »)
  - Bouton « Valider et continuer »
- **MOB, en turc :**
  - « Hoş geldiniz! 🎉 »
  - « Ad * », « Soyad * », « Telefon (isteğe bağlı) »
  - Bouton « Onayla ve devam et »
- **États :**
  - « Enregistrement... » / « Kaydediliyor... »
  - Erreurs : « Prénom et nom sont obligatoires » / « Ad ve soyad zorunludur », « Photo trop volumineuse (max. 5 Mo) »
  - Succès : redirection vers `/offers`
- **Fermeture :** impossible, pas de bouton « passer ».

#### OffersPage (`/offers`)

- **But :** trouver des offres sur une carte Mapbox.
- **Desktop :**
  - Carte à gauche, liste à droite (`md:w-1/2`).
  - Bascule « 📍 Yakındaki Teklifler » / « 🌍 Tüm Teklifler » (par défaut : Tüm, rayon de 2 000 km centré sur la Turquie).
  - Slider de rayon de 1 à 30 km.
- **Mobile (web et app) :**
  - La carte occupe `h-1/2`, la liste est `hidden md:block`, donc **la moitié basse reste vide**.
  - MOB ajoute en bas de la carte : champ « Adres ara... (örn: Kadıköy, İstanbul) » + bouton « Ara », bascule « Yakında » / « Tümü », slider « Yarıçap: » de 1 à 50 km.
- **Contrôles carte (WEB) :**
  - GeolocateControl.
  - Geocoder en **français** : « Rechercher une adresse ou un lieu... », `language:"fr"`.
- **Marqueurs :** logo du marchand, sinon favicon KapKurtar, sinon 🏪. Un clic ouvre MerchantBottomSheet.
- **Carte d'offre :**
  - Image, titre, « {prix}₺ », prix barré, « -x% »
  - Minuteur « ⏰ {h}s {m}dk »
  - Barre de stock (rouge / ambre / vert)
  - Logo et nom du marchand, « 📍 ville », « x.x km »
- **États :**
  - Chargement : **aucun indicateur** (le texte vide s'affiche pendant le chargement).
  - Vide : « Bu yarıçapta teklif bulunmuyor. Mesafeyi artırmayı deneyin! » / « Şu anda teklif bulunmuyor. »
  - Erreur : seulement en console. Pour la géoloc, le toast « Bu özellikleri kullanmak için uygulamayı indirin ».
  - Carte invalide : « Chargement de la carte... » (français).
  - Offre expirée via lien : « Maalesef bu fırsat kaçtı! 😢 Bir dahaki sefere daha hızlı olun! »
  - MOB : `alert()` « Adres bulunamadı… (Address not found…) », « Lütfen GPS'i açın ».

#### MerchantBottomSheet (clic sur un marqueur)

- **Format :** sheet en bas sur mobile (poignée, swipe pour fermer), panneau de 500 px à droite sur desktop.
- **Contenu :**
  - Logo, nom
  - 5 étoiles grises + « Yakında kullanılabilir »
  - Adresse, téléphone, bouton « Yol Tarifi »
  - « {n} teklif mevcut », puis cartes d'offre avec « Stok: {q} »
- **Action :** un clic sur une carte ouvre OfferDetailsModal.

#### OfferDetailsModal

- **Contenu :**
  - En-tête marchand avec étoiles « Yakında kullanılabilir » et « Yol Tarifi » (icône seule sur téléphone)
  - Image, « -x% », cœur désactivé
  - Titre, description, prix
  - « {temps} kalan », « Stok: {q} »
  - « Miktar » avec − / + et « {q} adet mevcut »
  - CTA « 🛒 Şimdi Rezerve Et »
  - « Diğer mevcut ürünler »
- **Non connecté :** modal « 🔒 Giriş gerekli », « Giriş yapın: » avec :
  - ✓ « Teklifleri rezerve edin »
  - ✓ « Bildirimler alın »
  - ✓ « Rezervasyonlarınızı takip edin »
  - Boutons « Giriş Yap » / « Daha Sonra »
  - « 💼 İşletme sahibi misiniz? SEPET'e ücretsiz katılın »
- **États :**
  - Chargement : « Rezervasyon yapılıyor... », « Diğer ürünler yükleniyor... »
  - Succès : « ✅ Rezervasyon onaylandı! », puis fermeture après 1,5 s
  - Erreur : « ❌ Müşteri profili bulunamadı », « ❌ Rezervasyon sırasında hata oluştu »
  - Rupture : « Stokta yok », mais non affiché quand le stock vaut exactement 0

#### QuantityModal (home, FeaturedOffers)

- « Teklifi Rezerve Et », « Miktar Seçin », « Birim fiyat: », « Toplam: »
- Boutons « İptal » / « Rezervasyonu Onayla », chargement « Rezerve ediliyor... »

#### FeaturedOffers (section de la home)

- **Contenu :** « Öne Çıkan Teklifler » + sous-titre, 6 squelettes pendant le chargement.
- **Carte :** note 4.5 en dur, cœur sans action, badge « Tam adresi görmek için giriş yapın », prix « ₺{x} » (MOB : « ${x} »).
- **Boutons :** « Şimdi Rezerve Et », « Tükendi », « Rezerve Etmek İçin Giriş Yapın » (mène à `/offers`).
- **Vide :**
  - Connecté : « Bölgenizde teklif bulunmuyor / Konumunuzun 50km yarıçapında… »
  - Non connecté : « Henüz teklif yok. Yakında tekrar kontrol edin! »
- **Succès affiché :** « Rezervasyon başarıyla oluşturuldu! ». La fonction appelée est un **stub** qui ne crée rien.

#### ClientDashboardPage (`/customer/dashboard`)

- **Contenu :**
  - Carte « Hesabım » + email
  - « Rezervasyonlarım ({total}) »
  - Groupes « Beklemede », « Teslim Alındı », « İptal Edildi », « Süresi Doldu »
- **Carte de réservation :**
  - Image, titre, total ₺, quantité, date, temps restant
  - Marchand
  - Si en attente : « Yol Tarifi », « Ara », « İptal Et » (mobile : « Yol », « Ara », « İptal »)
  - Sinon : « Arşivle »
- **Modal d'annulation :** « Rezervasyonu İptal Et? » / « Stok serbest bırakılacak… », boutons « Hayır, Tut » / « Evet, İptal Et ».
- **États :**
  - Chargement : « Yükleniyor... »
  - Vide : « Rezervasyon Yok / Henüz hiçbir teklif rezerve etmediniz » + « Teklifleri Keşfet »
  - Erreur : « ❌ Rezervasyonlar yüklenirken hata oluştu »
  - Succès : « ✅ Rezervasyon iptal edildi, stok serbest bırakıldı », « ✅ Rezervasyon arşivlendi »

#### ClientProfilePage (`/client/profile`)

- **WEB, en français :** « Retour aux offres », « Mon Profil », « Prénom * », « Nom * », « Téléphone (optionnel) », « Annuler » / « Enregistrer ».
- **MOB, en turc :** « Tekliflere Dön », « Profilim », « Ad * », « Soyad * », « İptal » / « Kaydet ».
- **États :**
  - Toasts : « ✅ Profil mis à jour » / « Profil güncellendi », « Erreur mise à jour » / « Güncelleme hatası »
  - La photo est enregistrée immédiatement.

#### FavoritesPage (`/favorites`)

- **WEB :** « Mes Favoris », « Chargement de vos favoris... », vide « Vous n'avez encore aucun favori. ».
- **MOB :** « Favorilerim », « Henüz favoriniz yok. ».
- **Liens :** `/offers/map` et `/merchant/{id}`, qui mènent à une 404.

#### ReviewsPage (`/reviews`), en français

- « Mes avis », « Laisser un avis », champ « ID du commerçant (temporaire) », étoiles, « Envoyer l'avis ».
- Retours par `alert()`.
- Vide : « Aucun avis pour le moment. »

#### ForgotPasswordPage, ResetPasswordPage, AuthCallbackPage

- **Forgot :**
  - « Şifremi unuttum? », « E-posta Adresi », bouton « Sıfırlama Bağlantısını Gönder »
  - Succès : « E-posta Gönderildi! »
  - « E-postayı almadınız mı? Tekrar Dene » visible dès le départ
- **Reset :**
  - « Yeni Şifre », « Şifreyi Onayla », bouton « Şifreyi Sıfırla »
  - Erreur : « Şifreler eşleşmiyor »
  - Succès : « Şifre Güncellendi! / Yönlendiriliyor... »
  - Lien expiré : redirection silencieuse vers `/`
  - Couleurs grises
- **Callback (français) :**
  - « Finalisation de la connexion... », « Redirection en cours... »
  - Erreur : « Erreur de connexion » + « Retour à l'accueil »

### 2.3 Entreprise (marchand)

#### MerchantAuthPage (`/merchant/auth`)

- **Éléments :**
  - « Geri »
  - Titre « İşletme Alanı » / « Ortak Olun » (MOB : « İşletme Girişi » / « İşletme Kaydı »)
  - Sous-titre « Tekliflerinizi yönetin ve israfı azaltın » / « SEPET'e katılın ve satılmayan ürünlerinizi değerlendirin »
  - Onglets « Giriş | Kayıt »
  - Champs « E-posta » (« isletme@ornek.com ») et « Şifre »
  - « Şifremi unuttum? »
  - Bouton « Giriş Yap » / « Hesap Oluştur »
  - « Google »
- **États :**
  - Chargement : spinner orange, puis « Yükleniyor... »
  - Erreur : message brut, ou « Flow state oluşturulamadı »
  - Succès : redirection vers `/merchant/dashboard`

#### MerchantForgotPasswordPage, entièrement en français

- « Mot de passe oublié ? », « Adresse email » (« commerce@example.com »), bouton « Envoyer le lien de réinitialisation ».
- Succès : « Email envoyé ! ».
- Lien « Retour à la connexion ».

#### MerchantDashboardPage (`/merchant/dashboard`)

Page unique sans onglets ni statistiques.

- **Global :**
  - Spinner plein écran au chargement. Il tourne **à l'infini** si la ligne `merchants` est absente.
  - Toasts en haut à droite pendant 3 s.
  - Actualisation par realtime et polling de 60 s.
- **Section « 📦 Son Rezervasyonlar »** :
  - Affichée **seulement s'il existe au moins une réservation en attente**.
  - En-tête repliable « {n} devam ediyor », bouton « Geçmiş ».
  - Jusqu'à 8 cartes, puis « Tümünü Göster ({n}) → ».
- **Carte réservation :**
  - Badge : WEB en français « 🟠 En attente / 🟢 Récupérée / ⚫ Expirée / 📦 Archivée » ; MOB en turc « Beklemede / Teslim edildi / Süresi doldu / Arşivlendi »
  - « 👤 nom », « 📞 tél. », « 💰 total₺ », « ⏰ temps restant »
  - Bouton « Onayla » pour marquer retiré (sans code, QR ni confirmation)
  - Bouton « Arşivle »
- **Modal « Rezervasyon Geçmişi »** :
  - Sous-titre « Tüm geçmiş rezervasyonlarınız »
  - Vide : « Geçmişte rezervasyon yok »
- **Section « Ürünlerim »** :
  - « Toplam {n} ürün », bouton « Ürün Ekle »
  - « ✅ Aktif Teklifler », vide : « Henüz aktif teklif yok » + « İlk Teklifinizi Oluşturun »
  - « ⏸️ Pasif Teklifler »
- **Carte offre :**
  - Badge « ⏸️ Duraklatıldı / ✅ Aktif / ⏰ Süresi Doldu »
  - Prix, « -{n}% off » (anglais), « Stok: {n} »
  - Actions « Duraklat » / « Etkinleştir », « Düzenle », « Sil »
  - « Sil » déclenche `confirm('Bu teklifi gizlemek istediğinizden emin misiniz?')`
- **Toasts :**
  - « ✅ Rezervasyon onaylandı », « ✅ Rezervasyon arşivlendi »
  - « ✅ Teklif duraklatıldı / etkinleştirildi », « 🗑️ Teklif gizlendi »
  - Erreurs « ❌ … sırasında hata oluştu »

#### Modal Onboarding / « Ayarlar »

- **Titre :** « İşletme Profilinizi Tamamlayın » / « Teklif yayınlamak için kaydınızı tamamlayın ».
- **Ouverture :** forcée et non fermable tant que le nom, le téléphone ou le logo manque.
- **Champs :**
  - « İşletme Adı * » (« Örn: Ahmet'in Fırını »)
  - « Telefon * » (« Örn: 0532 123 45 67 »)
  - « 📍 Haritada konumunuzu belirleyin » : carte avec recherche « Adres ara... » et bouton géoloc « Me géolocaliser »
  - « Konum: lat, lng »
  - « İşletme Logosu * »
- **Boutons :** « Kaydet » (+ « İptal » en mode Ayarlar), chargement « Kaydediliyor... ».
- **Toasts géoloc (français) :** « 📍 Détection en cours... », « ✅ Position détectée (précision: {n}m) ».
- **Succès :** « ✅ Profil başarıyla tamamlandı ».

#### OfferForm (création et édition)

- **Titre :** « Yeni Ürün Ekle » / « Ürünü Düzenle ».
- **Champs :**
  - « Ürün Adı » (« Örn: Taze Kruvasan Kutusu »)
  - « Açıklama »
  - « 📸 Ürün Fotoğrafı » : boutons « Fotoğraf Çek » / « Galeriden Seç » (WEB desktop : « Fotoğraf çek veya görsel seç »)
  - « Orijinal Fiyat (₺) », « İndirimli Fiyat (₺) », badge « -%{n} indirim »
  - « Mevcut Miktar »
  - « Başlangıç: Şimdi » (MOB : « Şimdi Başla »)
  - Dates de début et de fin
  - « Süre » : 30 dakika, 1 saat, 2 saat, 4 saat, Tüm gün (bugün), Özel
- **Bouton :** « Ürünü Yayınla » / « Ürünü Güncelle », chargement « Yayınlanıyor... » / « Güncelleniyor... ».
- **Validation :**
  - Bouton désactivé tant qu'un champ manque.
  - Aucun message inline.
  - Seule règle métier : « İndirimli fiyat orijinal fiyattan düşük olmalıdır ».
- **Image :**
  - « Görsel çok büyük (maks. 5 MB)… »
  - « Desteklenmeyen format… »
  - Erreurs d'upload en français
- **Succès :** « ✅ Teklif başarıyla eklendi », « ✅ Teklif güncellendi ve yeniden etkinleştirildi! ».

#### ReservationDetailsModal (marchand, depuis la cloche)

- **WEB, en français :** « Détails de la réservation », « Nouvelle commande client », prix en **€**, « 💡 Le client viendra récupérer sa commande… », « Fermer ».
- **MOB, en turc :** « Rezervasyon detayları », « Yeni müşteri siparişi », prix en ₺, « Kapat ».
- **États :**
  - Chargement : « Chargement des détails... » / « Detaylar yükleniyor... »
  - Erreurs : « Réservation introuvable ou supprimée » / « Rezervasyon bulunamadı veya silindi »
- **Actions :** aucune, à part fermer.

---

## 3. Parcours complets

### 3.1 Inscription client

1. Point d'entrée :
   - WEB : header « Giriş Yap » › « Müşteri Girişi ».
   - MOB : « Müşteriyim », ou BottomNav « Giriş ».
2. `/customer/auth` › onglet « Kayıt » › email + mot de passe › « Hesap Oluştur ».
3. `signUp`, avec le rôle `client` en métadonnée. Pas de confirmation email.
4. RPC `ensure_profile_exists` puis `get_user_role`.
5. Si le prénom ou le nom manque, ProfileCompletionModal s'ouvre, puis l'utilisateur arrive sur `/offers`.

**Variante Google :**
- WEB : OAuth vers `https://kapkurtar.com/auth/callback?role=client`, puis AuthCallbackPage, puis le profil.
- MOB natif : plugin `@codetrix-studio/capacitor-google-auth` › `signInWithIdToken` › `profiles.upsert(role:'client')`.

### 3.2 Inscription entreprise

1. Point d'entrée :
   - WEB : « İşletme Girişi », ou CTA sur `/for-merchants`.
   - MOB : « İşletmeyim ».
2. `/merchant/auth` › « Kayıt » › email + mot de passe. Une ligne `flow_states {desired_role:'merchant'}` est créée, puis `signUp`.
3. Redirection vers `/merchant/dashboard`.
4. Modal d'onboarding forcé : nom, téléphone, position sur la carte, logo › « Kaydet ».
5. Les champs adresse ne sont pas demandés. Le code écrit `street:'GPS Konumu'`, `city:'Belirtilmemiş'`, `postal_code:'00000'`.

**Variante Google :** WEB via le callback avec `role=merchant&flow_token`. MOB par upsert `role:'merchant'`.

### 3.3 Création d'une offre

1. Point d'entrée : bouton « Ürün Ekle » ou « İlk Teklifinizi Oluşturun » (MOB : BottomNav « Teklif Ekle »).
2. OfferForm : titre, description, photo (optionnelle), prix, quantité, durée.
3. « Ürünü Yayınla » › upload de la photo dans le bucket `product-images` › `offers.insert` (position du marchand recopiée).
4. Toast « ✅ Teklif başarıyla eklendi ». L'offre apparaît dans « Aktif Teklifler ».

### 3.4 Réservation

1. `/offers` › marqueur › MerchantBottomSheet › offre › OfferDetailsModal.
2. « Miktar » › « 🛒 Şimdi Rezerve Et ».
   - Non connecté : modal « Giriş gerekli ».
3. RPC `create_reservation_dynamic`.
4. Toast « ✅ Rezervasyon onaylandı! ». Pas d'écran de confirmation, de code, de QR, de créneau ni de paiement.
5. Côté marchand : notification « New Reservation », et la réservation apparaît dans « Son Rezervasyonlar ».

**Variante home (FeaturedOffers) :** QuantityModal › « Rezervasyonu Onayla » › stub. Le toast annonce un succès, mais aucune réservation n'est créée.

### 3.5 Retrait

1. Le client consulte `/customer/dashboard`, carte « Beklemede », avec « Yol Tarifi » et « Ara ».
2. Sur place, le marchand appuie sur « Onayla » : `reservations.status = 'completed'`. Aucun contrôle d'identité ni de code.
3. Côté client, la carte passe dans « Teslim Alındı » en temps réel.
4. Annulation client : « İptal Et » › « Evet, İptal Et » › RPC `cancel_reservation`.
5. Expiration : gérée côté serveur (`expired`).

### 3.6 Notifications

1. **Push (MOB) :**
   - À la connexion, `initPushNotifications()` lance la vérification des permissions puis la boîte de dialogue système Android 13+. Aucun écran explicatif avant.
   - Le token est enregistré dans `device_push_tokens`.
2. **App au premier plan :** le push n'est pas affiché, il est seulement journalisé en console.
3. **Clic sur un push :**
   - `offer` / `offer_nearby` › `/offers`, sans l'id de l'offre
   - `reservation` › `/merchant/dashboard`
4. **In-app :**
   - Les nouvelles lignes `notifications` arrivent via Supabase Realtime.
   - Badge rouge et son.
   - Liste dans la cloche du header.
5. **Désactivation :** à la déconnexion, le token passe `is_active:false`.

---

## 4. Textes des notifications

### 4.1 Générées par les triggers SQL présents dans le repo (`supabase/migrations`), en anglais

| Événement | Destinataire | Titre | Message |
|---|---|---|---|
| Réservation créée | Marchand | `New Reservation` | `A client reserved {N units} of "{offre}"` |
| Réservation créée | Client | `Reservation Created` | `Your reservation for {N units} of "{offre}" has been created` |
| Changement de statut | Client | `Reservation {Statut}` | `Your reservation ({N units}) at "{marchand}" is now {statut}` |
| Pending vers cancelled ou expired | Marchand | `Reservation {Statut}` | `A reservation ({N units}) for "{offre}" was {statut}` |
| Stock à 0 | Marchand | `Offer Sold Out` | `Your offer "{offre}" is now out of stock!` |
| Rattrapage (backfill) | — | `Notification` | `You have a new notification` |

Points à noter :
- Les notifications de type `offer`, `offer_nearby` et `offer_expired`, ainsi que l'envoi FCM, **ne figurent dans aucun des deux repos**. Elles existent probablement en base.
- Les migrations écrivent `user_id` et `related_id`, alors que le front lit `recipient_id` et `data.offer_id` / `data.reservation_id`.
- Les textes turcs réellement envoyés ne sont donc pas visibles dans le code.

### 4.2 Textes in-app (front)

**Cloche :**
- Titre « Bildirimler ({n}) », lien « Tümünü Okundu İşaretle ».
- Vide : « Bildirim Yok » / « Yeni teklifler ve rezervasyonlardan burada bilgilendirileceksiniz ».

**Emojis par type :**

| Type | Emoji |
|---|---|
| offer | 🎁 |
| reservation | 📋 |
| offer_expired | ⏰ |
| stock_empty | 📦 |
| system | 🔔 |
| autre | 📢 |

**Autres textes :**
- Date au format `tr-TR` précédée de « 🕒 ».
- Ancienne notification sans réservation : `alert('❌ Bu bildirim çok eski ve rezervasyon detaylarını içermiyor.')`.
- Offre expirée après un clic : « Maalesef bu fırsat kaçtı! 😢 Bir dahaki sefere daha hızlı olun! ».

**Filtres par rôle :**
- Client : types `offer`, `offer_nearby`, `system`. Le client ne reçoit donc pas les changements de statut de ses réservations dans la cloche.
- Marchand : types `reservation`, `offer_expired`, `stock_empty`, `system`.

**Sons :**
- Client : `https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3`
- Marchand : `https://cdn.jsdelivr.net/gh/naptha/talkify-tts-voices@master/sounds/notification.mp3`

**Icône Android :** `res/drawable/ic_stat_notification.xml` (K blanc), couleur `#00A690`. Pas de canal personnalisé.

---

## 5. Composants réutilisés

| Composant | Fichier | Usage |
|---|---|---|
| Header | `src/components/Header.tsx` | Fond `#00A690`, logo, liens « Teklifleri Keşfet » / « İşletmeler İçin », bouton « Uygulamayı İndir » (desktop et menu burger), « Giriş Yap » avec choix « Müşteri Girişi » / « İşletme Girişi », cloche, avatar, menu utilisateur. MOB : fixe avec safe-area de 25 px, masqué sur `/`, centré sur les pages d'auth. |
| Footer | `src/components/Footer.tsx` | Fond `#00615F` / `#004D4A`, grand logo, « Hızlı Bağlantılar », « Destek », « Bize Ulaşın », adresse Manavgat, boutons désactivés « Google Play » et « App Store », « © 2025 ». Absent sur MOB natif. |
| BottomNav + BottomNavItem | `MOB src/components/navigation/` | Visiteur : Teklifler / Giriş / İşletmeler. Client : Teklifler / Rezervasyonlar / Profil. Marchand : Panel / Teklif Ekle. |
| NotificationBell | `src/components/NotificationBell.tsx` | Cloche avec badge, liste déroulante (MOB : pleine largeur). |
| DownloadAppModal | `src/components/DownloadAppModal.tsx` | Header et home. |
| Carte d'offre (liste) | `OfferCard` dans `OffersPage.tsx` | Variante `isMobile` jamais utilisée. |
| Carte d'offre (home) | `FeaturedOffers.tsx` | |
| Carte d'offre (marchand) | `OfferCard` dans `MerchantDashboardPage.tsx` | |
| Carte de réservation | `ReservationCard` (dashboard marchand), cartes de `ClientDashboardPage` | |
| MerchantBottomSheet | `src/components/MerchantBottomSheet.tsx` | |
| OfferDetailsModal | `src/components/OfferDetailsModal.tsx` | |
| QuantityModal | `src/components/QuantityModal.tsx` | |
| OfferForm | `src/components/OfferForm.tsx` | Ouvert via `AddProductContext` |
| ProfileCompletionModal | `src/components/ProfileCompletionModal.tsx` | |
| ReservationDetailsModal | `src/components/ReservationDetailsModal.tsx` | |
| SEO, StructuredData | `src/components/` | Balises head |
| Boutons | Classes `.btn-primary` (orange) et `.btn-secondary` (vert) dans `index.css`, très peu utilisées. La majorité des boutons ont des classes Tailwind inline. | |
| Toasts | Réimplémentés localement dans chaque page (aucun composant commun). Ailleurs : `alert()` / `confirm()`. | |
| Composants non utilisés | `Banner.tsx`, `MerchantsSection.tsx`, `src/pages/OffersPage.tsx.BACKUP_20251026_134320` | |

---

## 6. Palette, polices, logos et assets

### 6.1 Couleurs

`tailwind.config.js` définit `tilkapp-*` et `kapkurtar-*`, mais le code utilise surtout des hex en dur.

| Hex | Rôle observé | Occurrences (MOB) |
|---|---|---|
| `#00A690` | Vert principal (header, boutons, textes) | 354 |
| `#F75C00` | Orange (hover, CTA, scrollbar, focus) | 101 |
| `#FFFFF0` | Crème (textes du header, fonds) | 92 |
| `#00615F` | Teal foncé (footer, titres) | 6 |
| `#004D4A` | Bas du footer | — |
| `#008C7A` | Fin du dégradé vert | 8 |
| `#2DD4BF` (/10) | Fonds de sections de la home | 11 |
| `#F7F2E7` | Crème (écran de sélection MOB) | 3 |
| `#F5E6D3` | Beige (cloche, notifications non lues) | 2 |
| `#3A6932`, `#2D5226` | Vert olive (pages d'auth client) | 16 / 8 |
| `#FF6B35`, `#E55A28` | Orange secondaire (auth marchand) | 14 / 7 |
| `#FF7A29` | Hover du CTA de la home | — |

Gris Tailwind dominants : `text-gray-900`, `text-gray-700`, `text-gray-600`.

### 6.2 Polices

- Aucune police web chargée : pile système de Tailwind.
- Titres en graisse 700, letter-spacing −0.025em (`index.css`).

### 6.3 Logos et assets

**Supabase Storage** (`https://zhabjdyzawffsmvziojl.supabase.co/storage/v1/object/public/logos/`) :

| Fichier | Usage |
|---|---|
| `KK%20fond%20vert%20(6).png` | Logo du Header |
| `KK%20fond%20vert%20(8).png` | Logo du Footer |
| `FAVICON.png` | Favicons, manifeste PWA |
| `FAVICON%20MINI%20rond%20fond%20vert.png` | Logo marchand par défaut, marqueurs de la carte |
| `FAVICON%20MINI%20rond.png` | ImpactSection (WEB) |
| `Logo%20g.png` | ImpactSection (MOB) |
| `FAVICON%20MINI%20rond%20noir%20(1).png` | MerchantsHero |
| `merchants-hero.jpg` | MerchantsHero |

**Dossier `public/` de WEB :**
- `public/icons/` : apple-touch-icon (120, 152, 167, 180), favicon 16 et 32, icon 192, 512 et 1024, `icon.svg` (placeholder « KK »).
- `public/.well-known/assetlinks.json`, `robots.txt`, `sitemap.xml`, `_redirects`.

**MOB :**
- `assets/` : `app-icon.png`, `icon-final.png`, `icon-only.png`, `splash-logo.png`, `splash-screen.png`, `splash-logo-new.png`.
- `android/app/src/main/res/` : `mipmap-*/ic_launcher*.png`, `splash_logo.png`, `drawable*/splash.png`, `drawable/splash_icon.xml`, `drawable/ic_stat_notification.xml`.
- Couleurs Android : splash `#00A690`, fond du lanceur `#FFFFFF`.

**Images externes :**
- Pexels : hero, placeholder d'offre, ForMerchants, blog.
- Badges stores : `developer.apple.com` et `play.google.com` (DownloadPage).
- `https://kapkurtar.com/og-image.jpg` et `https://kapkurtar.com/logo.png` sont référencés mais absents de `public/`.

---

## 7. Différences entre le web et Android

| Sujet | WEB (kapkurtar.com) | Android (MOB) |
|---|---|---|
| Route `/` | HomePage marketing | UserTypeSelectionPage « Müşteriyim / İşletmeyim » |
| Navigation | Header + Footer | Header fixe (safe-area) + BottomNav, pas de Footer |
| Connexion Google | OAuth redirect + `/auth/callback` | Plugin natif + `signInWithIdToken` + upsert du profil |
| Géolocalisation | Navigateur + GeolocateControl | `@capacitor/geolocation`, popup GPS natif, ouverture des réglages |
| Recherche sur la carte | Geocoder Mapbox **en français** | Champ turc « Adres ara... » avec suggestions, geocoder masqué ≤768 px |
| Rayon | 1–30 km | 1–50 km (overlay mobile) |
| Push | Aucun | FCM via `@capacitor/push-notifications` |
| Dropdown de notifications | `w-96` absolu | Pleine largeur sur téléphone |
| Photo d'offre | Input file (`capture`) | `@capacitor/camera` |
| Traductions | ProfileCompletionModal, ClientProfilePage, FavoritesPage, ReservationDetailsModal et badges de réservation **en français** | Ces écrans sont en turc |
| Prix FeaturedOffers | `₺{x}` | `${x}` |
| Redirections | Par liste de routes | Le client complet est renvoyé vers `/offers` depuis la plupart des routes |
| Clé Mapbox du dashboard marchand | Une clé | Une autre clé en dur |
| PWA | Oui (`vite-plugin-pwa`) | Non |
| `<html lang>` | `fr` | `en` |
| Liens profonds | — | Schéma `com.kapkurtar.app:` + `https://kapkurtar.com` |

---

## 8. Points d'UX confus ou mal faits repérés dans le code

### 8.1 Langue et marque

1. Textes en français dans l'UI turque :
   - MerchantForgotPasswordPage (en entier)
   - AuthCallbackPage
   - ReviewsPage
   - Geocoder de la carte
   - Toasts de géolocalisation marchand
   - Erreurs d'upload (`uploadImage.ts`)
   - WEB : ProfileCompletionModal, ClientProfilePage, FavoritesPage, ReservationDetailsModal (avec €), badges de réservation marchand
   - `alert` de DownloadAppModal
2. Textes en anglais :
   - DownloadPage (en entier)
   - ProfileCompletePage
   - « -{n}% off »
   - Messages d'erreur Supabase bruts
   - « Image unavailable »
3. Anciennes marques : « SEPET » (auth client, auth marchand, OfferDetailsModal), logo « S » (auth client WEB), « TILKAPP » (ProfileCompletePage, ContactPage, blog).
4. Vocabulaire mélangé côté marchand : « Ürün » et « Teklif ». « Sil » annonce une suppression, mais le texte de confirmation dit « gizlemek ».

### 8.2 Contenus faux ou contradictoires

5. Statistiques non sourcées :
   - ImpactSection : 25, 150+, 8000+, 5
   - AboutPage : 150+, 8 000+, 25 ton
   - ForMerchantsSection : 25%, 500+
   - MerchantsHero : 500+, 10K+
   - DownloadPage : 4.8★, 50K+, 1M+
6. Paiement en ligne annoncé (« güvenli ödeme », « Online ödeme alırsınız ») alors qu'aucun paiement n'existe dans le code. Choix d'horaire annoncé (« Seçtiğiniz saatte ») alors qu'il n'existe pas.
7. Commission incohérente : %15 (Legal), %20 (Pricing), « %80 kazanç ».
8. App annoncée « Yakında » partout (modal, footer, ForMerchantsPage), DownloadPage avec des liens `#`, et aucun QR code réel.

### 8.3 Fonctionnalités cassées ou factices

9. La réservation depuis la home (FeaturedOffers) appelle un stub qui renvoie un succès sans rien créer.
10. Favoris :
    - Impossibles à ajouter (cœurs désactivés ou sans action).
    - Page `/favorites` orpheline, avec des liens vers des routes en 404.
11. Avis :
    - Étoiles grises accompagnées de « Yakında kullanılabilir ».
    - Note 4.5 en dur.
    - `/reviews` demande l'UUID du marchand.
12. ProfileCompletePage écrit dans la table `clients`, qui n'existe pas, et redirige vers `/auth`, qui n'est pas une route.
13. Aucun code ni QR de retrait. « Onayla » valide le retrait sans vérification ni confirmation.

### 8.4 Mise en page

14. `/offers` sur téléphone : la carte occupe la moitié de l'écran, la liste est masquée et la moitié basse reste vide.
15. Hauteur `calc(100vh-100px)` alors que le header fait 64 px. Sur WEB, le footer s'affiche sous la carte.
16. MOB : espaceur de 89 px + `pt-24` / `pt-28` en double. Hauteur `calc(100vh - 199px)` et `pt-[100px] pb-[120px]` en dur.
17. Bouton « Uygulamayı İndir » du header : visible sur desktop et dans le menu burger, mais pas dans la barre mobile sans ouvrir le menu.

### 8.5 États manquants ou incohérents

18. Aucun indicateur de chargement des offres : « Şu anda teklif bulunmuyor. » s'affiche pendant le chargement.
19. Spinners infinis :
    - Dashboard marchand sans ligne `merchants`
    - Dashboard client sans profil
20. Dashboard marchand :
    - Sans réservation en attente, la section réservations et le bouton « Geçmiş » disparaissent : l'historique devient inaccessible.
    - Après « Onayla », la carte reste dans la liste en attente jusqu'au polling suivant.
21. Le bouton reste « Şimdi Rezerve Et » quand le stock vaut exactement 0.
22. Le badge « İptal Edildi » a la même couleur verte que « Teslim Alındı ».
23. Mode « Yakında » pour un client connecté : le cercle est dessiné autour du point recherché, mais les offres viennent de la position enregistrée en base.
24. Le toast « Maalesef bu fırsat kaçtı! » s'affiche aussi pour une offre simplement hors du rayon (WEB).
25. Géolocalisation :
    - WEB : toute erreur affiche « Bu özellikleri kullanmak için uygulamayı indirin ».
    - MOB : un refus ouvre les réglages sans explication.
26. Lien de réinitialisation expiré : redirection silencieuse vers `/`.
27. ProfileCompletionModal : non fermable, et il efface la photo existante si aucune n'est choisie.

### 8.6 Formulaires et données

28. OfferForm :
    - Heures pré-remplies en UTC affichées comme heure locale (décalage de −3 h en Turquie).
    - Quantité 0 acceptée.
    - Aucun contrôle « fin > début ».
    - Toasts qui ne disparaissent pas.
29. Onboarding / Ayarlar :
    - La carte se recentre sur 46.2044, 5.2258 (France) au lieu de la position enregistrée.
    - Le logo est marqué « * » mais n'est pas obligatoire.
    - Une adresse factice est écrite.
    - Le titre reste « Tamamlayın » en mode réglages.
30. Connexion Google depuis la page client : le rôle est réécrit en `client` même pour un compte marchand existant.
31. Formats incohérents :
    - Monnaie : `₺{x}`, `{x}₺`, `$`, `€`
    - Rayon annoncé « 50km » alors que le code utilise 10 km
    - Slider 30 km ou 50 km selon l'écran
32. Le client ne reçoit pas de notification in-app pour les changements de statut de ses réservations. Le push n'est pas affiché quand l'app est au premier plan.

### 8.7 Divers

33. Liens réseaux sociaux génériques (`facebook.com`, `twitter.com`, `instagram.com`). WhatsApp avec un numéro français (+33).
34. Nombreux `console.log` de debug en production (OAuth, Mapbox, plateforme).
35. Leaflet est dans les dépendances, mais n'est utilisé que dans `index.css` : la carte est Mapbox.
