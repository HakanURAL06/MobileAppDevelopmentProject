/**
 * Dinamik İçerik Çeviri Yardımcısı (Dynamic Content Translator)
 * Kullanıcının veya seed verilerin girdiği ırk, aşı, not ve etkileşim metinlerini
 * uygulama İngilizce modundayken akıcı İngilizceye çevirir; Türkçe modunda orijinal metni korur.
 */

const DICTIONARY = {
  // Irklar / Türler
  'Tekir': 'Tabby',
  'Gri Tekir': 'Grey Tabby',
  'Sarman': 'Orange Tabby / Ginger',
  'Calico': 'Calico',
  'Sokak Kedisi': 'Street Cat',
  'Sokak Köpeği': 'Street Dog',
  'Melez': 'Mixed Breed',
  'Kangal Melezi': 'Kangal Mix',
  'Golden Melezi': 'Golden Mix',
  'Terrier Karışımı': 'Terrier Mix',
  'Yavru': 'Kitten / Puppy',

  // Bölgeler
  'Forum İstanbul': 'Forum Istanbul',
  'Kocatepe Metro Durağı': 'Kocatepe Metro Station',
  'İstanbul Üniversitesi': 'Istanbul University',
  'Genel Bölge': 'General District',
  'Bilinmeyen Bölge': 'Unknown District',

  // Aşı & Sağlık İşlemleri
  'Kuduz Aşısı': 'Rabies Vaccine',
  'Karma Aşı': 'Core Vaccine',
  'Karma Aşı (1. Doz)': 'Core Vaccine (1st Dose)',
  'Karma Aşı (2. Doz)': 'Core Vaccine (2nd Dose)',
  'Karma Aşı (DHPPi 1. Doz)': 'Core Vaccine (DHPPi 1st Dose)',
  'Karma Aşı (DHPPi 2. Doz)': 'Core Vaccine (DHPPi 2nd Dose)',
  'İç-Dış Parazit': 'Internal & External Parasite',
  'İç-Dış Parazit Tekrarı': 'Parasite Prevention Booster',
  'Lösemi Aşısı': 'Feline Leukemia Vaccine',
  'Corona Aşısı': 'Canine Corona Vaccine',
  'Bronchine (Boğmaca)': 'Bronchine (Kennel Cough)',
  'Kilo & Sağlık Kontrolü': 'Weight & Health Checkup',
  'Yıllık Kuduz Tekrarı': 'Annual Rabies Booster',
  'Karma Aşı Rapeli': 'Core Vaccine Booster',
  'Veteriner Genel Kontrolü': 'General Veterinary Examination',
  'Veteriner Genel Check-up': 'Veterinary Comprehensive Checkup',
  'Kuduz & Karma Aşı': 'Rabies & Core Vaccines',
  'Mikroçip & Pasaport': 'Microchip & Passport',
  'Acil Tedavi': 'Emergency Treatment',
  'Acil Tedavi Simülasyonu': 'Emergency Care Simulation',
  'Kilo & Diyet Takibi': 'Weight & Diet Monitoring',
  'Aşı Takvimi': 'Vaccination Schedule',
  'Parazit Tedavisi': 'Parasite Treatment',
  'Rutin Muayene': 'Routine Checkup',
  'Kampüs Aşı Programı': 'Campus Vaccine Program',
  'Kışlık Bakım & Besleme': 'Winter Care & Feeding',
  'Gönüllü Eğitimi': 'Volunteer Training',

  // Hayvan Notları (Karakter Özeti)
  'İsmine duyarlı, değişik bir miyavlaması var, sürekli farklı bir yerde uyuyor, Tipsiz ile kardeş.':
    'Responsive to her name, has a unique meow, always naps in different spots, sibling of Tipsiz.',
  'Habeş ile kardeş, insanlara çok zor alışıyor, tüyleri çok temiz.':
    'Sibling of Habeş, takes time getting used to strangers, has very clean coat.',
  'Fare avlamayı seviyor, aşırı obez, yıllardır metroda yaşıyor.':
    'Loves hunting mice, notably chubby, has lived happily in the subway station for years.',
  'Kendisini hiç sevdirmiyor, aşırı gizemli takılıyor.':
    'Does not let people pet her easily, carries an enigmatic aura.',
  'Aşırı ilgi bağımlısı, her zaman aç, çanta üstünde uyumayı çok seviyor.':
    'Total attention seeker, always hungry, loves curling up on visitors\' bags.',
  'Pancar isminde 2 kardeş köpek, yıllardır beraber dolanıyorlar, uyumayı seviyorlar.':
    'Two sibling dogs named Pancar, roaming together for years, fond of long naps.',

  // Etkileşim Notları
  'Forum İstanbul açık otoparkında yaş mama verildi 🥣':
    'Fed wet food in Forum Istanbul outdoor parking area 🥣',
  'Kulak arkası sevildi, mırıldayarak yaklaştı ✨':
    'Petted behind ears, approached purring lovingly ✨',
  'Taze kuru mama verildi 🥣':
    'Refilled fresh dry kibble 🥣',
  'Kardeşi Habeş ile birlikte yaş mama kabını paylaştılar 🥣':
    'Shared a wet food bowl with sibling Habeş 🥣',
  'Göz teması kuruldu, sakinleşti 🐾':
    'Gentle eye contact made, visibly relaxed 🐾',
  'Güneşlenen Tipsiz uzaktan selamlandı ☀️':
    'Greeted Tipsiz enjoying the sunshine from afar ☀️',
  'Metro çıkışında hafif kuru mama verildi 🥣':
    'Provided dry food near the metro exit 🥣',
  'Turnikelerin yanında tombiş göbeğini sevdirdi 🐾':
    'Showed chubby belly near the turnstiles 🐾',
  'Metro peronunda fare kovalarken görüldü, avcılık yeteneği harika 🐭':
    'Spotted chasing mice along the platform, superb reflexes 🐭',
  'Kocatepe metro su kabı dolduruldu 💧':
    'Refilled fresh drinking water bowl at Kocatepe metro 💧',
  'Sabah metrosunda yolcuların bacaklarına sürtündü ✨':
    'Rubbed against commuters\' legs during morning rush hour ✨',
  'Öğrenci yemekhanesi arkasında yaş mama verildi 🥣':
    'Fed tasty wet food behind the student dining hall 🥣',
  'Ağaçların altındaki gizli köşesinde su kabı tazelendi 💧':
    'Refilled water bowl at her hidden sanctuary under trees 💧',
  'Çınar ağacının altından merakla etrafı izledi 👀':
    'Curiously observed passersby from under the plane tree 👀',
  'Hukuk Fakültesi önünde sırtı okşandı ✨':
    'Petted gently on back near the Law Faculty ✨',
  'Öğrenci çantasının üzerine kıvrılıp uyudu 💤':
    'Curled up fast asleep on a student\'s backpack 💤',
  'Tavuklu yaş mama ikram edildi, afiyetle yedi 🥣':
    'Treated to chicken wet food, ate eagerly 🥣',
  'Bahçede dolaşırken takip etti, ilgi bekledi 🐾':
    'Followed students through campus garden seeking affection 🐾',
  'Forum İstanbul yeşilliklerinde büyük köpek maması verildi 🥣':
    'Fed large-breed dog food on Forum Istanbul greens 🥣',
  'AVM çevresinde yürüyüş yapıldı, neşeyle eşlik ettiler 🐕':
    'Walked around the perimeter, jogged alongside joyfully 🐕',
  'Güneşte uzanırken iki kardeşin de başları okşandı, kuyruk salladılar 🐕':
    'Scratched both siblings while sunbathing, tails wagged 🐕',
  'Çimlerin üzerinde birbirine sokulup uyurken görüldüler 💤':
    'Seen snuggling closely on the lawn fast asleep 💤',
  'Büyük su kapları taze suyla dolduruldu 💧':
    'Refilled their large community water bowl with fresh water 💧',
};

