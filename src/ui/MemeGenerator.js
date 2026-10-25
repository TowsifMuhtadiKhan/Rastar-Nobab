import { toBengaliNumber } from './Textures.js';

export class MemeGenerator {
  // Collection of Viral Bangladeshi Satirical Memes & Headlines
  static getMemes(stats) {
    const nationalDamage = stats.nationalDamage || 0;
    const wrongWayDistance = stats.wrongWayMeters || Math.floor(Math.random() * 250 + 80);
    const maxDb = stats.maxDecibels || 135;
    const locationName = stats.locationName || 'আগারগাঁও';

    // If national damage is 0 (Exact Screenshot Match!)
    if (nationalDamage <= 0) {
      return {
        headline: 'অটো নামল, কিছুই ভাঙল না, পাঠকেরা হতাশ',
        couponPill: 'জাতীয় ক্ষতি শূন্য',
        couponTitle: 'দেশ আপনার কাছে হতাশ',
        couponSub: '',
        quoteText: 'এত ভদ্র অটো জীবনে দেখি নাই। সন্দেহ লাগতেছে।',
        quoteAuthor: 'এক ট্রাফিক সার্জেন্ট',
        caption: 'ঘটনাস্থলের ছবি তুলেছেন একজন পথচারী, যিনি সাহায্য না করে ভিডিও করছিলেন',
        article: `<p><b>নিজস্ব প্রতিবেদক, ${locationName}:</b> শেষ বাসের ধাক্কায় অটোটি আকাশে ওঠে। চালক শাপেল সোজা বাসের ছাদে, এবং ভাড়া না দিয়েই পরের স্টপেজে নেমে যান।</p><p>কর্তৃপক্ষ বলেছে, "কঠোর ব্যবস্থা নেওয়া হবে।" কবে নেওয়া হবে, সে প্রশ্নের উত্তর পাওয়া যায়নি।</p>`,
        damageText: '৳ ০'
      };
    }

    // 1. "এই টাকায় হতো" (What you could do with this corruption money)
    const eitaTakaList = [
      {
        pill: 'জাতীয় ক্ষতি ' + `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`,
        title: 'খিচুড়ি রান্না শিখতে এক কর্মকর্তার বিদেশ সফরের ৪ ভাগের ১ ভাগ',
        sub: '৫০০ কর্মকর্তার বিদেশ প্রশিক্ষণে বরাদ্দ ছিল ৫ কোটি টাকা'
      },
      {
        pill: 'জাতীয় ক্ষতি ' + `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`,
        title: 'রূপপুর প্রকল্পে ৭টি বালিশ নিচতলা থেকে চারতলায় তোলার খরচ',
        sub: 'প্রতি বালিশ তুলতে ব্যয় ধরা হয়েছিল ৭,১০০ টাকা'
      },
      {
        pill: 'জাতীয় ক্ষতি ' + `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`,
        title: 'পুকুর খনন শিখতে উগান্ডায় সরকারি কর্মকর্তাদের ৩ দিনের সফর',
        sub: 'প্রকল্প ব্যয় ৩ কোটি ৫০ লাখ টাকা'
      },
      {
        pill: 'জাতীয় ক্ষতি ' + `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`,
        title: 'বাঁশের রড দিয়ে নির্মিত ৬৫ মিটার গ্রামীণ সেতুর মোট বাজেট',
        sub: 'উদ্বোধনের ৩ দিনের মাথায় সেতুতে বাঁশের কঞ্চি দৃশ্যমান'
      },
      {
        pill: 'জাতীয় ক্ষতি ' + `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`,
        title: 'সিন্ডিকেটের মাধ্যমে খুচরা বাজার থেকে ১২ হালি দেশি ডিম কেনা',
        sub: 'ডিম আমদানির অনুমতি চেয়ে বাণিজ্য মন্ত্রণালয়ে আবেদন'
      }
    ];

    // 2. Headlines
    const headlines = [
      'উত্তেজিত জনতার হাতে অটো ধোলাই, ভিডিও ভাইরাল',
      'উল্টাপথে দেশি টেসলার তান্ডব, সার্জেন্ট গাছে উঠে আত্মরক্ষা',
      'হাইড্রোলিক হর্নের বিকট শব্দে মিরপুরের সব জানালার কাঁচ চুরমার',
      'ভিআইপি গাড়ি চূর্ণবিচূর্ণ করে অটোচালকের দাবি: রাস্তা কি বাপের?!',
      'দেশি টেসলার ধাক্কায় ফ্লাইওভারের পিলারে ফাটল, তদন্তে ৪২তম কমিটি'
    ];

    // 3. Quotes
    const quotes = [
      { text: 'চা খাইতে রসিদ লাগে?', author: 'বিজয় সরণি মোড়ের ট্রাফিক সার্জেন্ট' },
      { text: 'আমি ঠিকই চলছিলাম, রাস্তাটাই উল্টো ছিল!', author: 'দেশি টেসলা চালক' },
      { text: 'ভিডিও কইরেন না ভাই, ফেসবুকে দিয়েন না!', author: 'ধরা পড়া হেলমেটধারী যাত্রী' },
      { text: 'রাস্তা কি তোর বাপের? হ, বাপেরই!', author: 'স্থানীয় অটোরিকশা মালিক সমিতি' },
      { text: 'বালিশ তোলার টেকা নাই, কিন্তু টেসলা কিনছি!', author: 'উত্তেজিত জনতা' }
    ];

    // 4. Captions for the crash photo
    const captions = [
      'ঘটনাস্থলের ছবি তুলেছেন একজন পথচারী, যিনি সাহায্য না করে ভিডিও করছিলেন',
      'দুর্ঘটনাস্থলে উপস্থিত প্রত্যক্ষদর্শী জানান: ঘটনাটি লাইভে বেশি সুন্দর লাগছিল',
      'অটোরিকশাটি উদ্ধারে ক্রেন আসতে আসতে আরও ৩টি গাড়ি উল্টাপথে ঢুকে পড়ে',
      'ঘটনার পরপরই চায়ের দোকানে শুরু হয়েছে বিশেষজ্ঞদের ভূ-রাজনৈতিক বিশ্লেষণ'
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const chosenEita = pick(eitaTakaList);
    const chosenHeadline = pick(headlines);
    const chosenQuote = pick(quotes);
    const chosenCaption = pick(captions);

    // Formatted news article
    const article = `<p><b>নিজস্ব প্রতিবেদক, ${locationName}:</b> শেষ বাসের ধাক্কায় দেশি টেসলা অটোটি আকাশে ওঠে। চালক সোজা বাসের ছাদে, এবং ভাড়া না দিয়েই পরের স্টপেজে নেমে যান। উল্টো পথে চলেছে <b>${toBengaliNumber(wrongWayDistance)}</b> মিটার। সর্বোচ্চ শব্দদূষণ রেকর্ড হয়েছে <b>${toBengaliNumber(Math.round(maxDb))}</b> ডেসিবেল।</p><p>কর্তৃপক্ষ বলেছে, "কঠোর ব্যবস্থা নেওয়া হবে।" কবে নেওয়া হবে, সে প্রশ্নের উত্তর পাওয়া যায়নি।</p>`;

    return {
      headline: chosenHeadline,
      couponPill: chosenEita.pill,
      couponTitle: chosenEita.title,
      couponSub: chosenEita.sub,
      quoteText: chosenQuote.text,
      quoteAuthor: chosenQuote.author,
      caption: chosenCaption,
      article: article,
      damageText: `৳ ${toBengaliNumber(nationalDamage.toLocaleString('en-US'))}`
    };
  }

  // Ticker headlines full list (Screenshot Match with ◆ bullets!)
  static getTickerMemes() {
    return [
      'আবহাওয়া: আজ রাজধানীতে ধূলা, কাল আরও ধূলা',
      'সড়কে শৃঙ্খলা ফেরাতে বিশেষ ট্রাফিক সপ্তাহ শুরু, এ বছর এটি সপ্তম',
      'একই সড়ক এ বছর তৃতীয়বার খোঁড়া হলো, "সমন্বয় চলছে" বলছে কর্তৃপক্ষ',
      'বিশেষজ্ঞদের মতে রাজধানীতে ট্রাফিক জ্যাম এখন শহরের স্থায়ী ঐতিহ্য',
      'ফুটপাত দখলমুক্ত করতে অভিযান, দুই ঘণ্টা পর আবার দখল',
      'রাস্তায় নামল আরেকটি অটোরিকশা, বাকিটা ইতিহাস',
      'খিচুড়ি রান্না শিখতে ইউরোপ সফর শেষে কর্মকর্তাদের দেশে ফেরা',
      'রূপপুর প্রকল্পের বালিশ তোলার ব্যয় কমাতে নতুন কমিটি গঠন',
      'বাঁশের রড দিয়ে নির্মিত সেতু ১০০ বছর টিকবে, দাবি ঠিকাদারের',
      'বাপের রাস্তায় দেশি টেসলার উল্টাপথে রাজত্ব, দিশেহারা ট্রাফিক পুলিশ'
    ].join(' ◆ ');
  }
}
