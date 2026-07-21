// Shape of the flexible landing-page content stored on Product.content (JSON).

export type IconText = { icon: string; text: string };
export type EmojiLabel = { emoji: string; label: string };
export type Feature = { title: string; desc: string };
export type Benefit = { icon: string; title: string; desc: string };
export type Ingredient = { emoji: string; name: string; en?: string; desc: string };
export type Step = { title: string; desc: string };
export type WhyCard = { icon: string; title: string; desc: string };
export type Faq = { q: string; a: string };

export type ProductContent = {
  topbar?: string[];
  problem?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    quote?: string;
    paragraph?: string;
    items?: IconText[];
    cards?: EmojiLabel[];
  };
  solution?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    heading?: string;
    paragraph?: string;
    features?: Feature[];
  };
  benefits?: { eyebrow?: string; title?: string; subtitle?: string; items?: Benefit[] };
  ingredients?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    items?: Ingredient[];
  };
  steps?: { eyebrow?: string; title?: string; subtitle?: string; items?: Step[] };
  whyus?: { eyebrow?: string; title?: string; subtitle?: string; items?: WhyCard[] };
  faq?: { eyebrow?: string; title?: string; subtitle?: string; items?: Faq[] };
  trustPills?: string[];
  guarantee?: string;
};

export function getContent(raw: unknown): ProductContent {
  if (!raw || typeof raw !== "object") return {};
  return raw as ProductContent;
}
