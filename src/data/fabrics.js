/**
 * Dibaj Luxury Furniture & Salons Dataset
 * شركة الديباج لصناعة وتفصيل الصالونات والمجالس الفاخرة — طرابلس، سوق أبوسليم
 * 100% High-Resolution Studio Assets • Authentic Libyan Specs
 */

export const FABRIC_CATEGORIES = [
  { id: 'all', name: 'جميع التشكيلات' },
  { id: 'salons', name: 'صالونات عصرية وفاخرة' },
  { id: 'majlis', name: 'مجالس وجلسات عربية' },
  { id: 'corners', name: 'ركنيات تفصيل' },
  { id: 'curtains', name: 'ستائر مكملة للصالونات' }
];

export const FABRICS = [
  {
    id: 'salon-emerald-velvet',
    title: 'صالون المخمل الزمردي المضلع',
    category: 'salons',
    categoryArabic: 'صالونات عصرية وفاخرة',
    badge: 'الأكثر طلباً',
    description: 'صالون فاخر بتنجيد مضلع عميق من المخمل الإيطالي الزمردي الغني، مع كراسي ونجباك مريحة وأرجل ميتاليك مذهبة متينة تدوم لسنوات.',
    composition: 'مخمل إيطالي ناعم، هيكل خشب زان طبيعي مصمت، أرجل ميتاليك مذهبة',
    weight: 'إسفنج ضغط عالي 35 D ممتاز',
    width: 'تفصيل حسب مقاس صالتك',
    origin: 'ورش ومصنع الديباج — طرابلس',
    abrasionResistance: '65,000 دورة مارتنديل (مقاومة فائقة للاستخدام العائلي)',
    mainImage: './assets/salon-emerald-velvet.webp',
    featured: true,
    swatches: [
      {
        id: 'emerald-rich',
        name: 'الزمردي الملكي الفاخر',
        colorHex: '#0F6B4F',
        textureDesc: 'مخمل مضلع ناعم عاكس للضوء مع لمعة خفيفة',
        image: './assets/salon-emerald-velvet.webp'
      },
      {
        id: 'cream-chesterfield',
        name: 'العاجي اللؤلؤي الملكي',
        colorHex: '#F2EAD8',
        textureDesc: 'مخمل ناعم دافئ بتنجيد كبتونية راقٍ',
        image: './assets/salon-cream-chesterfield.webp'
      },
      {
        id: 'magenta-crushed',
        name: 'المخمل التوتي والكرزي',
        colorHex: '#A8114A',
        textureDesc: 'مخمل كرزي غني بأرجل مذهبة لامعة',
        image: './assets/salon-magenta-chesterfield.webp'
      },
      {
        id: 'taupe-hairpin',
        name: 'التوب والرمادي العصري',
        colorHex: '#A89684',
        textureDesc: 'قماش كتان معالج بأرجل معدنية عصرية',
        image: './assets/salon-taupe-hairpin.webp'
      }
    ],
    features: [
      'هيكل متين من خشب الزان المعالج المقاوم للرطوبة وتقلبات الطقس',
      'إسفنج ذو كثافة عالية 35 D ضغط عالي للراحة القصوى وثبات القوام لسنوات',
      'خياطة وتضليع يدوي متقن بأعلى معايير الحرفية في ورشنا',
      'إمكانية تفصيل ستائر متناسقة بنفس القماش واللون'
    ],
    idealFor: 'صالات الاستقبال العصرية، الفلل والمنازل الراقية، والباحثين عن الراحة والأناقة'
  },
  {
    id: 'majlis-carved-gold-damask',
    title: 'مجلس الخشب المذهب والدمقس العاجي',
    category: 'majlis',
    categoryArabic: 'مجالس وجلسات عربية',
    badge: 'تراث وأصالة',
    description: 'مجلس عربي أصيل بهيكل خشب زان منحوت يدوياً ومطلي بلمسات الذهب، منجد بقماش الديباج الدمشقي الفاخر المنسوج بخيوط حريرية متينة.',
    composition: 'قماش ديباج دمشقي مقاوم للاحتكاك، خشب زان حفر يدوي مذهب',
    weight: 'إسفنج ضغط عالي 35 D مدعم',
    width: 'تفصيل حسب مقاس الغرفة بالكامل',
    origin: 'ورش ومصنع الديباج — سوق أبوسليم',
    abrasionResistance: '55,000 دورة مارتنديل',
    mainImage: './assets/majlis-carved-gold-damask.webp',
    featured: true,
    swatches: [
      {
        id: 'carved-gold-ivory',
        name: 'الذهب الملكي والعاجي الدمقسي',
        colorHex: '#C9A227',
        textureDesc: 'ديباج دمشقي مذهب فاخر مع خشب مذهب بالكامل',
        image: './assets/majlis-carved-gold-damask.webp'
      },
      {
        id: 'sage-chenille-floor',
        name: 'الشينيل الزيتوني التراثي',
        colorHex: '#9FB0A3',
        textureDesc: 'شينيل بارز الملمس لجلسة أرضية مريحة وفخمة',
        image: './assets/majlis-sage-chenille.webp'
      },
      {
        id: 'black-gold-ornate',
        name: 'الأسود والمذهب الملكي',
        colorHex: '#221C16',
        textureDesc: 'تطريز ذهبي كلاسيكي متباين على أرضية سوداء فاخرة',
        image: './assets/majlis-black-gold-ornate.webp'
      }
    ],
    features: [
      'حفر زخرفي بارز ودقيق من خشب الزان الطبيعي المطلي بذهب ناصع',
      'تطريز دمشقي ملكي مقاوم للاهتراء والبهتان وسهل العناية',
      'طاولات متناسقة محفورة ومذهبة تكتمل بها فخامة المجلس',
      'جلسة متماسكة ومساند مريحة للغاية مصممة للضيافة الطويلة'
    ],
    idealFor: 'المجالس العربية الرسمية، مضافات الاستقبال، وصالونات التراث الليبي الأصيل'
  },
  {
    id: 'salon-cream-chesterfield',
    title: 'صالون تشسترفيلد الكلاسيكي العاجي',
    category: 'salons',
    categoryArabic: 'صالونات عصرية وفاخرة',
    badge: 'طراز كلاسيكي ملكي',
    description: 'صالون تشسترفيلد فاخر بتنجيد كبتونية عميق وأزرار مخملية متقنة، يضم أرائك 3 مقاعد واسعة مع كراسي برميلية مريحة وقاعدة خشبية صلبة.',
    composition: 'مخمل لؤلؤي عاجي ناعم، خشب زان أحمر مصمت، أزرار كبتونية مشدودة يدوياً',
    weight: 'إسفنج ضغط عالي 35 D مزدوج الطبقات',
    width: 'تفصيل حسب المقاسات المطلوبة',
    origin: 'ورش ومصنع الديباج — طرابلس',
    abrasionResistance: '60,000 دورة مارتنديل',
    mainImage: './assets/salon-cream-chesterfield.webp',
    featured: true,
    swatches: [
      {
        id: 'cream-ivory',
        name: 'العاجي اللؤلؤي الدافئ',
        colorHex: '#F2EAD8',
        textureDesc: 'مخمل لؤلؤي ناعم دافئ بتنجيد كبتونية كلاسيكي',
        image: './assets/salon-cream-chesterfield.webp'
      },
      {
        id: 'magenta-deep',
        name: 'التوتي والكرزي الفاخر',
        colorHex: '#A8114A',
        textureDesc: 'مخمل توتي فاخر يبرز تفاصيل الكبتونية',
        image: './assets/salon-magenta-chesterfield.webp'
      },
      {
        id: 'emerald-royal',
        name: 'الزمردي الإمبراطوري',
        colorHex: '#0F6B4F',
        textureDesc: 'مخمل زمردي ناعم يمنح القطعة ثقلاً استثنائياً',
        image: './assets/salon-emerald-velvet.webp'
      }
    ],
    features: [
      'تنجيد كبتونية يدوي كلاسيكي مشدود بدقة متناهية لمنع ارتخاء الأزرار',
      'هيكل خشب زان مصمت يضمن ثباتاً مطلقاً وتحملاً للأوزان',
      'وسائد جلوس قابلة للتدوير ومحشوة بطبقات إسفنج مريح للغاية',
      'تناسق رائع مع الطاولات المذهبة والرخامية'
    ],
    idealFor: 'صالات المعيشة الفسيحة، صالونات الاستقبال الكلاسيكية، وفلل طرابلس الراقية'
  },
  {
    id: 'majlis-sage-chenille',
    title: 'جلسة الشينيل المرمري الأرضية',
    category: 'majlis',
    categoryArabic: 'مجالس وجلسات عربية',
    badge: 'راحة وجلسة يومية',
    description: 'جلسة عربية أرضية عصرية بقماش الشينيل البارز بلون المرمية والزيتون الهادئ، مصممة بأعلى مستويات الراحة والمتانة مع طاولة وسط محفورة بتقنية CNC.',
    composition: 'قماش شينيل عالي المتانة، مساند إسفنج ضغط عالي، طاولة خشب CNC',
    weight: 'إسفنج كثافة 35 D لضمان عدم الهبوط',
    width: 'تفصيل حسب أطوال ومقاسات الحائط بالمتر',
    origin: 'ورش ومصنع الديباج — سوق أبوسليم',
    abrasionResistance: '50,000 دورة مارتنديل',
    mainImage: './assets/majlis-sage-chenille.webp',
    featured: true,
    swatches: [
      {
        id: 'sage-green',
        name: 'المرمية والزيتون الهادئ',
        colorHex: '#9FB0A3',
        textureDesc: 'شينيل دافئ بلمسة مخملية ناعمة مقاوم للاتساخ',
        image: './assets/majlis-sage-chenille.webp'
      },
      {
        id: 'terracotta-charcoal',
        name: 'التيراكوتا والفحم الدافئ',
        colorHex: '#B45A3C',
        textureDesc: 'ألوان ترابية غنية مستوحاة من البيوت الليبية الأصيلة',
        image: './assets/majlis-terracotta-charcoal.webp'
      },
      {
        id: 'damask-gold',
        name: 'الذهب والعاجي التراثي',
        colorHex: '#C9A227',
        textureDesc: 'ديباج دمشقي فاخر بجلسة أرضية مرتفعة',
        image: './assets/majlis-carved-gold-damask.webp'
      }
    ],
    features: [
      'حشوة إسفنج ضغط عالي متماسكة تضمن عدم هبوط الجلسة مع الاستخدام اليومي المستمر',
      'أقمشة معالجة ضد البقع وسهلة التنظيف بالمسح الموضعي',
      'مساند ظهر مريحة بزاوية ميلان مدروسة تريح الفقرات',
      'تفصيل مخصص ليطابق زوايا الغرفة ومداخلها بدقة السنتيمتر'
    ],
    idealFor: 'المجالس العائلية اليومية، المضافات الشعبية الراقية، وغرف الاسترخاء'
  },
  {
    id: 'corner-boucle-showroom',
    title: 'ركنية البوكليه العاجية الفاخرة',
    category: 'corners',
    categoryArabic: 'ركنيات تفصيل',
    badge: 'طراز عصري مودرن',
    description: 'كنبة ركنية عصرية بتصميم منحنٍ انسيابي وقماش البوكليه العاجي الدافئ المجعد، تمنح الصالة طابعاً أوروبياً عصرياً ولمسة دفء وراحة فائقة.',
    composition: 'قماش بوكليه تيدي فاخر، هيكل خشب زان صلب، نوابض ميتاليك مدعمة',
    weight: 'إسفنج ضغط عالي 35 D مع طبقة ألياف هوائية ناعمة',
    width: 'تفصيل حسب مقاس زاوية صالتك (L-Shape أو U-Shape)',
    origin: 'ورش ومصنع الديباج — طرابلس',
    abrasionResistance: '50,000 دورة مارتنديل',
    mainImage: './assets/corner-boucle-showroom.webp',
    featured: true,
    swatches: [
      {
        id: 'boucle-ivory',
        name: 'البوكليه العاجي الدافئ',
        colorHex: '#FAF7F2',
        textureDesc: 'نسيج بوكليه مجعد فاخر ناعم الملمس وسهل العناية',
        image: './assets/corner-boucle-showroom.webp'
      },
      {
        id: 'distressed-suede',
        name: 'الشامواه البرونزي المعتق',
        colorHex: '#3A3A38',
        textureDesc: 'شامواه مقاوم للماء والخدوش بلون فحمي وبرونزي راقٍ',
        image: './assets/corner-distressed-suede.webp'
      },
      {
        id: 'emerald-corner',
        name: 'المخمل الزمردي الغني',
        colorHex: '#0F6B4F',
        textureDesc: 'مخمل إيطالي ناعم يمنح الركنية حضوراً استثنائياً',
        image: './assets/salon-emerald-velvet.webp'
      }
    ],
    features: [
      'تصميم انسيابي حديث يوفر أكبر مساحة جلوس للعائلة دون إهدار للمساحة',
      'خامات بوكليه ممتازة مقاومة للتوبير وسهلة التنظيف الجاف',
      'إمكانية إضافة مسند للقدمين (بوف) وطاولات جانبية متناسقة',
      'هيكل زان متين ومثبت ببراغي صناعية شديدة التحمل'
    ],
    idealFor: 'صالات المعيشة المودرن، الشقق الحديثة، والفيلات ذات التصميم المفتوح'
  },
  {
    id: 'corner-distressed-suede',
    title: 'ركنية الشامواه المعاصرة L-Shape',
    category: 'corners',
    categoryArabic: 'ركنيات تفصيل',
    badge: 'متانة فائقة للاستخدام اليومي',
    description: 'ركنية عائلية عملية وفخمة من الشامواه المقاوم للماء والخدوش، بتصميم L-Shape حديث وألوان محايدة دافئة تناسب ديكورات البيوت العصرية.',
    composition: 'قماش شامواه معالج ضد السوائل، هيكل خشب زان طبيعي',
    weight: 'إسفنج ضغط عالي 35 D مريح وثابت',
    width: 'تفصيل حسب اتجاه الزاوية (يمين أو يسار) وبالمقاس الدقيق',
    origin: 'ورش ومصنع الديباج — طرابلس',
    abrasionResistance: '65,000 دورة مارتنديل',
    mainImage: './assets/corner-distressed-suede.webp',
    featured: false,
    swatches: [
      {
        id: 'suede-bronze',
        name: 'الشامواه الفحمي والبرونزي',
        colorHex: '#3A3A38',
        textureDesc: 'ملمس ناعم كالمخمل مع متانة الجلد ومقاومة السوائل',
        image: './assets/corner-distressed-suede.webp'
      },
      {
        id: 'boucle-warm',
        name: 'البوكليه العاجي',
        colorHex: '#FAF7F2',
        textureDesc: 'نسيج بوكليه ناعم لدفء إضافي',
        image: './assets/corner-boucle-showroom.webp'
      }
    ],
    features: [
      'قماش عالي المقاومة للبقع ومقاوم لخدوش الأطفال والحيوانات الأليفة',
      'مساند رأس اختيارية قابلة للتعديل لمزيد من الراحة أثناء المشاهدة',
      'خياطة مزدوجة بخيوط بوليستر عالية المتانة تمنع تمزق الحواف',
      'سعر اقتصادي ومدروس مع ضمان الجودة العالية'
    ],
    idealFor: 'غرف التلفزيون والمعيشة اليومية، غرف الشباب، والمساحات العملية'
  },
  {
    id: 'curtains-matching-gold',
    title: 'ستائر تفصيل متناسقة مع الصالونات',
    category: 'curtains',
    categoryArabic: 'ستائر مكملة للصالونات',
    badge: 'خدمة تفصيل متكاملة',
    description: 'خدمة تفصيل ستائر راقية بنفس قماش الصالون أو بدرجات ألوان متناغمة معه، بطبقات مخمل وشيفون حريري تضفي هيبة وتكاملاً ديكورياً على صالتك.',
    composition: 'مخمل إيطالي ناعم مع طبقة شيفون حريري منسدلة',
    weight: 'أقمشة ثقيلة لحجب الضوء وعزل الصوت',
    width: 'تفصيل حسب مقاسات النوافذ وارتفاع السقف',
    origin: 'ورش ومصنع الديباج — طرابلس',
    abrasionResistance: 'حياكة يدوية متقنة بحواشي عريضة',
    mainImage: './assets/curtains-matching-gold.webp',
    featured: true,
    swatches: [
      {
        id: 'curtain-gold-velvet',
        name: 'المخمل الذهبي والعاجي',
        colorHex: '#C9A227',
        textureDesc: 'مخمل ناعم ببريق دافئ ينسدل بانسيابية ملوكية',
        image: './assets/curtains-matching-gold.webp'
      },
      {
        id: 'curtain-emerald-velvet',
        name: 'المخمل الزمردي المتناسق',
        colorHex: '#0F6B4F',
        textureDesc: 'نفس خامة صالون المخمل الزمردي لتناغم ديكوري كامل',
        image: './assets/salon-emerald-velvet.webp'
      }
    ],
    features: [
      'تفصيل الستائر متناسقة بنسبة 100% مع ألوان ونوعية قماش صالونك أو مجلسك',
      'ثنيات مروحة أو ويف (Wave Fold) انسيابية مشدودة بحرفية',
      'عزل ممتاز لأشعة الشمس والحرارة للمحافظة على برودة الصالة',
      'تركيب متقن مع قضبان وإكسسوارات متينة تدوم طويلاً'
    ],
    idealFor: 'إكمال ديكور الصالونات والمجالس الجديدة، واجهات النوافذ الكبيرة، والفلل'
  }
];

export function getFabricById(id) {
  return FABRICS.find(f => f.id === id) || FABRICS[0];
}

export function getFeaturedFabrics() {
  return FABRICS.filter(f => f.featured);
}
