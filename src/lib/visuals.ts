export const CATEGORY_IMAGES: Record<string, string> = {
  devocionais: "/images/temas/devocionais.jpg",
  "estudos-biblicos": "/images/temas/estudos-biblicos.jpg",
  familia: "/images/temas/familia.jpg",
  jovens: "/images/temas/jovens.jpg",
  teologia: "/images/temas/teologia.jpg",
  "vida-crista": "/images/temas/vida-crista.jpg",
};

const TYPE_IMAGES: Record<string, string> = {
  devocional: CATEGORY_IMAGES.devocionais,
  ebook: CATEGORY_IMAGES["estudos-biblicos"],
  estudo: CATEGORY_IMAGES["estudos-biblicos"],
  podcast: CATEGORY_IMAGES["vida-crista"],
};

export function categoryImage(slug?: string | null) {
  if (!slug) return "";
  return CATEGORY_IMAGES[slug] || "";
}

export function libraryImage(type?: string | null, slug?: string | null) {
  const key = (slug || "").toLowerCase();
  if (key.includes("salmo")) return CATEGORY_IMAGES.devocionais;
  if (key.includes("manha")) return CATEGORY_IMAGES.devocionais;
  if (key.includes("profeta")) return CATEGORY_IMAGES.teologia;
  if (key.includes("romano")) return CATEGORY_IMAGES["estudos-biblicos"];
  if (key.includes("grupo")) return CATEGORY_IMAGES.familia;
  if (key.includes("evangelho")) return CATEGORY_IMAGES["vida-crista"];
  return TYPE_IMAGES[type || ""] || CATEGORY_IMAGES["vida-crista"];
}

export function planImage(slug?: string | null) {
  const key = (slug || "").toLowerCase();
  if (key.includes("salmo")) return CATEGORY_IMAGES.devocionais;
  if (key.includes("proverbio")) return CATEGORY_IMAGES.teologia;
  if (key.includes("jesus")) return CATEGORY_IMAGES.devocionais;
  return CATEGORY_IMAGES["estudos-biblicos"];
}
