import type { BibleBook } from "./types";

type BookSeed = [id: number, name: string, slug: string, abbrev: string, testament: "AT" | "NT", chapters: number];

const BOOKS: BookSeed[] = [
  [1, "Gênesis", "genesis", "Gn", "AT", 50],
  [2, "Êxodo", "exodo", "Êx", "AT", 40],
  [3, "Levítico", "levitico", "Lv", "AT", 27],
  [4, "Números", "numeros", "Nm", "AT", 36],
  [5, "Deuteronômio", "deuteronomio", "Dt", "AT", 34],
  [6, "Josué", "josue", "Js", "AT", 24],
  [7, "Juízes", "juizes", "Jz", "AT", 21],
  [8, "Rute", "rute", "Rt", "AT", 4],
  [9, "1 Samuel", "1-samuel", "1Sm", "AT", 31],
  [10, "2 Samuel", "2-samuel", "2Sm", "AT", 24],
  [11, "1 Reis", "1-reis", "1Rs", "AT", 22],
  [12, "2 Reis", "2-reis", "2Rs", "AT", 25],
  [13, "1 Crônicas", "1-cronicas", "1Cr", "AT", 29],
  [14, "2 Crônicas", "2-cronicas", "2Cr", "AT", 36],
  [15, "Esdras", "esdras", "Ed", "AT", 10],
  [16, "Neemias", "neemias", "Ne", "AT", 13],
  [17, "Ester", "ester", "Et", "AT", 10],
  [18, "Jó", "jo", "Jó", "AT", 42],
  [19, "Salmos", "salmos", "Sl", "AT", 150],
  [20, "Provérbios", "proverbios", "Pv", "AT", 31],
  [21, "Eclesiastes", "eclesiastes", "Ec", "AT", 12],
  [22, "Cânticos", "canticos", "Ct", "AT", 8],
  [23, "Isaías", "isaias", "Is", "AT", 66],
  [24, "Jeremias", "jeremias", "Jr", "AT", 52],
  [25, "Lamentações", "lamentacoes", "Lm", "AT", 5],
  [26, "Ezequiel", "ezequiel", "Ez", "AT", 48],
  [27, "Daniel", "daniel", "Dn", "AT", 12],
  [28, "Oseias", "oseias", "Os", "AT", 14],
  [29, "Joel", "joel", "Jl", "AT", 3],
  [30, "Amós", "amos", "Am", "AT", 9],
  [31, "Obadias", "obadias", "Ob", "AT", 1],
  [32, "Jonas", "jonas", "Jn", "AT", 4],
  [33, "Miqueias", "miqueias", "Mq", "AT", 7],
  [34, "Naum", "naum", "Na", "AT", 3],
  [35, "Habacuque", "habacuque", "Hc", "AT", 3],
  [36, "Sofonias", "sofonias", "Sf", "AT", 3],
  [37, "Ageu", "ageu", "Ag", "AT", 2],
  [38, "Zacarias", "zacarias", "Zc", "AT", 14],
  [39, "Malaquias", "malaquias", "Ml", "AT", 4],
  [40, "Mateus", "mateus", "Mt", "NT", 28],
  [41, "Marcos", "marcos", "Mc", "NT", 16],
  [42, "Lucas", "lucas", "Lc", "NT", 24],
  [43, "João", "joao", "Jo", "NT", 21],
  [44, "Atos", "atos", "At", "NT", 28],
  [45, "Romanos", "romanos", "Rm", "NT", 16],
  [46, "1 Coríntios", "1-corintios", "1Co", "NT", 16],
  [47, "2 Coríntios", "2-corintios", "2Co", "NT", 13],
  [48, "Gálatas", "galatas", "Gl", "NT", 6],
  [49, "Efésios", "efesios", "Ef", "NT", 6],
  [50, "Filipenses", "filipenses", "Fp", "NT", 4],
  [51, "Colossenses", "colossenses", "Cl", "NT", 4],
  [52, "1 Tessalonicenses", "1-tessalonicenses", "1Ts", "NT", 5],
  [53, "2 Tessalonicenses", "2-tessalonicenses", "2Ts", "NT", 3],
  [54, "1 Timóteo", "1-timoteo", "1Tm", "NT", 6],
  [55, "2 Timóteo", "2-timoteo", "2Tm", "NT", 4],
  [56, "Tito", "tito", "Tt", "NT", 3],
  [57, "Filemom", "filemom", "Fm", "NT", 1],
  [58, "Hebreus", "hebreus", "Hb", "NT", 13],
  [59, "Tiago", "tiago", "Tg", "NT", 5],
  [60, "1 Pedro", "1-pedro", "1Pe", "NT", 5],
  [61, "2 Pedro", "2-pedro", "2Pe", "NT", 3],
  [62, "1 João", "1-joao", "1Jo", "NT", 5],
  [63, "2 João", "2-joao", "2Jo", "NT", 1],
  [64, "3 João", "3-joao", "3Jo", "NT", 1],
  [65, "Judas", "judas", "Jd", "NT", 1],
  [66, "Apocalipse", "apocalipse", "Ap", "NT", 22],
];

export const BIBLE_BOOKS: BibleBook[] = BOOKS.map(([id, name, slug, abbrev, testament, chapters]) => ({
  id,
  name,
  slug,
  abbrev,
  testament,
  position: id,
  chapters,
}));

export const BIBLE_BOOK_MAP = new Map(BIBLE_BOOKS.map((book) => [book.slug, book]));
export const BIBLE_BOOK_BY_ID = new Map(BIBLE_BOOKS.map((book) => [book.id, book]));
export const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0);

export const BIBLE_GROUPS: { label: string; testament: "AT" | "NT"; from: number; to: number; description: string }[] = [
  { label: "Pentateuco", testament: "AT", from: 1, to: 5, description: "A criação, o chamado e o êxodo." },
  { label: "Históricos", testament: "AT", from: 6, to: 17, description: "A caminhada de Israel na terra." },
  { label: "Poéticos e sapienciais", testament: "AT", from: 18, to: 22, description: "Oração, lamento e sabedoria." },
  { label: "Profetas maiores", testament: "AT", from: 23, to: 27, description: "A palavra profética em tempos de crise." },
  { label: "Profetas menores", testament: "AT", from: 28, to: 39, description: "Doze vozes de chamado e esperança." },
  { label: "Evangelhos", testament: "NT", from: 40, to: 43, description: "A vida, a morte e a ressurreição de Jesus." },
  { label: "Atos", testament: "NT", from: 44, to: 44, description: "O Espírito e o nascimento da Igreja." },
  { label: "Cartas de Paulo", testament: "NT", from: 45, to: 58, description: "O evangelho aplicado às comunidades." },
  { label: "Cartas gerais", testament: "NT", from: 59, to: 65, description: "Fé, perseverança e vida em comunidade." },
  { label: "Apocalipse", testament: "NT", from: 66, to: 66, description: "A esperança que vence o império." },
];

export function passageHref(passage: string) {
  const book = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length).find((item) => passage.startsWith(item.name));
  if (!book) return "/biblia";
  const rest = passage.slice(book.name.length).trim();
  const chapter = Number.parseInt(rest, 10);
  if (!Number.isFinite(chapter) || chapter < 1) return `/biblia/${book.slug}`;
  return `/biblia/${book.slug}/${Math.min(chapter, book.chapters)}`;
}
