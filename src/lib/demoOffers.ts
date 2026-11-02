// Offres d'exemple : publiées par le marchand de démo pour montrer le fonctionnement du site.
// Elles ne peuvent pas être réservées : le bouton affiche « Yakında » à la place.
// Photos : Unsplash (licence Unsplash, https://unsplash.com/license), crédit ci-dessous.

export const DEMO_MERCHANT_IDS = ['51e9e1e7-f5df-461b-94c3-49614375548a'];

export const DEMO_CTA_LABEL = 'Yakında';

interface DemoOfferInfo {
  city: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
}

export const DEMO_OFFERS: Record<string, DemoOfferInfo> = {
  // Sürpriz Paket
  'd752b95a-a689-4725-9e45-7a9bef405f7f': {
    city: 'İstanbul',
    photographer: 'Tony Chen',
    photographerUrl: 'https://unsplash.com/@tony1218',
    photoUrl: 'https://unsplash.com/photos/gourmet-pastries-and-coffee-in-elegant-gift-packaging-7YZJDPtG_lI',
  },
  // Simit & poğaça kutusu
  '6af1bbe1-3f60-43b5-8cc6-079e21a6bf36': {
    city: 'Ankara',
    photographer: 'Yasin Onus',
    photographerUrl: 'https://unsplash.com/@yasinonus',
    photoUrl: 'https://unsplash.com/photos/freshly-baked-turkish-simit-bagels-covered-in-sesame-seeds-hq9cnzbpoYQ',
  },
  // Baklava kutusu
  'a0e9fea7-7dbb-400f-b58c-a33f270ceabd': {
    city: 'Gaziantep',
    photographer: 'Benjamin Chambon',
    photographerUrl: 'https://unsplash.com/@benjamin_chambon',
    photoUrl: 'https://unsplash.com/photos/golden-baklava-pastries-filled-with-chopped-pistachios-OEDeQheVySQ',
  },
  // Lahmacun menü
  'a7233f06-5285-4801-a464-5f9274d01a89': {
    city: 'Kahramanmaraş',
    photographer: 'Markus Winkler',
    photographerUrl: 'https://unsplash.com/@markuswinkler',
    photoUrl: 'https://unsplash.com/photos/delicious-looking-turkish-lahmacun-ready-to-be-served-CAmLnpQXcIY',
  },
  // Pide
  '812e26b6-e532-4719-9da3-6ef0affa41c7': {
    city: 'Konya',
    photographer: 'Yasin Onus',
    photographerUrl: 'https://unsplash.com/@yasinonus',
    photoUrl: 'https://unsplash.com/photos/chef-bakes-cheese-filled-flatbreads-in-a-stone-oven-yIpw2_2cHmg',
  },
  // Börek
  '1668c1cb-985c-4aef-bf72-770ffe67264d': {
    city: 'İzmir',
    photographer: 'Stepan',
    photographerUrl: 'https://unsplash.com/@stepan_photo',
    photoUrl: 'https://unsplash.com/photos/flaky-golden-pastries-displayed-in-a-bakery-pY3wmCkU_J8',
  },
  // Sebzeli akşam menüsü
  '6519965f-6ac6-4e5a-903c-22dd14107b24': {
    city: 'Antalya',
    photographer: 'Orkun Orcan',
    photographerUrl: 'https://unsplash.com/@orkunorcan',
    photoUrl: 'https://unsplash.com/photos/a-white-plate-topped-with-rice-and-veggies-d7rA1qLlD8w',
  },
  // Tatlı kutusu
  '784dd9f2-ebfc-4446-b2ea-e59f9377dbd4': {
    city: 'Bursa',
    photographer: 'Maria Teneva',
    photographerUrl: 'https://unsplash.com/@miteneva',
    photoUrl: 'https://unsplash.com/photos/pastries-display-selective-focus-photography-WEcAIO0N62o',
  },
};

type OfferLike = { merchant_id?: string | null; offer_id?: string; id?: string } | null | undefined;

const offerKey = (offer: OfferLike) => offer?.offer_id || offer?.id || '';

export const isDemoOffer = (offer: OfferLike): boolean =>
  !!offer &&
  ((!!offer.merchant_id && DEMO_MERCHANT_IDS.includes(offer.merchant_id)) || offerKey(offer) in DEMO_OFFERS);

export const getDemoOfferInfo = (offer: OfferLike): DemoOfferInfo | null =>
  DEMO_OFFERS[offerKey(offer)] || null;
