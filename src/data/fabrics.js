/**
 * Dibaj Luxury Textile Catalog Dataset
 * Curated for high-end North African craft, bespoke curtains, and Arabic majlis upholstery.
 */

export const FABRIC_CATEGORIES = [
  { id: 'all', name: 'جميع التشكيلات' },
  { id: 'curtains', name: 'الستائر الفاخرة' },
  { id: 'majlis', name: 'الجلسات العربية' },
  { id: 'velvet', name: 'الصالونات المنجدة' },
  { id: 'jacquard', name: 'صناعة المنسوجات والدمقس' },
  { id: 'linen', name: 'الكتان المتوسطي' }
];

export const FABRICS = [
  {
    id: 'imperial-damask-gold',
    title: 'ديباج إمبراطوري مذهب - نقشة التراث الفاخر',
    category: 'jacquard',
    categoryArabic: 'الدمقس والجاكار',
    badge: 'الأكثر طلباً للأتيليه',
    description: 'قماش ديباج دمشقي استثنائي منسوج بخيوط البرونز الذهبي مع قاعدة عاجية دافئة. صُمم خصيصاً لصالونات الاستقبال الراقية وستائر الفلل والقصور الكبرى.',
    composition: '70% حرير طبيعي معالج، 30% خيوط قطنية مذهبة',
    weight: '520 جم / م²',
    width: '300 سم (ارتفاع كامل للمباني الشاهقة)',
    origin: 'نسيج إيطالي خاص - تفصيل يدوي بأتيليه طرابلس',
    abrasionResistance: '45,000 دورة مارتنديل (مقاومة فائقة للاستخدام اليومي)',
    mainImage: './assets/fabric_rolls_samples.jpg',
    featured: true,
    swatches: [
      {
        id: 'gold-bronze',
        name: 'الذهب الإمبراطوري والبرونز',
        colorHex: '#c08b3e',
        textureDesc: 'خيوط برونزية متلألئة مع نقشة أرابيسك بارزة',
        image: './assets/fabric_rolls_samples.jpg'
      },
      {
        id: 'warm-ivory',
        name: 'العاجي الدافئ والدمقس',
        colorHex: '#faf7f2',
        textureDesc: 'حرير عاجي ناعم بنقش دمشقي كلاسيكي',
        image: './assets/craftsman_artisan.jpg'
      },
      {
        id: 'velveteen-chocolate',
        name: 'الشوكولاتة الملكية والمعدن المذهب',
        colorHex: '#5a3a22',
        textureDesc: 'قاعدة داكنة مخملية متباينة مع الخيوط الذهبية',
        image: './assets/arabic_majlis_luxury.jpg'
      },
      {
        id: 'olive-laurel',
        name: 'الزيتوني المتوسطي المذهب',
        colorHex: '#4a5d4e',
        textureDesc: 'لمسات زيتونية هادئة مستوحاة من حدائق البحر المتوسط',
        image: './assets/grand_villa_curtains.jpg'
      }
    ],
    features: [
      'نسيج معالج ضد البقع وسهل التنظيف الموضعي',
      'حياكة يدويّة متقنة تمنح ثنيات الستائر انسدالاً انسيابياً ملوكياً',
      'ثبات كامل للألوان ضد أشعة الشمس المباشرة',
      'معايير فندقية فاخرة للأقمشة المقاومة للاشتعال'
    ],
    idealFor: 'الستائر الفاخرة للصالات الكبرى، تنجيد الأرائك الملكية، ومساند المجالس'
  },
  {
    id: 'grand-villa-velvet-curtains',
    title: 'ستائر الفلل الشاهقة - مخمل ملكي وشيفون معالج',
    category: 'curtains',
    categoryArabic: 'ستائر القصور الفاخرة',
    badge: 'تصميم حصري',
    description: 'تشكيلة ستائر ممتدة من السقف إلى الأرضيات (Floor-to-Ceiling) بطبقات مزدوجة تجمع بين هيبة المخمل الإمبراطوري العازل للضوء ونعومة الشيفون الحريري المتدلي بنفاذية لطيفة لضوء النهار.',
    composition: 'مخمل إيطالي 100% مع طبقة شيفون حريري',
    weight: '640 جم / م²',
    width: 'تفصيل حسب مقاسات الصالون',
    origin: 'حياكة يدوية خاصة - أتيليه شركة الديباج',
    abrasionResistance: 'عازل للصوت بنسبة 40% وعازل للحرارة',
    mainImage: './assets/grand_villa_curtains.jpg',
    featured: true,
    swatches: [
      {
        id: 'champagne-velvet',
        name: 'مخمل الشامبانيا والذهب',
        colorHex: '#d8b26e',
        textureDesc: 'مخمل ناعم ثقيل ببريق شامبانيا دافئ',
        image: './assets/grand_villa_curtains.jpg'
      },
      {
        id: 'deep-chocolate',
        name: 'المخمل الكاكاو الداكن',
        colorHex: '#3b2314',
        textureDesc: 'مخمل داكن فاخر ذو عمق استثنائي',
        image: './assets/arabic_majlis_luxury.jpg'
      },
      {
        id: 'mediterranean-pearl',
        name: 'شيفون اللؤلؤ المتوسطي',
        colorHex: '#fcf9f4',
        textureDesc: 'شيفون فائق النعومة بنسيم انسيابي ناعم',
        image: './assets/luxury_living_salon.jpg'
      }
    ],
    features: [
      'تجهيز كامل مع نظام المسارات المخفية الذكية أو الأنابيب البرونزية المصمتة',
      'شراشيب وأربطة ستائر برونزية يدوية الصنع متناسقة مع الهوية',
      'عزل حراري ملموس يحافظ على برودة الصالونات في الصيف الليبي',
      'حياكة متقنة بحواشي مزدوجة تمنع التمزق أو التهدل بمرور السنوات'
    ],
    idealFor: 'واجهات الزجاج البانورامية، الصالونات الشاهقة، وغرف الاستقبال الرسمية'
  },
  {
    id: 'arabic-majlis-royal-upholstery',
    title: 'طقم مجالس الأصالة - جاكار مذهب ومخمل مدمج',
    category: 'majlis',
    categoryArabic: 'أقمشة المجالس العربية',
    badge: 'تراث ليبي مطوّر',
    description: 'صُمم خصيصاً للجلسات الليبية والمجالس العربية التي تجمع بين فخامة التراث وراحة الجلوس الطويل. تطريز ذهبي متقن يزين مساند الظهر وأطراف الجلسات بألوان الكاميل والبرونز الدافئ.',
    composition: '55% خيوط جاكار عالية المتانة، 45% مخمل كثيف',
    weight: '580 جم / م²',
    width: '145 سم (عرض التنجيد المتخصص)',
    origin: 'أتيليه الديباج طرابلس',
    abrasionResistance: '60,000 دورة مارتنديل (مخصص للجلسات العائلية الدائمة)',
    mainImage: './assets/arabic_majlis_luxury.jpg',
    featured: true,
    swatches: [
      {
        id: 'majlis-camel-gold',
        name: 'الذهب والكاميل التراثي',
        colorHex: '#c08b3e',
        textureDesc: 'جاكار تقليدي مع خيوط مذهبة وتبطين ناعم',
        image: './assets/arabic_majlis_luxury.jpg'
      },
      {
        id: 'majlis-deep-brown',
        name: 'البني الملكي المطرّز',
        colorHex: '#4a2f1c',
        textureDesc: 'نقش هندسي بارز بألوان متناغمة',
        image: './assets/craftsman_artisan.jpg'
      },
      {
        id: 'majlis-laurel-green',
        name: 'أخضر الغار المتوسطي',
        colorHex: '#3a4c3e',
        textureDesc: 'درجة مهدئة للأعصاب بنقوش مستوحاة من العمارة الإسلامية',
        image: './assets/luxury_living_salon.jpg'
      }
    ],
    features: [
      'طبقة تبطين سفلية متماسكة تحافظ على شد القماش وتمنع الترهل',
      'مقاومة ممتازة للاحتكاك وانسكاب السوائل اليومية',
      'وسائد ومساند محشوة بأعلى كثافات الإسفنج والريش الفاخر',
      'تصميم مخصص ليتناسب مع زوايا ومساحات المجالس الخاصة'
    ],
    idealFor: 'المجالس العربية الأرضية والمرتفعة، غرف المعيشة الفسيحة، والصالونات التراثية'
  },
  {
    id: 'contemporary-living-velvet',
    title: 'مخمل الصالونات المعاصرة - فخامة اللمسة الحريرية',
    category: 'velvet',
    categoryArabic: 'المخمل الملكي',
    badge: 'طراز عصري هادئ',
    description: 'مخمل ناعم يتميز بلمعة لؤلؤية رقيقة تعكس الإضاءة المعمارية الحديثة، مصمم لتنجيد الكنب المودرن والكراسي الفردية (Armchairs) في الفلل الحديثة.',
    composition: '100% ألياف مخملية دقيقة المعالجة ضد التكتل',
    weight: '490 جم / م²',
    width: '145 سم',
    origin: 'بلجيكا - معالجة وتشطيب أتيليه الديباج',
    abrasionResistance: '50,000 دورة مارتنديل',
    mainImage: './assets/luxury_living_salon.jpg',
    featured: false,
    swatches: [
      {
        id: 'sand-gold',
        name: 'رمال الذهب والصحراء',
        colorHex: '#cf9d56',
        textureDesc: 'ملمس ناعم كالحرير ولون دافئ للغاية',
        image: './assets/luxury_living_salon.jpg'
      },
      {
        id: 'velvet-espresso',
        name: 'إسبريسو الشوكولاتة الداكنة',
        colorHex: '#2a1a11',
        textureDesc: 'لون عميق يمنح القطعة ثقلاً وفخامة كلاسيكية',
        image: './assets/arabic_majlis_luxury.jpg'
      },
      {
        id: 'stone-cream',
        name: 'رخام الكريما العاجي',
        colorHex: '#f0ede9',
        textureDesc: 'حيادي فاخر يتماشى مع الأرضيات الرخامية والباركيه',
        image: './assets/fabric_rolls_samples.jpg'
      }
    ],
    features: [
      'خالٍ تماماً من الانعكاسات البلاستيكية الرخيصة، بريق طبيعي هادئ',
      'مقاومة عالية للوبر وسهولة التمشيط بالفرشاة الجافة',
      'مناسب جداً للقطع ذات الانحناءات الهندسية المعاصرة'
    ],
    idealFor: 'أطقم صالونات المعيشة المودرن، مقاعد الطعام الفاخرة، ورؤوس الأسرة المنجدة'
  },
  {
    id: 'mediterranean-natural-linen',
    title: 'كتان حوض البحر المتوسط النقي - أناقة الطبيعة',
    category: 'linen',
    categoryArabic: 'الكتان المتوسطي',
    badge: 'طبيعي 100%',
    description: 'قماش كتان نقي منسوج بألياف طبيعية غير مبيضة، يعكس دفء شواطئ البحر الأبيض المتوسط ونقاء الضوء الطبيعي في المنازل والفيلات الصيفية.',
    composition: '100% كتان طبيعي عالي النقاء',
    weight: '380 جم / م²',
    width: '290 سم',
    origin: 'إسبانيا - تشطيب أتيليه الديباج',
    abrasionResistance: '30,000 دورة مارتنديل',
    mainImage: './assets/craftsman_artisan.jpg',
    featured: false,
    swatches: [
      {
        id: 'unbleached-sand',
        name: 'الكتان الرملي الخام',
        colorHex: '#dfd7ca',
        textureDesc: 'نسيج ذو ملمس عضوي خشن قليلاً ومظهر طبيعي استثنائي',
        image: './assets/craftsman_artisan.jpg'
      },
      {
        id: 'damask-ivory-linen',
        name: 'العاجي النقي المغسول',
        colorHex: '#faf7f2',
        textureDesc: 'كتان مغسول بحجارة البحر لمنحه نعومة فائقة عند الملمس',
        image: './assets/fabric_rolls_samples.jpg'
      },
      {
        id: 'sage-olive-linen',
        name: 'المرمية والزيتون الهادئ',
        colorHex: '#7a8c7e',
        textureDesc: 'درجة مستوحاة من أشجار الزيتون في الساحل الليبي',
        image: './assets/luxury_living_salon.jpg'
      }
    ],
    features: [
      'تنفس ممتاز للأنسجة ومقاوم لتراكم الروائح أو الرطوبة',
      'يزداد نعومة وجمالاً مع كل غسيل وعناية',
      'خيار مثالي للتصاميم المعمارية البسيطة والفاخرة (Minimalist Luxury)'
    ],
    idealFor: 'الستائر الرومانية، الستائر الصيفية المنسدلة، وأغطية الأثاث القابلة للفك'
  }
];

export function getFabricById(id) {
  return FABRICS.find(f => f.id === id) || FABRICS[0];
}

export function getFeaturedFabrics() {
  return FABRICS.filter(f => f.featured);
}
