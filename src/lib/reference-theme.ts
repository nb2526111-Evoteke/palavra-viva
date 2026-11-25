import { findThemeReferences, resolveVerseReference } from "./bible-reference";
import { BIBLE_BOOKS } from "./bible-books";
import { buildGeneratedTheme, type GeneratedThemeContent, type GeneratorEmphasis } from "./theme-generator";

type ReferenceProfile = {
  period: string;
  authorities: string;
  author: string;
  setting: string;
  godTeach: string;
  jesusTeach: string;
  applications: string[];
  practice: string;
  prayer: string;
  crossRefs: string[];
};

const DEFAULT_APPLICATIONS = [
  "Leia a passagem em voz alta e anote uma frase que fale diretamente com a sua vida.",
  "Identifique uma promessa, um mandamento ou um convite no texto e responda de forma concreta.",
  "Compartilhe o que aprendeu com alguém e ore juntos por essa verdade.",
];

const DEFAULT_PRAYER =
  "Senhor, abre os nossos olhos para o que este texto revela sobre ti. Ensina-nos a obedecer com alegria e a viver a tua Palavra no cotidiano. Em nome de Jesus, amém.";

const PROFILES: Record<string, Partial<ReferenceProfile>> = {
  joao: {
    period: "c. 30 d.C. (narrativa); Evangelho escrito no final do século I",
    authorities: "Pôncio Pilatos, Herodes Antipas e as autoridades religiosas de Jerusalém",
    author: "tradição joanina, ligada ao discípulo amado, em Éfeso",
    setting:
      "O Evangelho de João foi escrito para que as pessoas creiam que Jesus é o Cristo, o Filho de Deus, e tenham vida em seu nome (Jo 20:31).",
    godTeach: "Deus é o Pai que envia o Filho, prepara lugar para os seus e sustenta a fé do povo.",
    jesusTeach: "Jesus é o Verbo encarnado, o caminho para o Pai, que revela o amor e a verdade de Deus.",
    crossRefs: ["João 3:16", "João 14:6", "1 João 1:1-3"],
  },
  salmos: {
    period: "c. 1000–500 a.C.",
    authorities: "Davi, músicos do templo e a comunidade pós-exílica",
    author: "coleção de orações e cânticos de Davi e de outros autores",
    setting:
      "Os Salmos são a oração do povo de Deus em todas as estações: louvor, lamento, confissão, gratidão e esperança.",
    godTeach: "Deus ouve o clamor, é refúgio presente e sustenta o seu povo com misericórdia.",
    jesusTeach: "Jesus ora com os Salmos e cumpre neles a história do justo sofredor e do Rei prometido.",
    crossRefs: ["Salmos 23:1-4", "Salmos 46:1-3", "Salmos 121:1-4"],
  },
  mateus: {
    period: "c. 30 d.C. (narrativa); Evangelho escrito no final do século I",
    authorities: "Herodes Antipas, Pôncio Pilatos e as autoridades de Jerusalém",
    author: "tradição atribuída a Mateus, o publicano",
    setting:
      "Mateus apresenta Jesus como o Messias prometido, o novo Moisés e o Rei do Reino de Deus, em diálogo com a Escritura de Israel.",
    godTeach: "Deus cumpre as promessas feitas aos pais e chama seu povo a uma justiça maior que a aparência religiosa.",
    jesusTeach: "Jesus é o Emanuel, o Rei que ensina, serve e dá a vida pelo seu povo.",
    crossRefs: ["Mateus 1:20-23", "Mateus 5:3-10", "Mateus 28:18-20"],
  },
  marcos: {
    period: "c. 27–30 d.C. (narrativa); Evangelho escrito c. 60–70 d.C.",
    authorities: "Herodes Antipas, Pôncio Pilatos e o Sinédrio",
    author: "tradição atribuída a João Marcos, ligado a Pedro",
    setting:
      "Marcos escreve um Evangelho rápido e intenso, mostrando Jesus como o Servo que sofre e o Filho de Deus.",
    godTeach: "Deus inaugura seu Reino em Jesus e chama à fé, ao arrependimento e à obediência.",
    jesusTeach: "Jesus é o Filho de Deus que serve, sofre e entrega a vida como resgate por muitos.",
    crossRefs: ["Marcos 1:14-15", "Marcos 10:42-45", "Marcos 15:37-39"],
  },
  lucas: {
    period: "c. 27–30 d.C. (narrativa); Evangelho escrito c. 60–80 d.C.",
    authorities: "Herodes Antipas, Pôncio Pilatos e as autoridades de Jerusalém",
    author: "Lucas, médico e companheiro de Paulo",
    setting:
      "Lucas escreve para Teófilo e para os gentios, destacando a compaixão de Jesus pelos pobres, pecadores e excluídos.",
    godTeach: "Deus manifesta sua salvação a todos os povos e se alegra quando o perdido é encontrado.",
    jesusTeach: "Jesus é o Salvador que busca os perdidos, acolhe os pequenos e abre o Reino a todas as nações.",
    crossRefs: ["Lucas 4:16-21", "Lucas 15:17-24", "Lucas 24:25-27"],
  },
  atos: {
    period: "c. 30–62 d.C.",
    authorities: "Pôncio Pilatos, Herodes Agripa, autoridades romanas e o Sinédrio",
    author: "Lucas, autor do terceiro Evangelho",
    setting:
      "Atos continua a obra de Jesus pelo Espírito Santo, mostrando o evangelho avançando de Jerusalém até Roma.",
    godTeach: "Deus cumpre a promessa do Espírito e conduz a missão mesmo em meio à perseguição.",
    jesusTeach: "O Cristo ressurreto reina e envia sua igreja como testemunha até os confins da terra.",
    crossRefs: ["Atos 1:8", "Atos 2:38-42", "Atos 4:8-12"],
  },
  romanos: {
    period: "c. 57 d.C.",
    authorities: "Igreja em Roma sob a sombra do Império Romano",
    author: "Paulo, apóstolo dos gentios",
    setting:
      "Paulo expõe o evangelho de forma sistemática: culpa universal, justificação pela fé, vida no Espírito e vida em comunidade.",
    godTeach: "Deus justifica o pecador pela fé em Cristo e transforma sua vida pelo Espírito.",
    jesusTeach: "Jesus é o novo Adão, o justo que obedece até a morte e abre caminho para a vida.",
    crossRefs: ["Romanos 3:21-24", "Romanos 5:1-5", "Romanos 8:1-4"],
  },
  "1-corintios": {
    period: "c. 55 d.C.",
    authorities: "Comunidade cristã em Corinto, cidade grega e comercial",
    author: "Paulo, com Sóstenes",
    setting:
      "Paulo corrige divisões, imoralidade e desordem no culto, chamando a igreja a viver o evangelho na vida comum.",
    godTeach: "Deus chama uma comunidade imperfeita a ser santa, unida e edificada pelo amor.",
    jesusTeach: "Jesus crucificado é o poder e a sabedoria de Deus, e sua ressurreição sustenta a fé.",
    crossRefs: ["1 Coríntios 1:22-24", "1 Coríntios 12:4-7", "1 Coríntios 15:3-4"],
  },
  "2-corintios": {
    period: "c. 55–57 d.C.",
    authorities: "Comunidade de Corinto e o Império Romano",
    author: "Paulo",
    setting:
      "Paulo defende seu ministério e mostra que a força de Deus se manifesta na fraqueza.",
    godTeach: "Deus consola os aflitos e transforma sofrimento em consolo para outros.",
    jesusTeach: "Jesus se fez pobre para enriquecer seu povo e revela o poder de Deus na cruz.",
    crossRefs: ["2 Coríntios 1:3-5", "2 Coríntios 5:17-21", "2 Coríntios 12:9-10"],
  },
  galatas: {
    period: "c. 48–55 d.C.",
    authorities: "Comunidades da Galácia e os judaizantes",
    author: "Paulo",
    setting:
      "Paulo confronta a ideia de que a salvação depende de obras da lei e defende a justificação pela fé.",
    godTeach: "Deus justifica pela fé e dá o Espírito, libertando do jugo da lei como meio de salvação.",
    jesusTeach: "Jesus nos libertou para a liberdade e nos chama a viver pelo Espírito.",
    crossRefs: ["Gálatas 2:16-21", "Gálatas 3:13-14", "Gálatas 5:13-14"],
  },
  efesios: {
    period: "c. 60–62 d.C.",
    authorities: "Cristãos em Éfeso, centro religioso e comercial",
    author: "Paulo, provavelmente na prisão",
    setting:
      "Paulo descreve a igreja como um só corpo em Cristo e chama os cristãos a andar de modo digno do chamado.",
    godTeach: "Deus une pessoas diferentes em Cristo e as envia a viver em amor, unidade e santidade.",
    jesusTeach: "Jesus é a cabeça da igreja, que reconcilia judeus e gentios em um novo povo.",
    crossRefs: ["Efésios 2:8-10", "Efésios 2:14-18", "Efésios 4:1-3"],
  },
  filipenses: {
    period: "c. 60–62 d.C.",
    authorities: "Igreja de Filipos e a prisão romana de Paulo",
    author: "Paulo e Timóteo",
    setting:
      "Paulo escreve da prisão sobre alegria, humildade e perseverança, agradecendo pela parceria da igreja.",
    godTeach: "Deus sustenta a alegria e a paz em meio à tribulação e chama ao serviço humilde.",
    jesusTeach: "Jesus se humilhou até a morte e foi exaltado, tornando-se o modelo da vida cristã.",
    crossRefs: ["Filipenses 2:5-11", "Filipenses 4:4-7", "Filipenses 4:11-13"],
  },
  colossenses: {
    period: "c. 60–62 d.C.",
    authorities: "Igreja de Colossos e as pressões de sincretismo religioso",
    author: "Paulo, na prisão",
    setting:
      "Paulo exalta a supremacia de Cristo diante de filosofias e tradições que diminuíam sua centralidade.",
    godTeach: "Deus já nos transportou para o Reino do seu Filho e chama a uma vida renovada.",
    jesusTeach: "Jesus é a imagem do Deus invisível, o criador e sustentador de todas as coisas.",
    crossRefs: ["Colossenses 1:15-20", "Colossenses 2:6-7", "Colossenses 3:1-3"],
  },
  "1-tessalonicenses": {
    period: "c. 50–51 d.C.",
    authorities: "Igreja de Tessalônica e a expectativa da volta de Cristo",
    author: "Paulo, Silas e Timóteo",
    setting:
      "Paulo escreve a uma igreja jovem e sofredora, consolando-a com a esperança da vinda de Jesus.",
    godTeach: "Deus chama à santidade e consola os enlutados com a promessa do encontro com Cristo.",
    jesusTeach: "Jesus voltará e reunirá seu povo para estar para sempre com o Senhor.",
    crossRefs: ["1 Tessalonicenses 1:9-10", "1 Tessalonicenses 4:13-17", "1 Tessalonicenses 5:1-11"],
  },
  hebreus: {
    period: "c. 60–90 d.C.",
    authorities: "Cristãos de origem judaica enfrentando cansaço e perseguição",
    author: "autor anônimo",
    setting:
      "Hebreus mostra a superioridade de Cristo e chama à perseverança, fixando os olhos em Jesus.",
    godTeach: "Deus falou pelo Filho e abre nova aliança; a perseverança é resposta à sua fidelidade.",
    jesusTeach: "Jesus é o sacerdote perfeito, o sacrifício definitivo e o autor da fé.",
    crossRefs: ["Hebreus 4:14-16", "Hebreus 10:19-25", "Hebreus 12:1-3"],
  },
  tiago: {
    period: "c. 40–60 d.C.",
    authorities: "Cristãos dispersos enfrentando provações",
    author: "Tiago, líder da igreja em Jerusalém",
    setting:
      "Tiago escreve uma carta prática sobre fé que se prova em ações, no cuidado com os pobres e no controle da língua.",
    godTeach: "Deus dá sabedoria, exige justiça e não abandona os humildes.",
    jesusTeach: "Jesus inspira uma fé que serve, cuida do próximo e transforma o cotidiano.",
    crossRefs: ["Tiago 1:5-8", "Tiago 1:22-25", "Tiago 2:14-17"],
  },
  "1-pedro": {
    period: "c. 60–65 d.C.",
    authorities: "Cristãos dispersos no Império Romano",
    author: "Pedro, apóstolo",
    setting:
      "Pedro escreve a cristãos estrangeiros e sofredores, chamando-os a viver santamente e a manter viva a esperança.",
    godTeach: "Deus guarda sua herança, sustenta no sofrimento e chama à santidade.",
    jesusTeach: "Jesus sofreu em nosso lugar e ressuscitou, abrindo a esperança para os exilados.",
    crossRefs: ["1 Pedro 1:3-9", "1 Pedro 2:21-25", "1 Pedro 5:6-10"],
  },
  "1-joao": {
    period: "c. 90 d.C.",
    authorities: "Comunidades joaninas e os divisionismos judaizantes",
    author: "João, o discípulo amado",
    setting:
      "João escreve para confirmar a comunidade na vida eterna, no amor e na verdade sobre Jesus.",
    godTeach: "Deus é amor, perdoa pecados e chama à comunhão com ele e com os irmãos.",
    jesusTeach: "Jesus é o Filho de Deus que veio em carne e ofereceu sua vida por nós.",
    crossRefs: ["1 João 1:7-9", "1 João 3:1-3", "1 João 4:9-12"],
  },
  apocalipse: {
    period: "c. 90–95 d.C.",
    authorities: "Imperador Domiciano e os impérios que perseguem",
    author: "João, exilado em Patmos",
    setting:
      "Apocalipse consola igrejas sob perseguição com visões do Cristo reinante e da vitória final de Deus.",
    godTeach: "Deus reina, julgará o mal e habitará para sempre com seu povo.",
    jesusTeach: "Jesus é o Cordeiro vitorioso, o Rei dos reis que enxuga toda lágrima.",
    crossRefs: ["Apocalipse 1:17-18", "Apocalipse 5:9-10", "Apocalipse 21:3-5"],
  },
  genesis: {
    period: "das origens até c. 1800 a.C.",
    authorities: "patriarcas, faraós egípcios e povos do antigo Oriente Próximo",
    author: "tradição mosaica",
    setting:
      "Gênesis apresenta a criação, a queda, o dilúvio e a história dos patriarcas, formando o início do povo de Deus.",
    godTeach: "Deus cria, escolhe, promete e permanece fiel mesmo quando seu povo falha.",
    jesusTeach: "Jesus é o descendente de Abraão em quem todas as famílias da terra são abençoadas.",
    crossRefs: ["Gênesis 12:1-3", "Gênesis 15:1-6", "Gálatas 3:16"],
  },
  exodo: {
    period: "c. 1440–1250 a.C.",
    authorities: "Faraó do Egito e Moisés",
    author: "tradição mosaica",
    setting:
      "Deus liberta Israel da escravidão, firma a aliança no Sinai e caminha com o povo no deserto.",
    godTeach: "Deus vê o clamor, liberta da opressão e chama seu povo à obediência amorosa.",
    jesusTeach: "Jesus inaugura o novo êxodo, libertando da escravidão do pecado.",
    crossRefs: ["Êxodo 12:1-14", "Êxodo 20:1-6", "Lucas 22:14-20"],
  },
  deuteronomio: {
    period: "c. 1400 a.C. (discurso final de Moisés)",
    authorities: "Moisés, povo de Israel na planície de Moabe",
    author: "tradição mosaica",
    setting:
      "Moisés se despede, renova a aliança e chama a geração que entrará na terra a amar e obedecer ao Senhor.",
    godTeach: "Deus merece amor total, obediência e memória; a bênção e a vida estão em segui-lo.",
    jesusTeach: "Jesus resume a lei no amor a Deus e ao próximo e cumpre a aliança.",
    crossRefs: ["Deuteronômio 6:4-9", "Deuteronômio 30:15-20", "Marcos 12:28-31"],
  },
  isaias: {
    period: "c. 740–680 a.C. (e profetas posteriores)",
    authorities: "Reis de Judá e a Assíria",
    author: "Isaías, profeta em Jerusalém",
    setting:
      "Isaías anuncia juízo e consolação, a santidade de Deus e a vinda do Servo que salvará as nações.",
    godTeach: "Deus é santo, fiel e salva; seu plano abrange todas as nações.",
    jesusTeach: "Jesus é o Servo sofredor e o Menino prometido, luz para os gentios.",
    crossRefs: ["Isaías 6:1-8", "Isaías 40:28-31", "Isaías 53:4-6"],
  },
  jeremias: {
    period: "c. 627–586 a.C.",
    authorities: "Reis de Judá, Babilônia e o Egito",
    author: "Jeremias, profeta em Jerusalém",
    setting:
      "Jeremias chama Judá ao arrependimento diante do exílio babilônico e anuncia a nova aliança.",
    godTeach: "Deus disciplina, mas não abandona; ele promete um coração novo e uma aliança nova.",
    jesusTeach: "Jesus inaugura a nova aliança pelo seu sangue e escreve a lei no coração.",
    crossRefs: ["Jeremias 29:11-13", "Jeremias 31:31-34", "Lucas 22:20"],
  },
  miqueias: {
    period: "c. 740–690 a.C.",
    authorities: "Reis de Judá e a ameaça assíria",
    author: "Miqueias, profeta de Moresete",
    setting:
      "Miqueias denuncia injustiça e religião vazia, anunciando o pastor que virá de Belém.",
    godTeach: "Deus exige justiça, misericórdia e humildade, e perdoa o seu povo.",
    jesusTeach: "Jesus nasce em Belém e encarna a justiça e a misericórdia anunciadas.",
    crossRefs: ["Miqueias 5:2", "Miqueias 6:8", "Mateus 2:4-6"],
  },
};

