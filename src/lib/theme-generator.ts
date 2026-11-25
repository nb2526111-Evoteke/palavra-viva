import { resolveVerseReference, resolveVerseReferences, type ResolvedVerse } from "./bible-reference";

export type GeneratorEmphasis = "ambos" | "deus" | "jesus" | "livre";

export type GeneratorThemeSeed = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  godTeaches: string[];
  jesusTeaches: string[];
  applications: string[];
  practice: string;
  prayer: string;
  godRefs: string[];
  jesusRefs: string[];
  responseRefs: string[];
  dailyTitle: string;
  dailyRef: string;
  recommendedNarratives: string[];
};

export type GeneratorNarrativeSeed = {
  slug: string;
  name: string;
  group: string;
  period: string;
  king: string;
  setting: string;
  summary: string[];
  crisis: string;
  crisisText: string;
  godTeaches: string[];
  jesusConnection: string[];
  application: string;
  anchorRefs: string[];
  crisisRefs: string[];
  godRefs: string[];
  jesusRefs: string[];
};

export type GeneratedThemeSection = {
  paragraphs: string[];
  references: string[];
};

export type GeneratedOutlinePoint = {
  title: string;
  body: string;
  references: string[];
};

export type GeneratedDailyMessage = {
  title: string;
  reference: string;
  verseText: string;
  href: string;
  body: string[];
  practice: string;
  prayer: string;
};

export type GeneratedThemeContent = {
  title: string;
  subtitle: string;
  themeSlug: string;
  themeName: string;
  narrativeSlug: string;
  narrativeName: string;
  emphasis: GeneratorEmphasis;
  emphasisLabel: string;
  audience: string;
  period: string;
  king: string;
  generatedAt: string;
  historicalContext: string[];
  contextReferences: string[];
  narrative: string[];
  narrativeReferences: string[];
  god: GeneratedThemeSection;
  jesus: GeneratedThemeSection;
  outline: GeneratedOutlinePoint[];
  applications: string[];
  prayer: string;
  references: ResolvedVerse[];
  dailyMessage: GeneratedDailyMessage;
};

export const EMPHASIS_OPTIONS: { value: GeneratorEmphasis; label: string; description: string }[] = [
  {
    value: "livre",
    label: "Nenhum / livre",
    description: "Não força uma ênfase. O conteúdo completo é gerado e pode ser editado manualmente.",
  },
  {
    value: "ambos",
    label: "Deus e Jesus",
    description: "Mostra a unidade entre o ensino de Deus no Antigo Testamento e a voz de Jesus.",
  },
  {
    value: "deus",
    label: "Ênfase no ensino de Deus",
    description: "Aprofunda a aliança, a lei, os profetas e o caráter de Deus na narrativa.",
  },
  {
    value: "jesus",
    label: "Ênfase no ensino de Jesus",
    description: "Conecta a narrativa com o Reino, as parábolas e a prática de Jesus.",
  },
];

export const AUDIENCE_OPTIONS = [
  "Culto congregacional",
  "Pequeno grupo",
  "Escola bíblica",
  "Devocional pessoal",
  "Encontro de jovens",
  "Formação de líderes",
];

export const CUSTOM_THEME: GeneratorThemeSeed = {
  slug: "",
  name: "Tema personalizado",
  short: "Tema personalizado",
  summary:
    "Um estudo em branco para você escrever com as suas palavras. Edite o título, o contexto, o esboço e as aplicações abaixo.",
  godTeaches: [
    "Escreva aqui o que esta narrativa revela sobre o caráter de Deus, sua aliança e sua vontade.",
  ],
  jesusTeaches: [
    "Escreva aqui como Jesus cumpre, ilumina ou aplica esta verdade no Novo Testamento.",
  ],
  applications: [
    "Escreva uma aplicação concreta para a vida.",
    "Escreva uma segunda aplicação para o grupo ou para a comunidade.",
  ],
  practice: "Escreva uma prática simples para hoje.",
  prayer: "Senhor, conduz este estudo e escreve em nós a tua verdade. Em nome de Jesus, amém.",
  godRefs: ["Salmos 119:105"],
  jesusRefs: ["João 3:16"],
  responseRefs: ["Tiago 1:22-25"],
  dailyTitle: "Mensagem personalizada",
  dailyRef: "Salmos 119:105",
  recommendedNarratives: [],
};

export const CUSTOM_NARRATIVE: GeneratorNarrativeSeed = {
  slug: "",
  name: "Narrativa personalizada",
  group: "Livre",
  period: "Período a definir",
  king: "Contexto a definir",
  setting:
    "Descreva aqui o contexto histórico, o povo, o lugar e as circunstâncias da narrativa que você quer estudar.",
  summary: [
    "Escreva aqui a narrativa bíblica com as suas palavras.",
    "Você pode incluir os personagens, o conflito, a intervenção de Deus e o desfecho.",
  ],
  crisis: "O conflito",
  crisisText: "Descreva o conflito central desta narrativa.",
  godTeaches: [
    "Escreva aqui o que Deus ensinou por meio desta narrativa.",
  ],
  jesusConnection: [
    "Escreva aqui a conexão desta narrativa com Jesus e o evangelho.",
  ],
  application: "Escreva uma aplicação pastoral para esta narrativa.",
  anchorRefs: ["Gênesis 12:1-3"],
  crisisRefs: ["Êxodo 3:7-10"],
  godRefs: ["Deuteronômio 6:4-9"],
  jesusRefs: ["Lucas 24:25-27"],
};

