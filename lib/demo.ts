export type ArtworkStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "NOT FOR SALE";
export type SizeClass = "STUDY" | "MEDIUM" | "LARGE";

export type Artwork = {
  id: string;
  title: string;
  slug: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number | null;
  status: ArtworkStatus;
  collection: string;
  description: string;
  artistNote: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
  sizeClass: SizeClass;
  seed: number;
  imageData?: string;
  detailImages?: string[];
  updatedAt: number;
};

export type Exhibition = {
  id: string;
  title: string;
  venue: string;
  city: string;
  openingDate: string;
  closingDate: string;
  privateView: string;
  description: string;
  worksIncluded: string[];
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  artworkId?: string;
  artworkTitle: string;
  message: string;
  preferredContact: string;
  createdAt: number;
  status: "NEW" | "RESPONDED" | "ARCHIVED";
};

export type Profile = {
  artistName: string;
  shortBio: string;
  longBio: string;
  studioLocation: string;
  contactEmail: string;
  instagram: string;
  commissionAvailability: string;
};

export type DemoState = {
  artworks: Artwork[];
  exhibitions: Exhibition[];
  enquiries: Enquiry[];
  profile: Profile;
  expiresAt: number;
};

export const collectionCopy: Record<string, { name: string; intro: string }> = {
  tidal: {
    name: "TIDAL",
    intro: "Paintings developed from repeated walks along exposed coastal edges — shifting light, salt weather and water moving across stone."
  },
  "winter-ground": {
    name: "WINTER GROUND",
    intro: "Fields, moorland and distant ridges reduced to winter structure, pale light and the marks left after hard weather."
  },
  "after-rain": {
    name: "AFTER RAIN",
    intro: "Wet roads, broken cloud and saturated ground — paintings about the brief intensity that arrives when weather begins to clear."
  }
};

const now = Date.now();
const art = (
  n: number,
  title: string,
  collection: string,
  status: ArtworkStatus,
  price: number,
  aspect: Artwork["aspect"],
  medium: string,
  dimensions: string,
  sizeClass: SizeClass,
  description: string
): Artwork => ({
  id: `art-${String(n).padStart(2, "0")}`,
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  year: n > 18 ? 2025 : 2026,
  medium,
  dimensions,
  price,
  status,
  collection,
  description,
  artistNote: "Built from field notes and small colour studies, then reworked in the studio until the place becomes atmosphere rather than description.",
  alt: `Abstract landscape painting titled ${title}`,
  aspect,
  sizeClass,
  seed: n,
  updatedAt: now - n * 3600000
});

