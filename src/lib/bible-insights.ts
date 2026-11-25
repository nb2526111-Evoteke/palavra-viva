import { getBookProfile } from "./reference-theme";
import type { BibleVerse } from "./types";

type Topic = {
  pattern: RegExp;
  label: string;
  meaning: string;
  reflection: string;
};

const TOPICS: Topic[] = [
  {
    pattern: /\bfe\b|\bconfi\w*|\bcre(ia|u|r|em)\b/,
    label: "fé e confiança",
    meaning: "O texto convida a confiar em Deus e a apoiar a vida naquilo que ele prometeu.",
    reflection: "Em que área você precisa transformar preocupação em confiança?",
  },
  {
    pattern: /\bam(or|ou|em|ar)\b|\bmisericord\w*|\bcompai\w*/,
    label: "amor e misericórdia",
    meaning: "O amor de Deus se manifesta em cuidado concreto e chama o leitor a amar de forma prática.",
    reflection: "Quem precisa experimentar esse amor por meio de uma atitude sua?",
  },
  {
    pattern: /\bmedo\b|\btemor\b|\bansied\w*|\bperturb\w*|\bassust\w*/,
    label: "medo e coragem",
    meaning: "O texto enfrenta o medo com a presença e a palavra de Deus, não com a ausência de dificuldades.",
    reflection: "O que tem roubado a sua paz hoje e como a presença de Deus muda essa situação?",
  },
  {
    pattern: /\borac\w*|\borar\b|\borou\b|\bclam\w*|\bsuplic\w*|\binvoc\w*/,
    label: "oração",
    meaning: "A passagem mostra a oração como diálogo honesto com Deus, que ouve e responde conforme a sua vontade.",
    reflection: "O que você precisa colocar diante de Deus com mais honestidade?",
  },
  {
    pattern: /\bpecad\w*|\btransgress\w*|\biniquidade\b|\bmalign\w*|\bimpied\w*/,
    label: "pecado e necessidade de graça",
    meaning: "O texto expõe a realidade do pecado e mostra que a resposta de Deus passa pela graça e pela transformação.",
    reflection: "Onde você precisa reconhecer sua necessidade da graça de Deus?",
  },
  {
    pattern: /\bperdo\w*|\bremiss\w*|\bapag\w*/,
    label: "perdão",
    meaning: "O perdão aparece como graça que restaura, liberta e chama a uma vida nova.",
    reflection: "Que perdão você precisa receber ou oferecer?",
  },
  {
    pattern: /\bpromess\w*|\balianc\w*|\bjura\w*|\bherdeir\w*/,
    label: "promessa e aliança",
    meaning: "O texto recorda que Deus se compromete com seu povo e permanece fiel àquilo que prometeu.",
    reflection: "Qual promessa de Deus precisa ganhar espaço na sua espera hoje?",
  },
  {
    pattern: /\bsalv\w*|\blibert\w*|\bredim\w*|\bresgat\w*|\blivr\w*/,
    label: "salvação e libertação",
    meaning: "A passagem anuncia que Deus age para libertar e salvar, chamando o seu povo a responder com gratidão.",
    reflection: "De que você precisa ser libertado para caminhar com mais liberdade?",
  },
  {
    pattern: /\breino\b|\breinar\w*|\brei\b|\btrono\b/,
    label: "Reino de Deus",
    meaning: "O texto aponta para o governo de Deus, que transforma a vida presente e aponta para a consumação do seu Reino.",
    reflection: "O que significaria submeter essa área da sua vida ao Reino de Deus?",
  },
  {
    pattern: /\bsabedoria\b|\bentend\w*|\bensina\w*|\binstrui\w*|\bconhec\w*/,
    label: "sabedoria",
    meaning: "A passagem chama a aprender o caminho de Deus e a praticar o que se aprendeu.",
    reflection: "Que verdade você já conhece, mas ainda precisa praticar?",
  },
  {
    pattern: /\bobedec\w*|\bmandament\w*|\bguarda\w*|\bpreceit\w*/,
    label: "obediência",
    meaning: "O texto mostra a obediência como resposta de amor àquele que chamou e libertou.",
    reflection: "Qual passo concreto de obediência você pode dar esta semana?",
  },
  {
    pattern: /\besperanc\w*|\bespera\w*|\baguard\w*|\bmanh\w*/,
    label: "esperança",
    meaning: "A esperança bíblica não ignora a dor, mas se apoia no caráter de Deus e na promessa de restauração.",
    reflection: "Qual motivo de esperança você pode anunciar a alguém hoje?",
  },
  {
    pattern: /\bpaz\b|\bdescans\w*|\brepous\w*|\bsosseg\w*/,
    label: "paz e descanso",
    meaning: "A paz que o texto oferece nasce da presença de Deus e não depende de circunstâncias perfeitas.",
    reflection: "O que você precisa entregar a Deus para experimentar descanso?",
  },
  {
    pattern: /\bjustic\w*|\bjuiz\w*|\bjuizo\b|\bjusto\w*|\boprimid\w*|\bpobre\w*/,
    label: "justiça",
    meaning: "O texto chama a praticar a justiça e a cuidar de quem é vulnerável, refletindo o caráter de Deus.",
    reflection: "Que injustiça próxima você pode ajudar a enfrentar?",
  },
  {
    pattern: /\bespirit\w*|\bconsolador\b/,
    label: "Espírito Santo",
    meaning: "A passagem aponta para a ação do Espírito, que ensina, consola e capacita o povo de Deus.",
    reflection: "Onde você precisa pedir a direção do Espírito Santo?",
  },
  {
    pattern: /\bmort\w*|\bressur\w*|\bvida eterna\b|\bvida\b|\bviv\w*/,
    label: "vida e ressurreição",
    meaning: "O texto coloca a morte e a vida diante da esperança da ressurreição e da fidelidade de Deus.",
    reflection: "Como a esperança da ressurreição muda a forma de enfrentar perdas?",
  },
  {
    pattern: /\blouvor\w*|\badorar\w*|\blouvai\b|\bcantai\b/,
    label: "adoração",
    meaning: "A passagem convida a responder a Deus com louvor, reconhecendo quem ele é e o que ele fez.",
    reflection: "Pelo que você pode louvar a Deus mesmo em um dia difícil?",
  },
  {
    pattern: /\bfamil\w*|\bfilh\w*|\bpai\b|\bmae\b|\birmao\w*/,
    label: "família e relacionamentos",
    meaning: "O texto convida a viver os relacionamentos com amor, honra, paciência e responsabilidade.",
    reflection: "Que relacionamento precisa de um gesto de amor ou reconciliação?",
  },
  {
    pattern: /\bserv\w*|\bdiacon\w*|\bhumild\w*|\bproxim\w*/,
    label: "serviço e humildade",
    meaning: "A passagem aponta para a grandeza do serviço e para o cuidado com o próximo.",
    reflection: "Que serviço concreto você pode oferecer sem buscar reconhecimento?",
  },
  {
    pattern: /\bsofr\w*|\bafli\w*|\btribul\w*|\bchora\w*|\blament\w*/,
    label: "sofrimento e consolo",
    meaning: "O texto não minimiza a dor: ele oferece a presença e o consolo de Deus para atravessá-la.",
    reflection: "Quem precisa da sua presença e oração em um momento de sofrimento?",
  },
];