export const GENERATOR_THEMES: GeneratorThemeSeed[] = [
  {
    slug: "fe",
    name: "Fé que sustenta",
    short: "Fé",
    summary:
      "A confiança que nasce da Palavra de Deus e permanece quando o caminho ainda não está totalmente claro.",
    godTeaches: [
      "Deus não pede uma fé cega: ele se apresenta na história, ouve o clamor e chama seu povo a confiar naquilo que ele já prometeu.",
      "A fé bíblica nasce do encontro com o Deus que fala, age e permanece fiel mesmo quando a resposta demora.",
    ],
    jesusTeaches: [
      "Jesus chama a fé de relacionamento: ele convida a deixar o medo, olhar para ele e seguir, mesmo em meio à tempestade.",
      "Para Jesus, uma fé pequena como um grão de mostarda já é suficiente para obedecer; o tamanho do milagre pertence a Deus.",
    ],
    applications: [
      "Identifique uma área em que você tem tentado controlar tudo e entregue-a a Deus em oração.",
      "Leia uma promessa bíblica por dia e escreva como ela se conecta à sua rotina.",
      "Converse com alguém que está atravessando uma crise e ore com essa pessoa, sem pressa de dar respostas.",
    ],
    practice:
      "Escolha uma promessa de Deus, escreva-a num papel e coloque onde você a veja ao acordar.",
    prayer:
      "Senhor, aumenta a nossa fé. Ensina-nos a confiar na tua Palavra quando não enxergamos o caminho inteiro e a caminhar com coragem, sabendo que tu vais à frente. Em nome de Jesus, amém.",
    godRefs: ["Êxodo 3:7-10", "Isaías 40:28-31"],
    jesusRefs: ["Marcos 4:35-41", "Lucas 17:5-6"],
    responseRefs: ["Hebreus 11:1-3", "Tiago 1:22-25"],
    dailyTitle: "A fé que dá o próximo passo",
    dailyRef: "Isaías 40:31",
    recommendedNarratives: ["exodo", "davi", "elias", "jesus-reino"],
  },
  {
    slug: "coragem",
    name: "Coragem para obedecer",
    short: "Coragem",
    summary:
      "A coragem que não nasce da ausência de medo, mas da presença de Deus e da certeza de que a obediência vale mais do que a segurança.",
    godTeaches: [
      "Deus ordena coragem não porque o perigo é pequeno, mas porque ele mesmo promete estar presente e ir à frente do seu povo.",
      "A coragem bíblica é obediência sustentada pela presença de Deus, não autoconfiança.",
    ],
    jesusTeaches: [
      "Jesus enfrentou a cruz e disse aos discípulos que tivessem bom ânimo porque ele venceu o mundo.",
      "A coragem cristã não é ausência de medo: é seguir Jesus mesmo com medo, sabendo que ele não abandona os seus.",
    ],
    applications: [
      "Nomeie o medo que tem paralisado você e coloque-o diante de Deus com honestidade.",
      "Dê um passo concreto de obediência nesta semana, ainda que pequeno.",
      "Procure uma pessoa madura que possa orar e caminhar com você nessa decisão.",
    ],
    practice:
      "Escreva uma decisão corajosa que você vem adiando e defina o primeiro passo para cumpri-la hoje.",
    prayer:
      "Deus de poder, tira de nós a paralisia do medo. Dá-nos coragem para obedecer, humildade para pedir ajuda e confiança para caminhar na tua presença. Em nome de Jesus, amém.",
    godRefs: ["Josué 1:5-9", "2 Crônicas 20:15-17"],
    jesusRefs: ["João 16:33", "Mateus 14:27"],
    responseRefs: ["Tiago 4:7-8", "1 Pedro 5:8-10"],
    dailyTitle: "Coragem para o próximo passo",
    dailyRef: "Josué 1:9",
    recommendedNarratives: ["josue", "davi", "elias", "ezequias", "neemias"],
  },
  {
    slug: "arrependimento",
    name: "Voltar para casa",
    short: "Arrependimento",
    summary:
      "O caminho de volta para Deus: reconhecer o pecado, abandonar a velha vida e receber o perdão que restaura.",
    godTeaches: [
      "Deus não se agrada da morte do ímpio, mas de que ele se converta e viva; o convite ao arrependimento é expressão do seu amor.",
      "O arrependimento bíblico é voltar para casa: reconhecer o pecado, abandonar o caminho e receber o perdão que Deus oferece.",
    ],
    jesusTeaches: [
      "Jesus conta a parábola do filho pródigo para mostrar um Pai que corre ao encontro de quem volta.",
      "Ele chama todos ao arrependimento e oferece o Reino como graça, não como recompensa por mérito.",
    ],
    applications: [
      "Reserve um tempo de silêncio para examinar a própria vida sem se condenar.",
      "Confesse a Deus o que você tem escondido e procure reconciliação onde for possível.",
      "Celebre o perdão recebido e estenda perdão a quem feriu você.",
    ],
    practice:
      "Faça uma oração curta de confissão e escreva uma atitude concreta de reparação ou recomeço.",
    prayer:
      "Pai, recebe-nos de volta. Cria em nós um coração puro e renova um espírito firme. Que o teu perdão nos ensine a perdoar e a caminhar em novidade de vida. Em nome de Jesus, amém.",
    godRefs: ["Joel 2:12-13", "Salmos 51:10-12"],
    jesusRefs: ["Lucas 15:17-24", "Marcos 1:15"],
    responseRefs: ["2 Coríntios 7:10", "1 João 1:9"],
    dailyTitle: "O Pai corre ao nosso encontro",
    dailyRef: "Joel 2:13",
    recommendedNarratives: ["davi", "josias", "exilio", "paixao"],
  },
  {
    slug: "esperanca",
    name: "Esperança que não decepciona",
    short: "Esperança",
    summary:
      "A esperança que atravessa o exílio, a doença e a morte porque está ancorada no caráter de Deus e na ressurreição de Jesus.",
    godTeaches: [
      "Deus permanece fiel mesmo quando a história parece ter acabado; as suas misericórdias se renovam cada manhã.",
      "A esperança bíblica não nega a dor: ela olha para o futuro de Deus sem abandonar a realidade presente.",
    ],
    jesusTeaches: [
      "Jesus se apresenta como a ressurreição e a vida, dando esperança que vai além da morte.",
      "Ele caminha com os discípulos desanimados no caminho de Emaús e reacende a esperança pela Escritura.",
    ],
    applications: [
      "Escreva uma situação que parece sem saída e entregue-a a Deus com lamentação honesta.",
      "Procure um sinal de fidelidade de Deus na sua história recente e agradeça por ele.",
      "Compartilhe esperança com alguém que está desanimado, sem minimizar a dor da pessoa.",
    ],
    practice:
      "Anote três motivos de esperança que não dependem das circunstâncias de hoje.",
    prayer:
      "Deus da esperança, enche-nos de toda alegria e paz. Quando a noite parecer longa, lembra-nos de que a manhã pertence a ti. Em nome de Jesus, amém.",
    godRefs: ["Lamentações 3:22-26", "Jeremias 29:11-13"],
    jesusRefs: ["João 11:23-27", "Lucas 24:1-8"],
    responseRefs: ["Romanos 15:13", "1 Pedro 1:3-5"],
    dailyTitle: "Misericórdias novas a cada manhã",
    dailyRef: "Lamentações 3:23",
    recommendedNarratives: ["exilio", "ezequias", "paixao", "pentecostes"],
  },
  {
    slug: "santidade",
    name: "Santidade que transforma",
    short: "Santidade",
    summary:
      "A vida separada para Deus não é isolamento, mas um jeito novo de habitar o mundo, refletindo o caráter de quem nos chamou.",
    godTeaches: [
      "Deus chama seu povo a ser santo porque ele é santo; a santidade nasce da relação com ele, não do orgulho religioso.",
      "A visão de Isaías no templo mostra que a santidade de Deus confronta o pecado e também purifica e envia.",
    ],
    jesusTeaches: [
      "Jesus ensina que a pureza vem do coração e que os puros verão a Deus.",
      "Ele ora para que os discípulos sejam guardados do mal e enviados ao mundo sem pertencer ao mundo.",
    ],
    applications: [
      "Examine hábitos cotidianos que têm moldado mais você do que a Palavra de Deus.",
      "Substitua um hábito destrutivo por uma prática que aproxime você de Deus e das pessoas.",
      "Não confunda santidade com perfeccionismo: procure crescer em graça e verdade.",
    ],
    practice:
      "Escolha um hábito pequeno e repetido para reorientar nesta semana como oferta a Deus.",
    prayer:
      "Santo Deus, mostra-nos a tua glória e transforma nosso coração. Separa-nos para ti sem nos afastar das pessoas que precisam do teu amor. Em nome de Jesus, amém.",
    godRefs: ["Levítico 19:1-2", "Isaías 6:1-8"],
    jesusRefs: ["Mateus 5:8", "João 17:15-19"],
    responseRefs: ["1 Pedro 1:13-16", "Romanos 12:1-2"],
    dailyTitle: "Um coração que vê Deus",
    dailyRef: "Mateus 5:8",
    recommendedNarratives: ["josias", "ezequias", "exodo", "jesus-reino"],
  },
  {
    slug: "justica",
    name: "Justiça e misericórdia",
    short: "Justiça",
    summary:
      "A justiça do Reino que não se contenta com discursos, mas se traduz em cuidado concreto com o vulnerável e em relações honestas.",
    godTeaches: [
      "Deus rejeita culto que ignora a justiça; ele pede que o direito corra como água e que o povo pratique o bem.",
      "Miqueias resume o caminho: praticar a justiça, amar a misericórdia e andar humildemente com Deus.",
    ],
    jesusTeaches: [
      "Jesus denuncia a religiosidade que negligencia o juízo, a misericórdia e a fidelidade.",
      "Na parábola do bom samaritano, ele transforma o próximo em chamado à ação.",
    ],
    applications: [
      "Identifique uma injustiça próxima que você pode ajudar a enfrentar, mesmo em pequena escala.",
      "Revise sua forma de tratar quem trabalha para você ou depende de você.",
      "Una oração e ação: ore por justiça e dê um passo concreto de misericórdia.",
    ],
    practice:
      "Faça uma ação concreta de cuidado com alguém vulnerável nesta semana, sem buscar reconhecimento.",
    prayer:
      "Senhor, ensina-nos a praticar a justiça e a amar a misericórdia. Livra-nos de uma fé que fala bonito e não cuida do próximo. Em nome de Jesus, amém.",
    godRefs: ["Miqueias 6:8", "Amós 5:21-24"],
    jesusRefs: ["Mateus 23:23", "Lucas 10:25-37"],
    responseRefs: ["Tiago 1:27", "Provérbios 31:8-9"],
    dailyTitle: "Fé que cuida do próximo",
    dailyRef: "Miqueias 6:8",
    recommendedNarratives: ["josias", "neemias", "exilio", "jesus-reino"],
  },
  {
    slug: "humildade",
    name: "Humildade que serve",
    short: "Humildade",
    summary:
      "A grandeza no Reino é medida pelo serviço; Deus resiste ao orgulhoso e levanta o humilde.",
    godTeaches: [
      "Deus vê o coração, não a aparência, e escolhe o improvável para revelar sua graça.",
      "O temor do Senhor é o começo da sabedoria; a humildade abre espaço para aprender e recomeçar.",
    ],
    jesusTeaches: [
      "Jesus ensina que o maior deve servir e se apresenta como o Filho do Homem que veio dar a vida.",
      "Ao lavar os pés dos discípulos, ele transforma autoridade em serviço.",
    ],
    applications: [
      "Peça perdão ou feedback a alguém de quem você tem se afastado por orgulho.",
      "Faça uma tarefa que ninguém vê e que beneficia outra pessoa.",
      "Antes de ensinar, escute; antes de corrigir, procure compreender.",
    ],
    practice:
      "Escolha um serviço concreto e anônimo para realizar hoje.",
    prayer:
      "Jesus, ensina-nos a servir. Tira de nós a necessidade de aparecer e forma em nós um coração humilde, atento às necessidades dos outros. Amém.",
    godRefs: ["1 Samuel 16:7", "Provérbios 11:2"],
    jesusRefs: ["Marcos 10:42-45", "João 13:12-17"],
    responseRefs: ["Filipenses 2:3-8", "Tiago 4:6-10"],
    dailyTitle: "A grandeza que se ajoelha",
    dailyRef: "Marcos 10:45",
    recommendedNarratives: ["davi", "salomao", "ezequias", "paixao"],
  },
  {
    slug: "adoracao",
    name: "Adoração em espírito e verdade",
    short: "Adoração",
    summary:
      "Adorar não é apenas cantar: é responder ao Deus santo com todo o ser, em comunidade e na vida cotidiana.",
    godTeaches: [
      "Deus é digno de louvor porque criou todas as coisas e reina com glória.",
      "A visão de Isaías mostra que a verdadeira adoração nasce do encontro com a santidade de Deus e termina em disposição para servir.",
    ],
    jesusTeaches: [
      "Jesus ensina que o Pai procura adoradores que o adorem em espírito e em verdade.",
      "Ele ensina os discípulos a orar com simplicidade, confiança e reverência.",
    ],
    applications: [
      "Reserve um momento diário de louvor sem pedir nada, apenas reconhecendo quem Deus é.",
      "Leve a adoração para o trabalho, para a família e para as decisões difíceis.",
      "Cante com a comunidade mesmo quando a emoção não estiver alta; a adoração também é fidelidade.",
    ],
    practice:
      "Comece o dia louvando a Deus por três atributos do seu caráter, antes de fazer pedidos.",
    prayer:
      "Pai, recebe a nossa adoração. Que a nossa vida seja resposta ao teu amor e que o nosso louvor ultrapasse os domingos. Em nome de Jesus, amém.",
    godRefs: ["Salmos 96:1-6", "Isaías 6:1-5"],
    jesusRefs: ["João 4:21-24", "Mateus 6:9-13"],
    responseRefs: ["Romanos 12:1-2", "Hebreus 13:15-16"],
    dailyTitle: "Adorar com a vida inteira",
    dailyRef: "João 4:24",
    recommendedNarratives: ["salomao", "ezequias", "josias", "paixao"],
  },
  {
    slug: "reino",
    name: "O Reino que começa pequeno",
    short: "Reino de Deus",
    summary:
      "O Reino anunciado por Jesus começa como semente, cresce no escondido e transforma tudo o que toca.",
    godTeaches: [
      "O Reino de Deus é eterno e não será destruído; ele permanece quando os impérios humanos passam.",
      "O rei prometido por Zacarias vem humilde, trazendo salvação e paz.",
    ],
    jesusTeaches: [
      "Jesus anuncia que o Reino de Deus está próximo e chama à conversão e à fé no evangelho.",
      "As parábolas mostram que o Reino cresce de forma inesperada, a partir do pequeno e do escondido.",
    ],
    applications: [
      "Busque primeiro o Reino de Deus nas decisões desta semana.",
      "Semeie um pequeno ato de justiça ou misericórdia sem exigir resultados imediatos.",
      "Pergunte: o que em mim ainda precisa se render ao senhorio de Jesus?",
    ],
    practice:
      "Escolha uma área da sua vida para submeter ao senhorio de Jesus hoje, de forma concreta.",
    prayer:
      "Rei Jesus, estabelece o teu Reino em nós. Que a tua vontade seja feita na terra como no céu, e que a nossa vida semeie o teu amor onde estamos. Amém.",
    godRefs: ["Daniel 2:44", "Zacarias 9:9"],
    jesusRefs: ["Marcos 1:14-15", "Mateus 13:31-33"],
    responseRefs: ["Mateus 6:33", "Atos 1:8"],
    dailyTitle: "O Reino que cresce no escondido",
    dailyRef: "Marcos 1:15",
    recommendedNarratives: ["davi", "jesus-reino", "paixao", "pentecostes"],
  },
  {
    slug: "fidelidade",
    name: "Fidelidade à aliança",
    short: "Fidelidade",
    summary:
      "A fidelidade de Deus sustenta a nossa fidelidade; ele permanece fiel mesmo quando falhamos.",
    godTeaches: [
      "Deus é fiel à sua aliança e guarda a sua palavra por mil gerações.",
      "A fidelidade de Deus não é indiferença ao pecado: ele disciplina, restaura e continua chamando seu povo de volta.",
    ],
    jesusTeaches: [
      "Jesus elogia o servo fiel e chama a igreja a permanecer fiel até o fim.",
      "Ele mesmo é o testemunho fiel, que não abandonou a missão mesmo diante da cruz.",
    ],
    applications: [
      "Reveja compromissos que você assumiu e cumpra o que está ao seu alcance.",
      "Cultive fidelidade nas pequenas tarefas, não apenas nas grandes oportunidades.",
      "Quando falhar, volte para Deus e para as pessoas com humildade e reparação.",
    ],
    practice:
      "Cumpra hoje uma promessa pequena que você vinha adiando.",
    prayer:
      "Deus fiel, obrigado porque a tua aliança não depende do nosso desempenho. Ensina-nos a ser fiéis nas coisas pequenas e a permanecer contigo até o fim. Amém.",
    godRefs: ["Deuteronômio 7:9", "Salmos 89:1-4"],
    jesusRefs: ["Mateus 25:21", "Apocalipse 2:10"],
    responseRefs: ["1 Coríntios 4:1-2", "Hebreus 10:23-25"],
    dailyTitle: "Fiel nas coisas pequenas",
    dailyRef: "Deuteronômio 7:9",
    recommendedNarratives: ["josue", "davi", "josias", "neemias"],
  },
  {
    slug: "perdao",
    name: "Perdão que liberta",
    short: "Perdão",
    summary:
      "Receber o perdão de Deus e estendê-lo aos outros é um caminho de liberdade, verdade e reconciliação.",
    godTeaches: [
      "Deus apaga as nossas transgressões por amor de si mesmo e lança os nossos pecados nas profundezas do mar.",
      "O perdão de Deus não é amnésia: é graça que restaura e chama a uma vida nova.",
    ],
    jesusTeaches: [
      "Jesus ensina a perdoar setenta vezes sete, mostrando que o perdão não tem limite calculável.",
      "Na cruz, ele ora pelo perdão daqueles que o crucificam.",
    ],
    applications: [
      "Nomeie diante de Deus uma mágoa que você tem carregado.",
      "Dê um passo de reconciliação com alguém, se for seguro e possível.",
      "Lembre-se: perdoar não significa tolerar abuso; significa entregar a vingança a Deus.",
    ],
    practice:
      "Ore por uma pessoa que feriu você e peça a Deus um coração livre para perdoar.",
    prayer:
      "Pai, obrigado pelo perdão que recebemos em Cristo. Livra-nos do ressentimento e ensina-nos a perdoar como fomos perdoados. Amém.",
    godRefs: ["Isaías 43:25", "Miqueias 7:18-19"],
    jesusRefs: ["Mateus 18:21-22", "Lucas 23:34"],
    responseRefs: ["Efésios 4:31-32", "Colossenses 3:12-14"],
    dailyTitle: "Perdoar como fomos perdoados",
    dailyRef: "Miqueias 7:19",
    recommendedNarratives: ["davi", "exilio", "paixao", "pentecostes"],
  },
  {
    slug: "missao",
    name: "Enviados para testemunhar",
    short: "Missão",
    summary:
      "A missão nasce do chamado de Deus, é sustentada pelo Espírito e aponta para Jesus em palavras e obras.",
    godTeaches: [
      "Deus chamou Abraão para que todas as famílias da terra fossem abençoadas nele.",
      "O Servo de Isaías é luz para as nações, mostrando que a salvação de Deus tem alcance universal.",
    ],
    jesusTeaches: [
      "Jesus envia os discípulos com autoridade e promete estar com eles até o fim dos tempos.",
      "Ele promete o Espírito Santo como poder para testemunhar em Jerusalém, na Judeia, em Samaria e até os confins da terra.",
    ],
    applications: [
      "Ore por uma pessoa que ainda não conhece a esperança de Jesus.",
      "Sirva sua comunidade de forma concreta, sem esperar retorno.",
      "Conte a sua história de fé com simplicidade para alguém nesta semana.",
    ],
    practice:
      "Escolha uma pessoa e um gesto concreto de amor ou serviço para esta semana.",
    prayer:
      "Senhor, envia-nos. Dá-nos coragem para testemunhar, compaixão para servir e humildade para aprender. Que o teu Reino alcance as nações. Em nome de Jesus, amém.",
    godRefs: ["Gênesis 12:1-3", "Isaías 49:6"],
    jesusRefs: ["Mateus 28:18-20", "Atos 1:8"],
    responseRefs: ["Romanos 10:14-15", "1 Pedro 2:9-10"],
    dailyTitle: "Chamados para abençoar",
    dailyRef: "Mateus 28:19",
    recommendedNarratives: ["exodo", "exilio", "jesus-reino", "pentecostes"],
  },
];

