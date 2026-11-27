export type NicheIconKey = "film" | "money" | "bag" | "phone" | "heart" | "camera" | "music" | "sparkles";
export type DiscoverCategory = "criadores" | "influenciadores";

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
  regionKey: string;
  categories: DiscoverCategory[];
  topCreator: boolean;
  verified: boolean;
  rating?: number;
  reviewsCount?: number;
  newToNuvi?: string;
  platforms: ("instagram" | "tiktok" | "youtube")[];
  views: string;
  viewsNum: number;
  engagement: string;
  engagementNum: number;
  cpm: string;
  cpmNum: number;
  niches: { label: string; icon: NicheIconKey }[];
  reels: [CreatorReel, CreatorReel, CreatorReel];
  experiences: CreatorExperience[];
  moreExperiences: number;
  audienceSource: string;
  ages: { label: string; pct: number }[];
  gender: { female: number; male: number; unknown: number };
  countries: { flag: string; code: string; pct: number }[];
}

/** Sem criadores mockados — será preenchido quando houver criadores reais na base de dados. */
export const ALL_CREATORS: CreatorProfile[] = [];

/** Top criadores usados na seleção pós-onboarding. */
export const TOP_CREATORS: CreatorProfile[] = [];