const PASSAGE_PROFILES: Record<string, Partial<ReferenceProfile>> = {
  "joao-14": {
    period: "c. 30 d.C., na noite da última ceia",
    authorities: "Pôncio Pilatos, Herodes Antipas e as autoridades religiosas de Jerusalém",
    setting:
      "Jesus está reunido com os discípulos no cenáculo, na noite em que seria traído. Ele acaba de anunciar sua partida, e os discípulos estão perturbados. No discurso de despedida, ele os convida a crer, promete um lugar na casa do Pai e diz que voltará.",
    godTeach:
      "Deus é o Pai que prepara lugar para os seus, sustenta a fé dos discípulos e os recebe em sua casa. A promessa não depende do desempenho deles, mas da fidelidade do Filho.",
    jesusTeach:
      "Jesus é o caminho para o Pai. Ele vai preparar lugar, voltará para buscar os seus e não os deixará órfãos. A sua partida não é abandono: é o caminho para a comunhão plena.",
    crossRefs: [
      "João 14:6",
      "João 14:18-20",
      "João 14:27-28",
      "1 Tessalonicenses 4:16-17",
      "Apocalipse 21:3-4",
    ],
    applications: [
      "Entregue a Deus o que tem turbado o seu coração e descanse na promessa de que Jesus prepara lugar.",
      "Não confunda a ausência momentânea com abandono: reafirme sua confiança na volta de Cristo.",
      "Console alguém que sente que perdeu o chão, apontando para a esperança da casa do Pai.",
    ],
    practice: "Reserve cinco minutos hoje para ler João 14:1-3 devagar e nomear uma preocupação que você vai entregar a Jesus.",
    prayer:
      "Pai, obrigado pelas moradas que preparas. Acalma o nosso coração, fortalece a nossa fé e mantém viva em nós a esperança da volta de Jesus. Em nome dele, amém.",
  },
};