export const GENERATOR_NARRATIVES: GeneratorNarrativeSeed[] = [
  {
    slug: "exodo",
    name: "Êxodo: Deus ouve o clamor",
    group: "Êxodo e aliança",
    period: "c. 1440–1250 a.C. (datação discutida pelos historiadores)",
    king: "Faraó do Egito; Moisés como líder libertador",
    setting:
      "Israel vive como povo escravizado no Egito. O faraó teme o crescimento do povo e intensifica o trabalho forçado. Deus ouve o gemido, lembra-se da aliança com Abraão e chama Moisés para libertar o povo.",
    summary: [
      "A libertação do Egito é o grande paradigma da redenção no Antigo Testamento. Deus não apenas tira o povo da escravidão: ele o forma como povo da aliança no deserto.",
      "No Sinai, Deus revela seu caráter e sua vontade. A lei não é um fardo para merecer amor, mas a forma de viver em resposta ao amor de quem libertou.",
    ],
    crisis: "A opressão e o clamor",
    crisisText:
      "O povo não tem exército, terra ou poder. Tudo o que existe é a memória de José, o gemido sob o trabalho forçado e a promessa feita aos pais. Deus entra nessa história sem poder humano para salvar.",
    godTeaches: [
      "Deus se revela como aquele que vê, ouve, desce e liberta; a sua compaixão nunca é apenas sentimento, mas ação.",
      "A aliança do Sinai mostra que o Deus santo deseja um povo que reflita seu caráter em justiça, fidelidade e cuidado com o estrangeiro.",
    ],
    jesusConnection: [
      "Jesus é o novo êxodo: ele liberta da escravidão do pecado e inaugura a nova aliança no seu próprio corpo.",
      "Na última ceia, Jesus aponta para o êxodo final: o seu sangue derramado liberta um povo para Deus.",
    ],
    application:
      "Reserve um tempo para nomear as 'escravidões' do presente e peça a Deus olhos para ver o caminho da liberdade.",
    anchorRefs: ["Êxodo 3:7-10", "Êxodo 20:1-6"],
    crisisRefs: ["Êxodo 1:8-14", "Êxodo 2:23-25"],
    godRefs: ["Êxodo 34:5-7", "Deuteronômio 6:4-9"],
    jesusRefs: ["Lucas 22:14-20", "João 1:29"],
  },
  {
    slug: "josue",
    name: "Josué: a travessia do Jordão",
    group: "Êxodo e aliança",
    period: "c. 1400 a.C.",
    king: "Nenhum rei em Israel; Josué, sucessor de Moisés",
    setting:
      "Depois de 40 anos no deserto, a geração que saiu do Egito já morreu. Josué recebe a missão de conduzir o povo à terra prometida. O primeiro obstáculo é o Jordão cheio.",
    summary: [
      "A travessia repete o milagre do mar Vermelho. Deus não apenas dá a terra: ele vai adiante do povo e sustenta a coragem de Josué.",
      "Josué deve meditar na Lei dia e noite, não apenas conquistar territórios. A obediência é o caminho da vida na terra.",
    ],
    crisis: "O rio cheio e o medo da liderança",
    crisisText:
      "Moisés morreu e Josué assume uma tarefa impossível aos olhos humanos. O Jordão transborda, o povo precisa de um líder e a promessa parece distante.",
    godTeaches: [
      "Deus ordena coragem baseada na sua presença e na sua Palavra, não nas habilidades do líder.",
      "A memória é fundamental: as pedras tiradas do Jordão servem para as gerações futuras lembrarem o que Deus fez.",
    ],
    jesusConnection: [
      "Josué e Jesus compartilham o mesmo nome hebraico (Yeshua). Ambos conduzem o povo a uma promessa que não poderiam alcançar sozinhos.",
      "Jesus abre caminho através da morte e chama sua igreja a fazer discípulos de todas as nações.",
    ],
    application:
      "Relembre uma vitória de Deus no seu passado e conte essa história a alguém mais jovem na fé.",
    anchorRefs: ["Josué 1:1-9", "Josué 3:14-17"],
    crisisRefs: ["Josué 1:6-9", "Josué 2:8-11"],
    godRefs: ["Josué 4:1-7", "Josué 24:14-18"],
    jesusRefs: ["Mateus 28:18-20", "Hebreus 4:8-11"],
  },
  {
    slug: "davi",
    name: "Davi: do curral ao trono",
    group: "Reis e história",
    period: "c. 1050–970 a.C.",
    king: "Saul, primeiro rei; Davi, rei de Judá e depois de todo Israel",
    setting:
      "Israel vive a transição da era dos juízes para a monarquia. Saul é escolhido, mas falha em obedecer. Deus escolhe Davi, o menor de uma família de Belém, e o forma no esconderijo e na perseguição.",
    summary: [
      "Davi é pastor, músico, guerreiro e poeta. Sua história mostra que Deus vê o coração e escolhe o improvável.",
      "A aliança com Davi em 2 Samuel 7 promete um descendente eterno. Ao mesmo tempo, a história registra seu pecado e o perdão que o restaura.",
    ],
    crisis: "A espera entre a unção e o trono",
    crisisText:
      "Davi é ungido ainda jovem, mas passa anos fugindo de Saul. A promessa parece mentira enquanto ele vive em cavernas, come pão consagrado e poupa a vida do rei que o persegue.",
    godTeaches: [
      "Deus vê o coração, não a aparência nem a posição social.",
      "A fidelidade de Deus à aliança com Davi não depende da perfeição do rei: ela aponta para o Rei perfeito que viria.",
    ],
    jesusConnection: [
      "Jesus é o 'filho de Davi', nascido em Belém e herdeiro do trono prometido.",
      "O Rei Jesus não conquista pelo poder militar, mas se entrega na cruz e reina pelo serviço.",
    ],
    application:
      "Dê espaço para Deus formar caráter em você no tempo de espera, sem tentar adiantar a promessa por meios duvidosos.",
    anchorRefs: ["1 Samuel 16:1-13", "2 Samuel 7:8-16"],
    crisisRefs: ["1 Samuel 18:6-16", "Salmos 57:1-3"],
    godRefs: ["Salmos 51:10-12", "Salmos 139:1-4"],
    jesusRefs: ["Mateus 1:1", "Lucas 1:30-33"],
  },
  {
    slug: "salomao",
    name: "Salomão: sabedoria, templo e tropeço",
    group: "Reis e história",
    period: "c. 970–930 a.C.",
    king: "Salomão, filho de Davi",
    setting:
      "Israel alcança prosperidade e prestígio. Salomão constrói o templo, estabelece alianças e recebe fama por sua sabedoria. Casamentos políticos e riqueza abrem espaço para a idolatria.",
    summary: [
      "Salomão pede a Deus um coração sábio para governar. Deus se agrada do pedido e dá sabedoria, além daquilo que não foi pedido.",
      "A fama e a riqueza, porém, dividem o coração do rei. Seu reinado termina com compromissos idolátricos que preparam a divisão do reino.",
    ],
    crisis: "A sabedoria sem obediência",
    crisisText:
      "O homem mais sábio do mundo não consegue obedecer à palavra que ele mesmo ensinou. A prosperidade se transforma em excesso e o templo é cercado de altares estrangeiros.",
    godTeaches: [
      "Deus se agrada de um coração que pede sabedoria para servir, e não apenas para brilhar.",
      "A presença de Deus no templo não substitui a fidelidade à aliança; o culto sem obediência é vazio.",
    ],
    jesusConnection: [
      "Jesus é maior que Salomão: a sua sabedoria não é apenas ensinamento, mas entrega total ao Pai.",
      "Ele é o templo definitivo, onde Deus habita no meio do seu povo.",
    ],
    application:
      "Avalie se alguma bênção recebida tem ocupado o lugar de Deus no seu coração.",
    anchorRefs: ["1 Reis 3:5-12", "1 Reis 8:22-30"],
    crisisRefs: ["1 Reis 11:1-8", "Deuteronômio 17:14-20"],
    godRefs: ["Provérbios 3:5-8", "Eclesiastes 12:13-14"],
    jesusRefs: ["Mateus 12:42", "João 2:19-21"],
  },
  {
    slug: "elias",
    name: "Elias no Carmelo: o Deus que responde",
    group: "Profetas e crise",
    period: "c. 870–850 a.C.",
    king: "Acabe e Jezabel, reino do Norte",
    setting:
      "Israel do Norte mergulha na adoração a Baal. Elias anuncia uma seca como juízo e confronta os profetas de Baal no monte Carmelo. Depois da vitória, foge de Jezabel e é cuidado por Deus no deserto.",
    summary: [
      "No Carmelo, Elias desafia o povo a escolher entre dois senhores. O Deus de Israel responde com fogo; Baal permanece em silêncio.",
      "Depois da vitória, Elias cai em exaustão. Deus não o repreende: alimenta, escuta e se revela na voz mansa e delicada.",
    ],
    crisis: "A apostasia e o altar que não arde",
    crisisText:
      "O povo está dividido entre o culto a Deus e a adoração a Baal. Os profetas do rei cortam-se, gritam e não obtêm resposta. Elias ora sozinho, expõe o altar e deixa a resposta nas mãos de Deus.",
    godTeaches: [
      "O Deus de Israel é o único que responde; a fé verdadeira não depende de manipulação emocional.",
      "Deus cuida do profeta exausto e o chama a continuar caminhando, revelando-se também no silêncio.",
    ],
    jesusConnection: [
      "Jesus é maior que Elias e aparece no monte da transfiguração com Moisés e Elias.",
      "A voz do Pai aponta para Jesus como o Filho amado, a quem devemos ouvir.",
    ],
    application:
      "Quando a exaustão chegar, permita que Deus cuide de você antes de exigir novas conquistas.",
    anchorRefs: ["1 Reis 18:20-24", "1 Reis 19:9-13"],
    crisisRefs: ["1 Reis 18:17-21", "1 Reis 19:1-4"],
    godRefs: ["1 Reis 18:36-39", "1 Reis 19:5-8"],
    jesusRefs: ["Lucas 9:28-36", "Mateus 17:10-13"],
  },
  {
    slug: "ezequias",
    name: "Ezequias: oração sob ameaça",
    group: "Reis e história",
    period: "c. 715–686 a.C.",
    king: "Ezequias, rei de Judá; Senaqueribe, rei da Assíria",
    setting:
      "A Assíria domina o antigo Oriente Próximo. Ezequias reforma o culto em Judá, mas Jerusalém é cercada por um exército poderoso. O rei recebe uma carta de ameaça e a espalha diante do Senhor.",
    summary: [
      "Ezequias não responde à arrogância com a mesma arrogância. Ele busca o profeta Isaías e ora, pedindo que Deus defenda o seu nome.",
      "Deus responde e livra Jerusalém. Mais tarde, Ezequias adoece, ora e recebe mais quinze anos de vida, mas tropeça ao exibir seus tesouros aos babilônios.",
    ],
    crisis: "O exército que zomba da fé",
    crisisText:
      "O mensageiro assírio desafia o Deus de Jerusalém diante do povo. A cidade está cercada e a resposta humana não existe. Ezequias leva a carta ao templo e ora.",
    godTeaches: [
      "Deus ouve a oração do rei e do povo quando eles se humilham e buscam a sua face.",
      "A cura e a libertação são graça, não moeda de troca; o coração precisa permanecer dependente depois da vitória.",
    ],
    jesusConnection: [
      "Jesus enfrenta a ameaça da morte com oração no Getsêmani e entrega a vontade própria ao Pai.",
      "Ele ensina a pedir, buscar e bater, confiando no Pai que sabe do que precisamos.",
    ],
    application:
      "Leve a sua maior preocupação para Deus por escrito hoje e ore com as palavras que vierem.",
    anchorRefs: ["2 Reis 18:28-35", "2 Crônicas 32:1-8"],
    crisisRefs: ["2 Reis 19:1-7", "2 Reis 19:14-19"],
    godRefs: ["2 Reis 20:1-6", "Isaías 38:1-8"],
    jesusRefs: ["Marcos 14:32-36", "Mateus 7:7-11"],
  },
  {
    slug: "josias",
    name: "Josias: a Palavra reencontrada",
    group: "Reis e história",
    period: "c. 640–609 a.C.",
    king: "Josias, rei de Judá",
    setting:
      "Depois de Manassés e Amom, Judá está mergulhada em idolatria. Josias sobe ao trono aos oito anos. Durante a reforma do templo, o Livro da Lei é encontrado e lido diante do rei.",
    summary: [
      "A descoberta do livro provoca arrependimento. Josias rasga as vestes, consulta a profetisa Hulda e reúne o povo para ouvir a aliança.",
      "Ele remove altares idólatras e celebra a Páscoa. Morre jovem na batalha de Megido, e a reforma não dura para sempre.",
    ],
    crisis: "Um rei jovem e uma nação esquecida da aliança",
    crisisText:
      "A Palavra de Deus estava perdida dentro da própria casa de Deus. O povo havia se acostumado com uma religiosidade sem Escritura, sem memória e sem obediência.",
    godTeaches: [
      "A Palavra de Deus confronta, chama ao arrependimento e reorienta a vida comunitária.",
      "Reforma verdadeira começa quando a Escritura é lida em voz alta diante do povo e todos se dispõem a obedecer.",
    ],
    jesusConnection: [
      "Jesus lê Isaías na sinagoga e se apresenta como cumprimento da Escritura.",
      "Ele não veio abolir a Lei, mas cumprir; a Palavra aponta para ele.",
    ],
    application:
      "Volte a ler a Bíblia em comunidade, não apenas sozinho, e pergunte o que ela exige de vocês juntos.",
    anchorRefs: ["2 Reis 22:1-2", "2 Reis 22:8-11"],
    crisisRefs: ["2 Reis 22:11-13", "2 Reis 23:1-3"],
    godRefs: ["2 Reis 23:21-23", "2 Crônicas 34:29-33"],
    jesusRefs: ["Lucas 4:16-21", "Mateus 5:17-18"],
  },
  {
    slug: "exilio",
    name: "Exílio: esperança para os que perderam tudo",
    group: "Exílio e restauração",
    period: "586–538 a.C.",
    king: "Nabucodonosor (Babilônia), Zedequias (último rei de Judá), Ciro (Pérsia)",
    setting:
      "Jerusalém é destruída, o templo queimado e o povo deportado. Os profetas interpretam o exílio não como abandono, mas como disciplina e purificação. Deus continua falando no exílio.",
    summary: [
      "No exílio, a fé precisa aprender a viver sem templo e sem rei. Os salmos de lamento e as visões de Ezequiel mostram um povo que aprende a cantar a canção do Senhor em terra estrangeira.",
      "Deus chama o povo a buscar a paz da cidade, manter a identidade e esperar a restauração. A promessa de um novo coração e de um novo espírito aponta para além do retorno físico.",
    ],
    crisis: "A cidade caída e a fé sem templo",
    crisisText:
      "O centro da vida religiosa foi destruído. Sem terra, templo e rei, o povo precisa descobrir que a aliança de Deus não estava presa a um edifício.",
    godTeaches: [
      "Deus está presente no exílio e chama seu povo a viver com fidelidade mesmo em terra estrangeira.",
      "A visão dos ossos secos promete vida onde só há morte: o Espírito de Deus ressuscita o que parece perdido.",
    ],
    jesusConnection: [
      "Jesus fala do seu corpo como templo que será levantado em três dias, apontando para a ressurreição.",
      "Na estrada de Emaús, ele mostra como toda a Escritura aponta para o seu sofrimento e glória.",
    ],
    application:
      "Em vez de esperar tempos ideais para servir a Deus, busque o bem da cidade onde você está hoje.",
    anchorRefs: ["2 Reis 25:8-12", "Jeremias 29:4-7"],
    crisisRefs: ["Salmos 137:1-6", "Lamentações 1:1-5"],
    godRefs: ["Ezequiel 36:24-28", "Ezequiel 37:1-6"],
    jesusRefs: ["João 2:19-22", "Lucas 24:25-27"],
  },
  {
    slug: "neemias",
    name: "Neemias: reconstruir com oração",
    group: "Exílio e restauração",
    period: "c. 445 a.C.",
    king: "Artaxerxes I, rei da Pérsia",
    setting:
      "Neemias é copeiro do rei persa. Recebe notícias de que os muros de Jerusalém estão destruídos. Ora, planeja e pede autorização para reconstruir. A obra enfrenta oposição, mas o povo se organiza.",
    summary: [
      "A reconstrução dos muros é ao mesmo tempo espiritual e prática. Neemias chora, jejua, confessa e age.",
      "O povo trabalha com uma mão na obra e outra na espada. A oração não substitui o planejamento, e o planejamento não substitui a dependência de Deus.",
    ],
    crisis: "Os muros quebrados e a oposição",
    crisisText:
      "A cidade está vulnerável, os inimigos zombam e o povo está desanimado. Neemias precisa mobilizar famílias cansadas para reconstruir o que parecia impossível.",
    godTeaches: [
      "Deus age por meio de oração, planejamento e trabalho fiel; a vida devocional não é fuga da responsabilidade.",
      "A coragem do povo nasce da lembrança de quem Deus é e da disposição de lutar juntos.",
    ],
    jesusConnection: [
      "Jesus promete edificar sua igreja, mas não com muros de pedra: com pessoas transformadas pelo evangelho.",
      "Ele zela pela casa do Pai e transforma a cruz em sinal de reconstrução definitiva.",
    ],
    application:
      "Combine oração e ação: escolha uma obra concreta e dê o primeiro passo de planejamento esta semana.",
    anchorRefs: ["Neemias 1:1-4", "Neemias 2:1-8"],
    crisisRefs: ["Neemias 4:1-6", "Neemias 4:9-14"],
    godRefs: ["Neemias 4:15-20", "Neemias 6:15-16"],
    jesusRefs: ["Mateus 16:18", "João 2:13-17"],
  },
  {
    slug: "jesus-reino",
    name: "Jesus e o Reino de Deus",
    group: "Jesus e a Igreja",
    period: "c. 27–30 d.C.",
    king: "Herodes Antipas (Galileia), Pôncio Pilatos (Judeia); Jesus, o Rei do Reino",
    setting:
      "A Palestina está sob domínio romano e vive uma expectativa messiânica intensa. Jesus anuncia que o Reino de Deus chegou nele, não como domínio político, mas como vida transformada.",
    summary: [
      "O Reino não é um território conquistado por exércitos. Ele irrompe em parábolas, curas, mesas compartilhadas e na vida dos pequenos.",
      "Jesus ensina que o Rei é também o Servo. Ele chama o povo de todos os lugares a se converter e a crer no evangelho.",
    ],
    crisis: "A expectativa de um rei político",
    crisisText:
      "As pessoas querem um rei que expulse Roma e restaure a glória de Israel. Jesus recusa o atalho político e introduz um Reino que começa pequeno e cresce no escondido.",
    godTeaches: [
      "O Reino de Deus é eterno e não será destruído; permanece quando os impérios humanos passam.",
      "O rei prometido vem humilde, trazendo salvação e paz para as nações.",
    ],
    jesusConnection: [
      "Jesus inaugura o Reino com sua presença, suas palavras e seus gestos de compaixão.",
      "As bem-aventuranças descrevem a vida do Reino: pobres de espírito, mansos, misericordiosos e perseguidos.",
    ],
    application:
      "Pergunte diariamente: o que significa seguir Jesus como Rei nas escolhas pequenas de hoje?",
    anchorRefs: ["Mateus 4:17-25", "Lucas 4:16-21"],
    crisisRefs: ["João 6:14-15", "Mateus 21:1-11"],
    godRefs: ["Daniel 2:44", "Zacarias 9:9"],
    jesusRefs: ["Marcos 1:14-15", "Mateus 13:31-33"],
  },
  {
    slug: "paixao",
    name: "A paixão: o Rei que serve",
    group: "Jesus e a Igreja",
    period: "c. 30 d.C.",
    king: "Pôncio Pilatos, Herodes Antipas; Jesus, coroado de espinhos",
    setting:
      "Jesus entra em Jerusalém, celebra a última ceia com os discípulos, ora no Getsêmani, é julgado e crucificado. Ao terceiro dia, ressuscita.",
    summary: [
      "A cruz parece a derrota definitiva. Nela, porém, o Rei que serve carrega o pecado e abre caminho para a reconciliação com Deus.",
      "A ressurreição confirma que a morte não tem a palavra final. O Cristo vivo envia os discípulos a testemunhar o Reino.",
    ],
    crisis: "A noite do Getsêmani e a cruz",
    crisisText:
      "Pedro nega, o galo canta e o Rei é coberto de zombaria. Jesus enfrenta a angústia com oração e entrega a própria vida em lugar do seu povo.",
    godTeaches: [
      "O Servo sofredor carrega as culpas e ferimentos do povo, e por suas feridas somos curados.",
      "Deus não abandona o justo no sofrimento; o lamento do Salmo 22 termina em louvor e esperança.",
    ],
    jesusConnection: [
      "Jesus interpreta sua morte como resgate: o Filho do Homem veio servir e dar a vida em lugar de muitos.",
      "Ele se entrega, ressuscita e transforma a cruz em sinal de vitória e reconciliação.",
    ],
    application:
      "Contemple a cruz sem pressa e deixe que o sacrifício de Jesus transforme sua forma de amar e perdoar.",
    anchorRefs: ["Mateus 26:36-46", "Mateus 27:45-54"],
    crisisRefs: ["Mateus 26:47-56", "Mateus 26:69-75"],
    godRefs: ["Isaías 53:4-6", "Salmos 22:1-5"],
    jesusRefs: ["Marcos 10:45", "Lucas 24:1-8"],
  },
  {
    slug: "pentecostes",
    name: "Pentecostes: o Rei envia sua igreja",
    group: "Jesus e a Igreja",
    period: "c. 30 d.C.",
    king: "Nenhum rei terreno; Jesus ressurreto é Senhor",
    setting:
      "Cinquenta dias após a Páscoa, os discípulos estão reunidos em Jerusalém. O Espírito Santo desce, a igreja nasce e o evangelho começa a alcançar povos de muitas línguas.",
    summary: [
      "O Espírito capacita a igreja para testemunhar. O medo dos discípulos dá lugar a uma coragem que não nasce deles.",
      "A igreja nasce multicultural e missionária. A promessa do Espírito não é privilégio para isolamento, mas poder para serviço e anúncio.",
    ],
    crisis: "O medo dos discípulos e a missão impossível",
    crisisText:
      "Os discípulos estavam escondidos após a morte de Jesus. Sem poder próprio, eles precisavam da promessa do Pai para atravessar a cidade e o mundo.",
    godTeaches: [
      "Deus cumpre a promessa do Espírito e forma um povo novo, capaz de falar e viver o evangelho.",
      "O Espírito não é propriedade de uma elite: ele capacita pessoas comuns para a missão.",
    ],
    jesusConnection: [
      "Jesus promete não deixar os discípulos órfãos e envia o Espírito como Consolador.",
      "O Senhor ressurreto envia sua igreja com autoridade e promessa de presença até o fim dos tempos.",
    ],
    application:
      "Peça ao Espírito coragem para testemunhar no ambiente onde você já está, sem esperar condições perfeitas.",
    anchorRefs: ["Atos 1:6-8", "Atos 2:1-13"],
    crisisRefs: ["Atos 1:12-14", "João 20:19-23"],
    godRefs: ["Atos 2:14-21", "Ezequiel 36:26-27"],
    jesusRefs: ["João 14:15-18", "Mateus 28:18-20"],
  },
];