export const initialArtworks: Artwork[] = [
  art(1, "Winter Edge", "tidal", "AVAILABLE", 1850, "portrait", "Oil on linen", "100 × 80 cm", "LARGE", "A low winter horizon built through thin layers, erased marks and heavier passages of grey-green paint."),
  art(2, "Low Tide", "tidal", "AVAILABLE", 1450, "landscape", "Oil on linen", "80 × 110 cm", "LARGE", "A receding line of water and exposed stone held beneath a pale, salt-heavy sky."),
  art(3, "After Rain", "after-rain", "AVAILABLE", 1250, "square", "Oil on panel", "70 × 70 cm", "MEDIUM", "Dark ground gives way to a sudden opening of light after rain."),
  art(4, "Salt Line", "tidal", "AVAILABLE", 980, "landscape", "Mixed media on panel", "55 × 75 cm", "MEDIUM", "Scraped surface, chalky marks and a narrow sea horizon compress a long coastal walk into one image."),
  art(5, "Last Light", "after-rain", "AVAILABLE", 2100, "portrait", "Oil on linen", "120 × 90 cm", "LARGE", "The final warmth of the day sits against a cooler, unsettled field of weather."),
  art(6, "Grey Water", "tidal", "AVAILABLE", 850, "square", "Oil on panel", "50 × 50 cm", "STUDY", "A compact study of water, stone and almost colourless winter light."),
  art(7, "North Field", "winter-ground", "AVAILABLE", 1650, "landscape", "Oil on linen", "80 × 120 cm", "LARGE", "A broad winter field reduced to horizon, cold green and the memory of hedgerow structure."),
  art(8, "Break in Weather", "after-rain", "RESERVED", 1350, "portrait", "Oil on linen", "90 × 70 cm", "MEDIUM", "Cloud begins to split above wet land, catching short fragments of brightness."),
  art(9, "Edge Study", "tidal", "RESERVED", 620, "portrait", "Oil on paper", "42 × 30 cm", "STUDY", "A small study from the edge of the coast where rock, path and sea briefly align."),
  art(10, "Tidal Ground", "tidal", "RESERVED", 1550, "square", "Mixed media on linen", "80 × 80 cm", "MEDIUM", "Built-up mineral surface suggests water passing repeatedly over exposed ground."),
  art(11, "November Coast", "tidal", "RESERVED", 1950, "landscape", "Oil on linen", "90 × 130 cm", "LARGE", "A dark November sea held beneath a narrow strip of thinning cloud."),
  art(12, "Open Weather", "after-rain", "SOLD", 1180, "landscape", "Oil on panel", "65 × 90 cm", "MEDIUM", "A fast-moving sky and wet verge painted with open, interrupted marks."),
  art(13, "Winter Distance", "winter-ground", "SOLD", 1750, "landscape", "Oil on linen", "85 × 120 cm", "LARGE", "Distant hills dissolve into cold atmosphere beyond a stripped winter field."),
  art(14, "Incoming Rain", "after-rain", "SOLD", 1280, "portrait", "Oil on linen", "90 × 65 cm", "MEDIUM", "A vertical sweep of weather crossing open land before the first rain arrives."),
  art(15, "Moor Edge", "winter-ground", "SOLD", 2200, "landscape", "Oil on linen", "100 × 140 cm", "LARGE", "Moorland darkens into a broken edge against a wide, low-pressure sky."),
  art(16, "Field After Storm", "after-rain", "SOLD", 1120, "square", "Mixed media on panel", "65 × 65 cm", "MEDIUM", "Flattened grass and pooled colour reconstruct the field after heavy weather."),
  art(17, "Cold Light", "winter-ground", "SOLD", 760, "portrait", "Oil on paper", "50 × 35 cm", "STUDY", "A small winter study in blue-grey, chalk and restrained ochre."),
  art(18, "Estuary Study", "tidal", "SOLD", 690, "landscape", "Oil on paper", "35 × 50 cm", "STUDY", "A quick estuary study holding mudflat, water and sky in compressed horizontal bands."),
  art(19, "Hedgerow Weather", "winter-ground", "SOLD", 980, "square", "Oil on panel", "55 × 55 cm", "MEDIUM", "Winter hedgerows become a dark rhythmic structure beneath moving cloud."),
  art(20, "Rain Beyond the Ridge", "after-rain", "SOLD", 1480, "landscape", "Oil on linen", "70 × 105 cm", "MEDIUM", "A distant curtain of rain gathers beyond a ridge while the foreground remains briefly bright."),
  art(21, "White Sea", "tidal", "SOLD", 2350, "portrait", "Oil on linen", "130 × 95 cm", "LARGE", "Pale water, blown spray and softened horizon merge into a near-monochrome surface."),
  art(22, "Stone After Frost", "winter-ground", "SOLD", 890, "square", "Mixed media on panel", "50 × 50 cm", "STUDY", "Frosted stone and dark soil are reduced to layered surface and small temperature shifts.")
];

export const initialExhibitions: Exhibition[] = [
  {
    id: "ex-1",
    title: "Weather / Edge",
    venue: "Northlight Rooms",
    city: "Whitby",
    openingDate: "2026-11-06",
    closingDate: "2026-11-29",
    privateView: "2026-11-05",
    description: "A fictional demonstration exhibition bringing together recent coastal and moorland paintings.",
    worksIncluded: ["art-01", "art-02", "art-05", "art-11"]
  },
  {
    id: "ex-2",
    title: "After the Storm",
    venue: "Foundry Project Space",
    city: "Sheffield",
    openingDate: "2027-02-12",
    closingDate: "2027-03-07",
    privateView: "2027-02-11",
    description: "A fictional demonstration exhibition focused on the After Rain collection.",
    worksIncluded: ["art-03", "art-08", "art-14", "art-16"]
  }
];

export const initialProfile: Profile = {
  artistName: "Mara Ellison",
  shortBio: "Contemporary painter working from the Yorkshire coast, moorland and the unstable light of changing weather.",
  longBio: "The paintings begin with repeated walks through exposed landscapes — coast, moor and agricultural edges where weather constantly changes what is visible. Back in the studio, those observations are reduced and rebuilt through colour, surface and interruption.",
  studioLocation: "Yorkshire, UK",
  contactEmail: "studio@maraellison.example",
  instagram: "@maraellisonstudio",
  commissionAvailability: "Selected commissions considered for 2027."
};

export function freshState(): DemoState {
  return {
    artworks: initialArtworks.map((item) => ({ ...item })),
    exhibitions: initialExhibitions.map((item) => ({ ...item, worksIncluded: [...item.worksIncluded] })),
    enquiries: [],
    profile: { ...initialProfile },
    expiresAt: Date.now() + 12 * 60 * 60 * 1000
  };
}

export function money(value: number | null) {
  if (value === null) return "Price on request";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
}