export function getBookProfile(bookSlug: string): ReferenceProfile {
  const book = BIBLE_BOOKS.find((item) => item.slug === bookSlug);
  const profile = PROFILES[bookSlug] ?? {};
  return {
    period: profile.period ?? "Período do livro",
    authorities: profile.authorities ?? "Contexto histórico do livro",
    author: profile.author ?? `O livro de ${book?.name ?? "Bíblia"} faz parte da revelação bíblica.`,
    setting:
      profile.setting ??
      `A passagem está em ${book?.name ?? "um livro da Bíblia"} e deve ser lida observando quem fala, a quem se dirige e qual promessa ou chamado está em jogo.`,
    godTeach:
      profile.godTeach ??
      "O texto revela o caráter de Deus e chama o leitor a responder com fé e obediência.",
    jesusTeach:
      profile.jesusTeach ??
      "Toda a Escritura aponta para Jesus, em quem Deus cumpre suas promessas e revela sua salvação.",
    applications: profile.applications ?? DEFAULT_APPLICATIONS,
    practice: profile.practice ?? "Leia a passagem novamente e escreva uma resposta concreta de fé para hoje.",
    prayer: profile.prayer ?? DEFAULT_PRAYER,
    crossRefs: profile.crossRefs ?? [],
  };
}