const emphasisLabel: Record<GeneratorEmphasis, string> = {
  ambos: "Deus e Jesus",
  deus: "Ensino de Deus",
  jesus: "Ensino de Jesus",
  livre: "Livre / editável",
};

function findTheme(slug: string | undefined) {
  if (slug === "") return CUSTOM_THEME;
  return GENERATOR_THEMES.find((theme) => theme.slug === slug) ?? GENERATOR_THEMES[0];
}

function findNarrative(slug: string | undefined) {
  if (slug === "") return CUSTOM_NARRATIVE;
  return GENERATOR_NARRATIVES.find((narrative) => narrative.slug === slug) ?? GENERATOR_NARRATIVES[2];
}

export async function buildGeneratedTheme(input: {
  themeSlug?: string;
  narrativeSlug?: string;
  emphasis?: string;
  audience?: string;
  customTitle?: string;
}): Promise<GeneratedThemeContent> {
  const theme = findTheme(input.themeSlug);
  const narrative = findNarrative(input.narrativeSlug);
  const emphasis: GeneratorEmphasis =
    input.emphasis === "deus" || input.emphasis === "jesus" || input.emphasis === "livre"
      ? input.emphasis
      : "ambos";
  const audience = input.audience?.trim() || "Estudo personalizado";
  const customTitle = input.customTitle?.trim().slice(0, 180) || "";
  const title = customTitle || `${theme.name} — ${narrative.name}`;

  const contextParagraphs = [
    `Período histórico: ${narrative.period.replace(/\.$/, "")}. ${
      narrative.king ? `Reis e autoridades: ${narrative.king}.` : "Não há um rei humano no centro desta narrativa."
    }`,
    narrative.setting,
    `A narrativa é lida a partir de ${narrative.anchorRefs.join(", ")}, sempre em diálogo com o restante da Escritura.`,
  ];

  const narrativeAnchored = narrative.slug !== "";

  const godSection: GeneratedThemeSection = {
    paragraphs: [
      `Na narrativa de ${narrative.name}, ${narrative.godTeaches[0]}`,
      ...theme.godTeaches,
      ...narrative.godTeaches.slice(1),
    ],
    references: narrativeAnchored
      ? narrative.godRefs
      : [...theme.godRefs, ...narrative.godRefs],
  };

  const jesusSection: GeneratedThemeSection = {
    paragraphs: [
      narrative.jesusConnection[0],
      ...theme.jesusTeaches,
      ...narrative.jesusConnection.slice(1),
    ],
    references: narrativeAnchored
      ? narrative.jesusRefs
      : [...theme.jesusRefs, ...narrative.jesusRefs],
  };

  const godPoint: GeneratedOutlinePoint = {
    title: "O que Deus ensinou",
    body: `Na narrativa de ${narrative.name}, ${narrative.godTeaches[0]} ${theme.godTeaches[0]}`,
    references: narrativeAnchored
      ? narrative.godRefs.slice(0, 2)
      : [theme.godRefs[0], narrative.godRefs[0]],
  };

  const jesusPoint: GeneratedOutlinePoint = {
    title: "O que Jesus revelou",
    body: `${narrative.jesusConnection[0]} ${theme.jesusTeaches[0]}`,
    references: narrativeAnchored
      ? narrative.jesusRefs.slice(0, 2)
      : [theme.jesusRefs[0], narrative.jesusRefs[0]],
  };

  const theologicalPoints = emphasis === "jesus" ? [jesusPoint, godPoint] : [godPoint, jesusPoint];

  const outline: GeneratedOutlinePoint[] = [
    {
      title: "O cenário histórico",
      body: `${narrative.setting} Este é o chão concreto onde a revelação de Deus acontece.`,
      references: narrative.anchorRefs,
    },
    {
      title: `A crise: ${narrative.crisis}`,
      body: narrative.crisisText,
      references: narrative.crisisRefs,
    },
    ...theologicalPoints,
    {
      title: `A resposta: ${theme.short.toLowerCase()} em prática`,
      body: `${theme.applications[0]} ${narrative.application}`,
      references: [...theme.responseRefs, ...narrative.godRefs.slice(1)],
    },
  ];

  const allReferences = [
    ...(narrativeAnchored ? [] : theme.godRefs),
    ...(narrativeAnchored ? [] : theme.jesusRefs),
    ...theme.responseRefs,
    ...narrative.anchorRefs,
    ...narrative.crisisRefs,
    ...narrative.godRefs,
    ...narrative.jesusRefs,
    theme.dailyRef,
  ];

  const references = await resolveVerseReferences(allReferences);
  const dailyVerse = await resolveVerseReference(theme.dailyRef);

  const dailyMessage: GeneratedDailyMessage = {
    title: theme.dailyTitle,
    reference: dailyVerse.reference,
    verseText: dailyVerse.text,
    href: dailyVerse.href,
    body: [
      theme.summary,
      `Na narrativa de ${narrative.name}, ${narrative.crisis.toLowerCase()} se torna o lugar onde Deus revela seu caráter. ${narrative.summary[0]}`,
      theme.jesusTeaches[0],
    ],
    practice: theme.practice,
    prayer: theme.prayer,
  };

  return {
    title,
    subtitle: `Um estudo sobre ${theme.short.toLowerCase()} com contexto histórico, o ensino de Deus e a voz de Jesus. Preparado para ${audience.toLowerCase()}.`,
    themeSlug: theme.slug,
    themeName: theme.name,
    narrativeSlug: narrative.slug,
    narrativeName: narrative.name,
    emphasis,
    emphasisLabel: emphasisLabel[emphasis],
    audience,
    period: narrative.period,
    king: narrative.king,
    generatedAt: new Date().toISOString(),
    historicalContext: contextParagraphs,
    contextReferences: narrative.anchorRefs,
    narrative: narrative.summary,
    narrativeReferences: narrative.crisisRefs,
    god: godSection,
    jesus: jesusSection,
    outline,
    applications: [...theme.applications, narrative.application],
    prayer: theme.prayer,
    references,
    dailyMessage,
  };
}

export function getGeneratorTheme(slug: string) {
  return GENERATOR_THEMES.find((theme) => theme.slug === slug) ?? null;
}

export function getGeneratorNarrative(slug: string) {
  return GENERATOR_NARRATIVES.find((narrative) => narrative.slug === slug) ?? null;
}
