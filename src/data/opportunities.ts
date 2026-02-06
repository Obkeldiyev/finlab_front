export interface OpportunityDetail {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: {
    introduction: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export const opportunities: OpportunityDetail[] = [
  {
    id: '1',
    title: 'Xalqaro darajadagi kasbiy rivojlanish kurslari',
    shortDescription: 'Xalqaro darajadagi kasbiy rivojlanish kurslari tashkil etiladi. 288 soatlik malaka oshirish kursi Finlandiya ta\'lim modeli asosida.',
    fullContent: {
      introduction: 'Xalqaro darajadagi kasbiy rivojlanish kurslari tashkil etiladi.',
      sections: [
        {
          title: 'Kurs hajmi',
          content: 'Malaka oshirish kursi 288 soatni tashkil etadi. Bunda o\'quv dasturining 144 soat hajmini tinglovchi tomonidan mustaqil o\'lashtirish shakli orqali, 72 soat hajmi ishdan ajralgan holda xorijiy davlatlardagi ta\'lim tashkilotlarida ko\'chma tarzda (yoki onlayn shaklda) va 72 soati to\'g\'ridan-to\'g\'ri (bevosita) malaka oshirish shaklida ishdan ajralgan holda amalga oshiriladi. Attestatsiyadan muvaffaqiyatli o\'tgan kurs tinglovchilariga O\'zbekiston Respublikasi Prezidentining 2015-yil 12-iyundagi PF-4732-son Farmoni 3-ilovasi bilan tasdiqlangan davlat namunasidagi malaka attestati hamda xorijiy ta\'lim tashkilotining sertifikati beriladi.'
        },
        {
          title: 'Laboratoriya sharoitida ta\'lim',
          content: '144 akademik soatlik kasbiy rivojlantirish laboratoriya sharoitida va mustaqil ta\'lim shaklida amalga oshiriladi. Ushbu jarayon doirasida tinglovchilar Finlandiya ta\'lim moduli asosida o\'z kasbiy rivojlanish trayektoriyasini rejalashtiradi hamda faoliyat natijalarini elektron va reflektiv portfolioda jamlaydi. Portfolio tayyorlash jarayonida tinglovchilarning o\'quv va amaliy faoliyati, laboratoriya ishlari, loyiha natijalari hamda reflektiv tahlillari tizimli ravishda hujjatlashtiriladi.'
        },
        {
          title: 'Loyiha faoliyati',
          content: 'Kasbiy rivojlantirishning muhim tarkibiy qismi sifatida loyiha faoliyati amalga oshiriladi. Tinglovchilar STEAM yondashuvi va loyiha asosida o\'qitish (PBL) metodologiyasi asosida maktabgacha ta\'lim, umumiy o\'rta ta\'lim yoki oliy ta\'lim bosqichlariga mos ta\'limiy yoki metodik loyihalarni ishlab chiqadilar. Loyihalar Finlandiya ta\'lim tajribasini tahlil qilish va uni milliy ta\'lim tizimi sharoitiga moslashtirishga yo\'naltiriladi.'
        },
        {
          title: 'Laboratoriya ishlari',
          content: 'Kasbiy rivojlantirish jarayonida laboratoriya ishlari keng o\'rin egallaydi. Tinglovchilar robototexnika, 3D printerlar, VR/AR texnologiyalari, raqamli laboratoriyalar va interaktiv o\'quv platformalaridan foydalangan holda amaliy mashg\'ulotlar olib boradilar. Ushbu faoliyat ta\'lim muhitlarini modellashtirish, innovatsion pedagogik texnologiyalarni sinovdan o\'tkazish va ularning ta\'lim jarayonidagi samaradorligini baholashga xizmat qiladi.'
        },
        {
          title: 'Innovatsion faoliyat',
          content: 'Dastur doirasida tinglovchilarning innovatsion va tadbirkorlik kompetensiyalarini rivojlantirish maqsadida startap yoki innovatsion g\'oyalarni ishlab chiqish faoliyati ham amalga oshiriladi. Tinglovchilar ta\'lim sohasiga yo\'naltirilgan raqamli, texnologik yoki pedagogik mahsulot konsepsiyasini ishlab chiqib, uni amaliyotga joriy etish mexanizmlarini asoslaydilar.'
        },
        {
          title: 'Metodik ishlanmalar',
          content: 'Kasbiy rivojlantirishning yakuniy bosqichida tinglovchilar metodik ishlanmalar tayyorlaydi. Ushbu ishlanmalar Finlandiya ta\'lim moduli asosida dars ishlanmalari, mashg\'ulot ssenariylari, baholash mezonlari va metodik tavsiyalarni o\'z ichiga oladi. Tayyorlangan metodik materiallar milliy ta\'lim tizimi sharoitida qo\'llash uchun mo\'ljallangan bo\'lib, tinglovchilarning kasbiy, raqamli va innovatsion kompetensiyalarini rivojlantirishga xizmat qiladi.'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Xalqaro darajadagi qisqa muddatli kurslar',
    shortDescription: 'Laboratoriyada Finlandiya ta\'lim moduli asosida 36 va 72 akademik soatli kasbiy rivojlantirish dasturlari amalga oshiriladi.',
    fullContent: {
      introduction: 'Xalqaro darajadagi qisqa muddatli kurslar tashkil etiladi.',
      sections: [
        {
          title: 'Umumiy ma\'lumot',
          content: 'Laboratoriyada Finlandiya ta\'lim moduli asosida ishlab chiqilgan uchta ta\'lim muhitining maketlari – maktabgacha ta\'lim, umumiy o\'rta (maktab) ta\'limi va oliy ta\'lim bosqichlarini qamrab oladi hamda 36 va 72 akademik soatli kasbiy rivojlantirish dasturlarini amalga oshirish uchun mo\'ljallangan. Ushbu maketlar kompetensiyaga yo\'naltirilgan yondashuv, o\'quvchi agentligi, moslashuvchan o\'quv muhitlari va formativ baholash tamoyillari asosida modellashtirilgan.'
        },
        {
          title: 'Texnologiyalar va metodlar',
          content: 'Kasbiy rivojlantirish jarayonida robototexnika, 3D printerlar, VR/AR texnologiyalari, raqamli laboratoriyalar va interaktiv o\'quv platformalari integratsiyalashgan holda qo\'llanilib, STEAM yondashuvi, loyiha va muammo asosida o\'qitish (PBL), tajribaga asoslangan o\'rganish metodlari asosida amaliy mashg\'ulotlar tashkil etiladi. Dasturlar pedagog kadrlarning kasbiy, raqamli va innovatsion kompetensiyalarini rivojlantirish, shuningdek, xalqaro ilg\'or ta\'lim texnologiyalarini amaliyotga joriy etishga yo\'naltiriladi.'
        },
        {
          title: '36 akademik soatli kurs',
          content: '36 akademik soatli qisqa muddatli kasbiy rivojlantirish kursi laboratoriya sharoitida intensiv va amaliy yo\'naltirilgan shaklda tashkil etiladi. Kurs Finlandiya ta\'lim moduli asosida pedagog kadrlarning zamonaviy ta\'lim texnologiyalaridan foydalanish bo\'yicha asosiy amaliy kompetensiyalarini shakllantirishga qaratiladi. Tinglovchilar robototexnika, 3D printerlar, VR/AR texnologiyalari hamda raqamli o\'quv vositalarining didaktik imkoniyatlarini amaliy mashg\'ulotlar orqali o\'zlashtiradilar. Kurs davomida tinglovchilar mini-loyiha yoki qisqa metodik ishlanma ishlab chiqadilar. O\'zlashtirish darajasi amaliy topshiriqlar natijalari va reflektiv tahlil asosida baholanadi. Kursni muvaffaqiyatli yakunlagan tinglovchilarga Renessans ta\'lim universiteti Finlandiya ta\'lim laboratoriyasi tomonidan sertifikat beriladi.'
        },
        {
          title: '72 akademik soatli kurs',
          content: '72 akademik soatli qisqa muddatli kasbiy rivojlantirish kursi laboratoriya va mustaqil ta\'lim faoliyatini uyg\'unlashtirgan holda tashkil etiladi. Kurs Finlandiya ta\'lim moduli asosida pedagog kadrlarning raqamli, metodik va innovatsion kompetensiyalarini chuqurlashtirish, shuningdek zamonaviy ta\'lim texnologiyalarini loyihalash va sinovdan o\'tkazish ko\'nikmalarini rivojlantirishga yo\'naltiriladi. Kurs doirasida tinglovchilar tanlangan ta\'lim bosqichiga mos amaliy loyiha, metodik ishlanma yoki laboratoriya ishlari majmuasini ishlab chiqadilar. O\'zlashtirish darajasi loyiha yoki metodik ishlanmani taqdim etish, laboratoriya natijalari hamda reflektiv tahlil asosida kompleks baholanadi. Kursni muvaffaqiyatli yakunlagan tinglovchilarga Renessans ta\'lim universiteti Finlandiya ta\'lim laboratoriyasi tomonidan sertifikat beriladi.'
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Ilmiy tadqiqot faoliyati',
    shortDescription: 'Laboratoriya doirasida Finlandiya ta\'lim moduli hamda boshqa yetakchi xalqaro davlatlar ta\'lim modullari asosida ilmiy tadqiqotlar olib boriladi.',
    fullContent: {
      introduction: 'Ilmiy tadqiqot faoliyati',
      sections: [
        {
          title: 'Tadqiqot yo\'nalishlari',
          content: 'Laboratoriya doirasida Finlandiya ta\'lim moduli hamda boshqa yetakchi xalqaro davlatlar ta\'lim modullari asosida pedagogika, ta\'lim texnologiyalari va kasbiy rivojlanish yo\'nalishlarida ilmiy tadqiqotlar olib boriladi. Mazkur tadqiqotlar zamonaviy ilmiy-metodologik yondashuvlar, evidensiyaga asoslangan ta\'lim (evidence-based education) va xalqaro ilmiy standartlar asosida tashkil etiladi.'
        },
        {
          title: 'Ilmiy ekspertiza',
          content: 'Laboratoriya tomonidan olib borilayotgan ilmiy tadqiqotlar ilmiy ekspertizadan o\'tkazilib, ularning metodologik asoslanganligi, ilmiy yangiligi va amaliy ahamiyati baholanadi. Ekspertiza natijalariga ko\'ra, istiqbolli va sifatli ilmiy ishlanmalar ilmiy-metodik jihatdan qo\'llab-quvvatlanadi, takomillashtiriladi hamda ta\'lim amaliyotiga joriy etish uchun tavsiya etiladi.'
        },
        {
          title: 'Xalqaro hamkorlik',
          content: 'Laboratoriya ilmiy tadqiqotlar natijalarini xalqaro hamkorliklar doirasida rivojlantirish, qo\'shma ilmiy loyihalar amalga oshirish, ilmiy maqolalar va metodik ishlanmalarni tayyorlash hamda ularni milliy va xalqaro nashrlarda e\'lon qilish uchun ilmiy platforma vazifasini bajaradi.'
        }
      ]
    }
  }
];
