export type NicheIconKey = "film" | "money" | "bag" | "phone" | "heart" | "camera" | "music" | "sparkles";

export interface CreatorReel {
  caption: string;
  tag: string;
  views: string;
  gradient: string;
  accent: string;
}

export interface CreatorExperience {
  brand: string;
  monogram: string;
  bg: string;
  instagram?: string;
  tiktok?: string;
  platformOnly?: "Instagram" | "TikTok";
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  initials: string;
  avatarBg: string;
  flag: string;
  location: string;
  topCreator: boolean;
  verified: boolean;
  platforms: ("instagram" | "tiktok" | "youtube")[];
  views: string;
  engagement: string;
  cpm: string;
  niches: { label: string; icon: NicheIconKey }[];
  reels: [CreatorReel, CreatorReel, CreatorReel];
  experiences: CreatorExperience[];
  moreExperiences: number;
  audienceSource: string;
  ages: { label: string; pct: number }[];
  gender: { female: number; male: number; unknown: number };
  countries: { flag: string; code: string; pct: number }[];
}

export const TOP_CREATORS: CreatorProfile[] = [
  {
    id: "kelvin-tavares",
    name: "Kelvin Tavares",
    handle: "@kelvintavares",
    initials: "KT",
    avatarBg: "linear-gradient(135deg, #2563EB 0%, #4EA7EB 100%)",
    flag: "🇦🇴",
    location: "Luanda, AO",
    topCreator: true,
    verified: true,
    platforms: ["instagram", "tiktok", "youtube"],
    views: "4,7M",
    engagement: "6,4%",
    cpm: "1 200 Kz",
    niches: [
      { label: "Entretenimento & Mídia", icon: "film" },
      { label: "Finanças & Comércio", icon: "money" },
    ],
    reels: [
      {
        caption: "24h em Luanda com 10 000 Kz",
        tag: "Vlog · 0:42",
        views: "1,8M",
        gradient: "linear-gradient(160deg, #1E3A5F 0%, #2C5E9E 48%, #0E1B2A 100%)",
        accent: "#60B5FF",
      },
      {
        caption: "Bastidores do treino",
        tag: "Reels · 0:28",
        views: "2,1M",
        gradient: "linear-gradient(160deg, #4B3A24 0%, #8C6A3D 45%, #1E1912 100%)",
        accent: "#F5C469",
      },
      {
        caption: "O segredo das marcas em 2026",
        tag: "TikTok · 0:51",
        views: "820K",
        gradient: "linear-gradient(160deg, #183446 0%, #28666E 50%, #0D1B22 100%)",
        accent: "#5CE1E6",
      },
    ],
    experiences: [
      { brand: "Kamba Pay", monogram: "KP", bg: "linear-gradient(135deg, #F97316, #EA580C)", instagram: "2,3M", tiktok: "288,8K" },
      { brand: "Tupuca", monogram: "TP", bg: "linear-gradient(135deg, #22C55E, #16A34A)", platformOnly: "Instagram" },
    ],
    moreExperiences: 2,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 11 },
      { label: "18–24", pct: 43 },
      { label: "25–34", pct: 32 },
      { label: "35–44", pct: 8 },
      { label: "45–54", pct: 5 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 1 },
    ],
    gender: { female: 39, male: 49, unknown: 12 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 78 },
      { flag: "🇵🇹", code: "PT", pct: 12 },
      { flag: "🇧🇷", code: "BR", pct: 5 },
    ],
  },
  {
    id: "soraia-mendes",
    name: "Soraia Mendes",
    handle: "@soraiamendes",
    initials: "SM",
    avatarBg: "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)",
    flag: "🇦🇴",
    location: "Luanda, AO",
    topCreator: true,
    verified: true,
    platforms: ["instagram", "tiktok"],
    views: "3,2M",
    engagement: "8,1%",
    cpm: "1 450 Kz",
    niches: [
      { label: "Moda & Beleza", icon: "sparkles" },
      { label: "Lifestyle & Compras", icon: "bag" },
    ],
    reels: [
      {
        caption: "Rotina de pele no calor de Luanda",
        tag: "Reels · 0:34",
        views: "1,4M",
        gradient: "linear-gradient(160deg, #6B2145 0%, #BE4B7B 48%, #240D19 100%)",
        accent: "#F9A8D4",
      },
      {
        caption: "3 looks para evento de noite",
        tag: "TikTok · 0:25",
        views: "1,1M",
        gradient: "linear-gradient(160deg, #3B2252 0%, #7C4EA6 48%, #160D21 100%)",
        accent: "#D8B4FE",
      },
      {
        caption: "Unboxing da semana",
        tag: "Reels · 0:46",
        views: "710K",
        gradient: "linear-gradient(160deg, #5C3524 0%, #B36A4B 48%, #21130D 100%)",
        accent: "#FDBA74",
      },
    ],
    experiences: [
      { brand: "Natura AO", monogram: "NA", bg: "linear-gradient(135deg, #EC4899, #DB2777)", instagram: "1,8M", tiktok: "640K" },
      { brand: "Kero", monogram: "KR", bg: "linear-gradient(135deg, #EAB308, #CA8A04)", instagram: "910K" },
    ],
    moreExperiences: 3,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 9 },
      { label: "18–24", pct: 48 },
      { label: "25–34", pct: 31 },
      { label: "35–44", pct: 8 },
      { label: "45–54", pct: 3 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 74, male: 19, unknown: 7 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 82 },
      { flag: "🇵🇹", code: "PT", pct: 11 },
      { flag: "🇲🇿", code: "MZ", pct: 4 },
    ],
  },
  {
    id: "diogo-kiala",
    name: "Diogo Kiala",
    handle: "@diogokiala",
    initials: "DK",
    avatarBg: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    flag: "🇦🇴",
    location: "Benguela, AO",
    topCreator: true,
    verified: true,
    platforms: ["tiktok", "instagram", "youtube"],
    views: "2,9M",
    engagement: "7,2%",
    cpm: "1 100 Kz",
    niches: [
      { label: "Tecnologia & Apps", icon: "phone" },
      { label: "Finanças & Comércio", icon: "money" },
    ],
    reels: [
      {
        caption: "5 apps grátis que uso todos os dias",
        tag: "TikTok · 0:39",
        views: "1,3M",
        gradient: "linear-gradient(160deg, #0F2942 0%, #1D5E96 48%, #091521 100%)",
        accent: "#38BDF8",
      },
      {
        caption: "Setup minimalista em casa",
        tag: "Reels · 0:22",
        views: "940K",
        gradient: "linear-gradient(160deg, #1E293B 0%, #475569 48%, #0F172A 100%)",
        accent: "#94A3B8",
      },
      {
        caption: "Teste real de bateria em 48h",
        tag: "Shorts · 0:55",
        views: "660K",
        gradient: "linear-gradient(160deg, #0F3D3E 0%, #1C7A7C 48%, #071E1F 100%)",
        accent: "#2DD4BF",
      },
    ],
    experiences: [
      { brand: "Unitel", monogram: "UN", bg: "linear-gradient(135deg, #F97316, #C2410C)", instagram: "1,1M", tiktok: "1,4M" },
      { brand: "Africell", monogram: "AF", bg: "linear-gradient(135deg, #9333EA, #7E22CE)", platformOnly: "TikTok" },
    ],
    moreExperiences: 1,
    audienceSource: "Do TikTok · YouTube",
    ages: [
      { label: "13–17", pct: 14 },
      { label: "18–24", pct: 41 },
      { label: "25–34", pct: 33 },
      { label: "35–44", pct: 9 },
      { label: "45–54", pct: 2 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 28, male: 64, unknown: 8 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 74 },
      { flag: "🇵🇹", code: "PT", pct: 15 },
      { flag: "🇧🇷", code: "BR", pct: 6 },
    ],
  },
  {
    id: "nadia-costa",
    name: "Nádia Costa",
    handle: "@nadiacosta.ao",
    initials: "NC",
    avatarBg: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
    flag: "🇦🇴",
    location: "Luanda, AO",
    topCreator: false,
    verified: true,
    platforms: ["instagram", "tiktok"],
    views: "2,4M",
    engagement: "9,0%",
    cpm: "1 050 Kz",
    niches: [
      { label: "Gastronomia & Café", icon: "heart" },
      { label: "Lifestyle & Rotina", icon: "camera" },
    ],
    reels: [
      {
        caption: "Onde comer bem na Ilha hoje",
        tag: "Reels · 0:44",
        views: "1,1M",
        gradient: "linear-gradient(160deg, #5C3214 0%, #B86524 48%, #211207 100%)",
        accent: "#FCD34D",
      },
      {
        caption: "Receita rápida de 10 minutos",
        tag: "TikTok · 0:31",
        views: "780K",
        gradient: "linear-gradient(160deg, #1E4231 0%, #377D5B 48%, #0C1C14 100%)",
        accent: "#6EE7B7",
      },
      {
        caption: "Review sincero de entregas",
        tag: "Reels · 0:37",
        views: "520K",
        gradient: "linear-gradient(160deg, #4A1D24 0%, #9E3B4A 48%, #1E0B0E 100%)",
        accent: "#FDA4AF",
      },
    ],
    experiences: [
      { brand: "Tupuca", monogram: "TP", bg: "linear-gradient(135deg, #22C55E, #15803D)", instagram: "980K", tiktok: "510K" },
      { brand: "Cuca", monogram: "CC", bg: "linear-gradient(135deg, #EF4444, #B91C1C)", instagram: "620K" },
    ],
    moreExperiences: 2,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 6 },
      { label: "18–24", pct: 35 },
      { label: "25–34", pct: 41 },
      { label: "35–44", pct: 13 },
      { label: "45–54", pct: 4 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 63, male: 30, unknown: 7 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 86 },
      { flag: "🇵🇹", code: "PT", pct: 9 },
      { flag: "🇨🇻", code: "CV", pct: 2 },
    ],
  },
  {
    id: "mateus-silva",
    name: "Mateus Silva",
    handle: "@mateussilva.fit",
    initials: "MS",
    avatarBg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    flag: "🇦🇴",
    location: "Huíla, AO",
    topCreator: true,
    verified: true,
    platforms: ["tiktok", "instagram"],
    views: "3,8M",
    engagement: "6,8%",
    cpm: "1 150 Kz",
    niches: [
      { label: "Fitness & Bem-estar", icon: "heart" },
      { label: "Entretenimento & Mídia", icon: "film" },
    ],
    reels: [
      {
        caption: "Treino de 15 min sem ginásio",
        tag: "TikTok · 0:29",
        views: "1,7M",
        gradient: "linear-gradient(160deg, #133A2E 0%, #24785E 48%, #091A15 100%)",
        accent: "#34D399",
      },
      {
        caption: "Desafio 30 dias em Lubango",
        tag: "Reels · 0:40",
        views: "1,2M",
        gradient: "linear-gradient(160deg, #1E324A 0%, #37618F 48%, #0D1621 100%)",
        accent: "#60A5FA",
      },
      {
        caption: "O que como num dia normal",
        tag: "Reels · 0:33",
        views: "900K",
        gradient: "linear-gradient(160deg, #3D351A 0%, #827136 48%, #1A170B 100%)",
        accent: "#FDE047",
      },
    ],
    experiences: [
      { brand: "Pura Vida", monogram: "PV", bg: "linear-gradient(135deg, #10B981, #047857)", instagram: "1,4M", tiktok: "890K" },
      { brand: "ZAP", monogram: "ZP", bg: "linear-gradient(135deg, #2563EB, #1D4ED8)", platformOnly: "Instagram" },
    ],
    moreExperiences: 1,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 10 },
      { label: "18–24", pct: 44 },
      { label: "25–34", pct: 34 },
      { label: "35–44", pct: 9 },
      { label: "45–54", pct: 2 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 42, male: 51, unknown: 7 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 80 },
      { flag: "🇵🇹", code: "PT", pct: 11 },
      { flag: "🇧🇷", code: "BR", pct: 4 },
    ],
  },
  {
    id: "ines-carvalho",
    name: "Inês Carvalho",
    handle: "@inescarvalho",
    initials: "IC",
    avatarBg: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    flag: "🇵🇹",
    location: "Lisboa · Público AO",
    topCreator: true,
    verified: true,
    platforms: ["instagram", "tiktok", "youtube"],
    views: "5,1M",
    engagement: "5,9%",
    cpm: "1 600 Kz",
    niches: [
      { label: "UGC & Anúncios", icon: "camera" },
      { label: "Moda & Compras", icon: "bag" },
    ],
    reels: [
      {
        caption: "Como gravo anúncios que vendem",
        tag: "Reels · 0:36",
        views: "2,2M",
        gradient: "linear-gradient(160deg, #321D54 0%, #6B3FB0 48%, #150C24 100%)",
        accent: "#C4B5FD",
      },
      {
        caption: "Antes e depois do produto",
        tag: "TikTok · 0:24",
        views: "1,8M",
        gradient: "linear-gradient(160deg, #1E3B4A 0%, #38728F 48%, #0C1921 100%)",
        accent: "#7DD3FC",
      },
      {
        caption: "3 ganchos para os primeiros 3s",
        tag: "Shorts · 0:41",
        views: "1,1M",
        gradient: "linear-gradient(160deg, #4A2441 0%, #994686 48%, #210F1D 100%)",
        accent: "#F0ABFC",
      },
    ],
    experiences: [
      { brand: "BAI Directo", monogram: "BD", bg: "linear-gradient(135deg, #2563EB, #1E40AF)", instagram: "2,1M", tiktok: "1,3M" },
      { brand: "Soba", monogram: "SB", bg: "linear-gradient(135deg, #8B5CF6, #6D28D9)", instagram: "840K" },
    ],
    moreExperiences: 4,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 8 },
      { label: "18–24", pct: 39 },
      { label: "25–34", pct: 38 },
      { label: "35–44", pct: 11 },
      { label: "45–54", pct: 3 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 68, male: 26, unknown: 6 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 58 },
      { flag: "🇵🇹", code: "PT", pct: 31 },
      { flag: "🇧🇷", code: "BR", pct: 6 },
    ],
  },
  {
    id: "bruno-domingos",
    name: "Bruno Domingos",
    handle: "@brunodomingos",
    initials: "BD",
    avatarBg: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    flag: "🇦🇴",
    location: "Luanda, AO",
    topCreator: false,
    verified: true,
    platforms: ["tiktok", "instagram"],
    views: "6,2M",
    engagement: "7,6%",
    cpm: "980 Kz",
    niches: [
      { label: "Humor & Cultura", icon: "film" },
      { label: "Música & Eventos", icon: "music" },
    ],
    reels: [
      {
        caption: "Tipos de clientes na segunda-feira",
        tag: "TikTok · 0:27",
        views: "3,1M",
        gradient: "linear-gradient(160deg, #541B1B 0%, #B33939 48%, #210A0A 100%)",
        accent: "#FCA5A5",
      },
      {
        caption: "Quando o salário cai na conta",
        tag: "Reels · 0:19",
        views: "1,9M",
        gradient: "linear-gradient(160deg, #1E2E4A 0%, #3E5D94 48%, #0C1321 100%)",
        accent: "#93C5FD",
      },
      {
        caption: "Reação ao vivo na rua",
        tag: "TikTok · 0:45",
        views: "1,2M",
        gradient: "linear-gradient(160deg, #4A3519 0%, #996E32 48%, #1F160A 100%)",
        accent: "#FDE68A",
      },
    ],
    experiences: [
      { brand: "ZAP Fibra", monogram: "ZF", bg: "linear-gradient(135deg, #3B82F6, #1D4ED8)", instagram: "2,8M", tiktok: "1,9M" },
      { brand: "Multicaixa", monogram: "MC", bg: "linear-gradient(135deg, #F59E0B, #D97706)", tiktok: "1,5M" },
    ],
    moreExperiences: 3,
    audienceSource: "Do TikTok · Instagram",
    ages: [
      { label: "13–17", pct: 18 },
      { label: "18–24", pct: 47 },
      { label: "25–34", pct: 25 },
      { label: "35–44", pct: 7 },
      { label: "45–54", pct: 2 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 44, male: 48, unknown: 8 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 84 },
      { flag: "🇵🇹", code: "PT", pct: 9 },
      { flag: "🇲🇿", code: "MZ", pct: 3 },
    ],
  },
  {
    id: "clara-manuel",
    name: "Clara Manuel",
    handle: "@claramanuel",
    initials: "CM",
    avatarBg: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
    flag: "🇦🇴",
    location: "Huambo, AO",
    topCreator: false,
    verified: true,
    platforms: ["instagram", "tiktok"],
    views: "1,9M",
    engagement: "8,7%",
    cpm: "950 Kz",
    niches: [
      { label: "UGC & Reviews", icon: "sparkles" },
      { label: "Casa & Comércio", icon: "bag" },
    ],
    reels: [
      {
        caption: "Testei durante 7 dias — vale a pena?",
        tag: "Reels · 0:38",
        views: "890K",
        gradient: "linear-gradient(160deg, #123D3B 0%, #247D78 48%, #081C1B 100%)",
        accent: "#5EEAD4",
      },
      {
        caption: "Achados por menos de 15 000 Kz",
        tag: "TikTok · 0:30",
        views: "610K",
        gradient: "linear-gradient(160deg, #2D2C52 0%, #5A58A3 48%, #121224 100%)",
        accent: "#A5B4FC",
      },
      {
        caption: "Organização do meu escritório",
        tag: "Reels · 0:26",
        views: "420K",
        gradient: "linear-gradient(160deg, #422F23 0%, #8A6248 48%, #1C130E 100%)",
        accent: "#FED7AA",
      },
    ],
    experiences: [
      { brand: "Kero", monogram: "KR", bg: "linear-gradient(135deg, #F59E0B, #B45309)", instagram: "740K", tiktok: "410K" },
      { brand: "Shoprite AO", monogram: "SR", bg: "linear-gradient(135deg, #EF4444, #DC2626)", platformOnly: "Instagram" },
    ],
    moreExperiences: 1,
    audienceSource: "Do Instagram · TikTok",
    ages: [
      { label: "13–17", pct: 7 },
      { label: "18–24", pct: 37 },
      { label: "25–34", pct: 40 },
      { label: "35–44", pct: 12 },
      { label: "45–54", pct: 3 },
      { label: "55–64", pct: 1 },
      { label: "65+", pct: 0 },
    ],
    gender: { female: 69, male: 25, unknown: 6 },
    countries: [
      { flag: "🇦🇴", code: "AO", pct: 88 },
      { flag: "🇵🇹", code: "PT", pct: 7 },
      { flag: "🇧🇷", code: "BR", pct: 2 },
    ],
  },
];
