export interface PortableTextMark {
  _type: string;
  _key?: string;
}

export interface PortableTextBlock {
  _type: "block";
  _key?: string;
  style?: "normal" | "h1" | "h2" | "h3";
  markDefs?: Array<{
    _type: string;
    _key?: string;
    size?: string;
  }>;
  children?: Array<{
    _type: "span";
    _key?: string;
    text: string;
    marks?: string[];
  }>;
}

export interface SiteSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  heroImageUrl?: string;
  aboutUsTitle?: string;
  aboutUsText1?: string;
  aboutUsText2?: string;
  aboutUsText3?: string;
  aboutUsImageUrl?: string;
  frontpageAboutSectionPictureUrl?: string;
  ourStory?: PortableTextBlock[];
  process?: PortableTextBlock[];
}