function normalizeEmphasis(value: string | undefined): GeneratorEmphasis {
  return value === "deus" || value === "jesus" || value === "livre" ? value : "ambos";
}

function emphasisLabel(emphasis: GeneratorEmphasis) {
  return emphasis === "deus"
    ? "Ensino de Deus"
    : emphasis === "jesus"
      ? "Ensino de Jesus"
      : emphasis === "livre"
        ? "Livre / editável"
        : "Deus e Jesus";
}

function cleanThemeTitle(title: string, bookName: string) {
  const index = title.lastIndexOf(bookName);
  if (index <= 0) return title.trim();
  return title
    .slice(0, index)
    .replace(/[\s—–:-]+$/, "")
    .trim();
}

export async function buildReferenceTheme(input: {
  title: string;
  references: string[];
  emphasis?: string;
  audience?: string;
}): Promise<GeneratedThemeContent | null> {
  const resolved = (await Promise.all(input.references.map(resolveVerseReference))).filter(
    (reference) => reference.found,
  );
  if (resolved.length === 0) return null;

  const primary = resolved[0];
  const book = BIBLE_BOOKS.find((item) => item.slug === primary.bookSlug);
  const passageKey = `${primary.bookSlug}-${primary.chapter}`;
  const profile: Partial<ReferenceProfile> = {
    ...(book ? PROFILES[book.slug] : {}),
    ...(PASSAGE_PROFILES[passageKey] ?? {}),
  };
  const emphasis = normalizeEmphasis(input.emphasis);
  const audience = input.audience?.trim() || "Estudo personalizado";
  const applications = profile.applications ?? DEFAULT_APPLICATIONS;
  const prayer = profile.prayer ?? DEFAULT_PRAYER;
  const practice =
    profile.practice ??
    "Leia a passagem mais uma vez e escreva uma resposta concreta de fé para hoje.";
  const crossRefs = (profile.crossRefs ?? []).filter(
    (reference) => !resolved.some((item) => item.reference === reference),
  );
  const allReferences = [
    ...resolved,
    ...(await Promise.all(crossRefs.map(resolveVerseReference))).filter((reference) => reference.found),
  ];

  const bookName = primary.bookName || book?.name || "a Bíblia";
  const cleanTitle = cleanThemeTitle(input.title, bookName) || `Estudo de ${primary.reference}`;
  const quotedText = resolved
    .map((reference) => `“${reference.text}” (${reference.reference})`)
    .join("\n\n");

  const godTeaching =
    profile.godTeach ||
    `Em ${primary.reference}, o texto revela o caráter de Deus e convida o leitor a responder com fé e obediência.`;
  const jesusTeaching =
    profile.jesusTeach ||
    `A passagem de ${primary.reference} deve ser lida à luz de Jesus, em quem Deus cumpre suas promessas e revela sua salvação.`;

  const context = [
    `Passagem central: ${resolved.map((reference) => reference.reference).join("; ")}. ${
      profile.period ? `Período: ${profile.period}.` : ""
    }`,
    profile.setting ||
      `${primary.reference} está em ${bookName}. Observe quem fala, a quem se dirige e qual promessa, mandamento ou chamado está em jogo.`,
    profile.author
      ? `O livro de ${bookName}: ${profile.author}.`
      : `O livro de ${bookName} faz parte da história da revelação bíblica e deve ser lido em diálogo com toda a Escritura.`,
  ];

  const godParagraphs = [godTeaching];
  const jesusParagraphs = [jesusTeaching];
  const outline = [
    {
      title: "A passagem e seu contexto",
      body: context[1],
      references: resolved.map((reference) => reference.reference),
    },
    {
      title: "O que o texto diz",
      body: `O texto lido diz: ${quotedText}`.slice(0, 1200),
      references: resolved.map((reference) => reference.reference),
    },
    {
      title: "O que Deus ensinou",
      body: godTeaching,
      references: [primary.reference, ...crossRefs.slice(0, 1)],
    },
    {
      title: "O que Jesus revelou",
      body: jesusTeaching,
      references: [primary.reference, ...crossRefs.slice(1, 2)],
    },
    {
      title: "A resposta da fé",
      body: applications[0] ?? DEFAULT_APPLICATIONS[0],
      references: crossRefs.slice(2).length > 0 ? crossRefs.slice(2) : [primary.reference],
    },
  ];

  const dailyMessage = {
    title: cleanTitle,
    reference: primary.reference,
    verseText: primary.text,
    href: primary.href,
    body: [
      `A Palavra de Deus fala ao coração quando lemos ${primary.reference} com atenção.`,
      quotedText.slice(0, 900),
      profile.godTeach || godTeaching,
    ],
    practice,
    prayer,
  };

  return {
    title: input.title.trim() || cleanTitle,
    subtitle: `Um estudo a partir de ${resolved.map((reference) => reference.reference).join("; ")}, com contexto histórico, o ensino de Deus e a voz de Jesus.`,
    themeSlug: "passagem",
    themeName: "Estudo por passagem",
    narrativeSlug: `passagem-${primary.bookSlug}-${primary.chapter}`,
    narrativeName: resolved.map((reference) => reference.reference).join("; "),
    emphasis,
    emphasisLabel: emphasisLabel(emphasis),
    audience,
    period: profile.period ?? "Período do livro",
    king: profile.authorities ?? "Contexto do livro",
    generatedAt: new Date().toISOString(),
    historicalContext: context,
    contextReferences: resolved.map((reference) => reference.reference),
    narrative: [
      `O texto de ${resolved.map((reference) => reference.reference).join("; ")} diz: ${quotedText}`,
      profile.setting ||
        `A passagem está inserida em ${bookName} e deve ser lida no seu contexto literário e histórico.`,
    ],
    narrativeReferences: resolved.map((reference) => reference.reference),
    god: {
      paragraphs: godParagraphs,
      references: [primary.reference, ...crossRefs.slice(0, 1)],
    },
    jesus: {
      paragraphs: jesusParagraphs,
      references: [primary.reference, ...crossRefs.slice(1, 2)],
    },
    outline,
    applications,
    prayer,
    references: allReferences,
    dailyMessage,
  };
}

export async function buildThemeForInput(input: {
  themeSlug?: string;
  narrativeSlug?: string;
  emphasis?: string;
  audience?: string;
  customTitle?: string;
}): Promise<GeneratedThemeContent> {
  const title = input.customTitle?.trim() || "";
  const references = title ? findThemeReferences(title) : [];
  if (references.length > 0) {
    const referenceTheme = await buildReferenceTheme({
      title,
      references,
      emphasis: input.emphasis,
      audience: input.audience,
    });
    if (referenceTheme) return referenceTheme;
  }
  return buildGeneratedTheme(input);
}