const CURATED_CHAPTERS: Record<string, string> = {
  "joao-14":
    "No cenáculo, Jesus consola os discípulos diante da sua partida. Ele fala da casa do Pai, do caminho que é ele mesmo, da vinda do Espírito e da paz que o mundo não pode dar.",
  "salmos-23":
    "O salmo apresenta Deus como pastor que guia, sustenta, protege e prepara mesa. A confiança nasce da presença do pastor, inclusive no vale da sombra da morte.",
  "genesis-1":
    "O capítulo abre a Bíblia mostrando Deus como criador soberano. Pela palavra, ele ordena o caos, cria a vida e declara que tudo é bom.",
  "jeremias-29":
    "Jeremias escreve aos exilados na Babilônia, chamando-os a viver com fidelidade no lugar onde estão e a confiar nas promessas de restauração de Deus.",
  "isaias-40":
    "O capítulo consola o povo cansado com a grandeza de Deus. Aquele que criou os confins da terra não se cansa e renova as forças dos que nele esperam.",
};

const CURATED_VERSES: Record<string, { meaning: string; reflection?: string }> = {
  "joao-14-1": {
    meaning:
      "Jesus começa o discurso de despedida chamando os discípulos a não se perturbarem. A fé em Deus e nele é o fundamento para atravessar o medo da separação.",
    reflection: "O que tem perturbado o seu coração e como a fé em Jesus responde a isso?",
  },
  "joao-14-2": {
    meaning:
      "A casa do Pai aponta para a comunhão plena com Deus. Jesus não descreve detalhes arquitetônicos: ele garante que há lugar para os seus e que a promessa é preparada por ele mesmo.",
    reflection: "Como a esperança do lugar preparado por Jesus muda a forma de encarar o presente?",
  },
  "joao-14-3": {
    meaning:
      "A promessa inclui a volta de Jesus e a comunhão definitiva. Ele não apenas prepara um lugar; ele virá buscar os seus para que estejam com ele.",
    reflection: "Qual diferença faz saber que Jesus não abandona os seus, mas promete voltar?",
  },
  "joao-14-6": {
    meaning:
      "Jesus não apresenta um caminho entre vários: ele mesmo é o caminho, a verdade e a vida. O acesso ao Pai passa pela pessoa e pela obra dele.",
    reflection: "Onde você tem procurado caminhos que não passam por Jesus?",
  },
  "salmos-23-1": {
    meaning:
      "Davi usa a imagem do pastor para dizer que Deus cuida, guia e supre o que falta. A confiança não está nas circunstâncias, mas no caráter do pastor.",
    reflection: "Em que área você precisa descansar no cuidado do Bom Pastor?",
  },
  "salmos-23-2": {
    meaning:
      "As águas tranquilas e os pastos verdes descrevem o cuidado que oferece descanso. Deus não apenas conduz; ele também dá espaço para a alma respirar.",
    reflection: "Onde você precisa desacelerar e receber o descanso que Deus oferece?",
  },
  "salmos-23-3": {
    meaning:
      "O pastor restaura a alma e guia pelas veredas da justiça. A direção de Deus não é apenas sobre onde ir, mas sobre como viver.",
    reflection: "Que caminho precisa ser reorientado pela justiça de Deus?",
  },
  "salmos-23-4": {
    meaning:
      "Mesmo no vale da sombra da morte, o salmo não fala de ausência de dor, mas de companhia. O pastor caminha com o seu povo no lugar mais escuro.",
    reflection: "Qual vale você está atravessando e como a presença de Deus se torna real nele?",
  },
  "salmos-23-5": {
    meaning:
      "A imagem muda do pasto para a mesa: Deus prepara um banquete diante dos inimigos e unge a cabeça do seu servo. O cuidado se torna honra e abundância.",
    reflection: "Como reconhecer a generosidade de Deus mesmo em meio a conflitos?",
  },
  "salmos-23-6": {
    meaning:
      "Bondade e misericórdia acompanham o salmista, e a esperança é habitar na casa do Senhor. O cuidado do pastor termina em comunhão duradoura.",
    reflection: "Qual sinal da bondade de Deus você pode reconhecer na sua história?",
  },
  "genesis-1-1": {
    meaning:
      "A Bíblia começa com Deus, não com explicações sobre sua origem. Ele é o criador de tudo, e toda a história posterior depende dessa verdade.",
    reflection: "Como lembrar que Deus é o começo de todas as coisas muda a sua forma de viver?",
  },
  "genesis-1-3": {
    meaning:
      "Deus cria pela sua palavra: o caos recebe ordem e a escuridão recebe luz. A palavra criadora de Deus é poderosa e eficaz.",
    reflection: "Onde você precisa que a luz e a ordem de Deus entrem hoje?",
  },
  "jeremias-29-11": {
    meaning:
      "A promessa de planos de paz é dada a um povo no exílio, não a quem está em conforto. Deus não abandona seu povo e sustenta a esperança no futuro que ele prepara.",
    reflection: "Como confiar nos planos de Deus quando o presente ainda é difícil?",
  },
  "isaias-40-31": {
    meaning:
      "A esperança no Senhor renova as forças de quem está exausto. A promessa não é ausência de cansaço, mas força recebida para continuar caminhando.",
    reflection: "O que você precisa entregar a Deus para experimentar forças renovadas?",
  },
  "josue-1-9": {
    meaning:
      "Deus ordena coragem a Josué com base na sua presença: ele não promete uma tarefa fácil, mas promete caminhar com o líder e com o povo.",
    reflection: "Qual desafio você tem evitado por medo, e como a presença de Deus muda essa decisão?",
  },
  "joao-3-16": {
    meaning:
      "O amor de Deus é a origem da salvação: ele dá o seu Filho para que quem nele crê não pereça, mas tenha vida eterna.",
    reflection: "Como o amor de Deus, e não o medo, tem moldado a sua fé?",
  },
  "romanos-8-28": {
    meaning:
      "A promessa não diz que tudo é bom, mas que Deus age em todas as coisas para o bem daqueles que o amam. O bem final é a conformidade com Cristo.",
    reflection: "Como essa promessa ajuda você a reinterpretar uma situação difícil?",
  },
  "proverbios-3-5": {
    meaning:
      "A confiança de todo o coração contrasta com a dependência do próprio entendimento. A sabedoria começa quando Deus ocupa o centro das decisões.",
    reflection: "Em que decisão você tem confiado apenas no seu próprio entendimento?",
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function topicsIn(text: string) {
  const normalized = normalize(text);
  return TOPICS.filter((topic) => topic.pattern.test(normalized));
}

export function buildChapterInsights(
  bookName: string,
  bookSlug: string,
  chapter: number,
  verses: BibleVerse[],
) {
  const profile = getBookProfile(bookSlug);
  const fullText = verses.map((verse) => verse.text).join(" ");
  const counts = new Map<string, number>();
  for (const topic of topicsIn(fullText)) {
    counts.set(topic.label, (counts.get(topic.label) ?? 0) + 1);
  }
  const themes = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);

  const themeText =
    themes.length > 0
      ? `Entre os temas que aparecem no capítulo estão ${themes.join(", ")}.`
      : "O capítulo desenvolve a história e o ensino do livro dentro do grande relato da Escritura.";

  const curatedChapter = CURATED_CHAPTERS[`${bookSlug}-${chapter}`];
  const summary =
    curatedChapter ??
    `O capítulo ${chapter} de ${bookName} reúne ${verses.length} versículos e desenvolve a mensagem do livro. ${themeText} ${profile.godTeach}`;

  const verseInsights = verses.map((verse) => {
    const curated = CURATED_VERSES[`${bookSlug}-${chapter}-${verse.verse}`];
    const topics = topicsIn(verse.text);
    const primary = topics[0];
    const secondary = topics[1];
    const meaning = curated
      ? curated.meaning
      : primary
        ? `O texto destaca ${primary.label}${secondary ? ` e ${secondary.label}` : ""}. ${primary.meaning}`
        : `Este versículo contribui para o desenvolvimento de ${bookName} ${chapter}. ${profile.godTeach}`;

    return {
      id: verse.id,
      verse: verse.verse,
      text: verse.text,
      meaning,
      reflection:
        curated?.reflection ??
        primary?.reflection ??
        "O que este versículo muda na forma como você vê Deus ou o próximo?",
    };
  });

  return { summary, context: profile.setting, verseInsights };
}