/**
 * Verilen metni aktif dile göre çevirir.
 * @param {string|null|undefined} text - Çevrilecek metin
 * @param {'tr'|'en'} language - Aktif dil
 * @returns {string}
 */
export function dt(text, language = 'tr') {
  if (!text || typeof text !== 'string') return text || '';
  if (language !== 'en') return text;

  const trimmed = text.trim();

  // Tam eşleşme kontrolü
  if (DICTIONARY[trimmed]) {
    return DICTIONARY[trimmed];
  }

  // Tarih / Zaman şablonları
  if (trimmed.includes('tarihine kadar buradaydı')) {
    return trimmed.replace('tarihine kadar buradaydı', 'until this date');
  }
  if (trimmed.startsWith('Az önce ilgilenildi')) {
    return trimmed.replace('Az önce ilgilenildi', 'Interacted just now');
  }
  if (trimmed.includes('civarında ilgilenildi')) {
    return trimmed
      .replace('Bugün', 'Today at')
      .replace('civarında ilgilenildi', 'interacted')
      .replace('saat önce', 'hours ago');
  }
  if (trimmed.includes('gün önce') && trimmed.includes('ilgilenildi')) {
    return trimmed
      .replace('gün önce', 'days ago')
      .replace('ilgilenildi', 'cared for');
  }

  return text;
}

export default dt;
