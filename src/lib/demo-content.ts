export type DemoCategory = {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
};

export type DemoPost = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured?: boolean;
  status?: "published" | "draft" | "scheduled";
  published_at: string | null;
  views: number;
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    name: "Devocionais",
    slug: "devocionais",
    description: "Reflexões curtas para começar e terminar o dia com as Escrituras.",
    color: "#a4542e",
    icon: "sun",
  },
  {
    name: "Estudos Bíblicos",
    slug: "estudos-biblicos",
    description: "Exegese acessível, contexto histórico e aplicação para a vida.",
    color: "#2f5d62",
    icon: "book-open",
  },
  {
    name: "Vida Cristã",
    slug: "vida-crista",
    description: "Fé no trabalho, nas relações e nas escolhas de todo dia.",
    color: "#6b4f8a",
    icon: "heart",
  },
  {
    name: "Teologia",
    slug: "teologia",
    description: "Pensar a fé com rigor, humildade e reverência.",
    color: "#7c2d3a",
    icon: "library",
  },
  {
    name: "Família",
    slug: "familia",
    description: "A casa como primeiro lugar de discipulado.",
    color: "#8a6a2f",
    icon: "home",
  },
  {
    name: "Jovens",
    slug: "jovens",
    description: "Perguntas honestas, fé corajosa e liberdade com direção.",
    color: "#2f6b4f",
    icon: "sparkles",
  },
];

export const DEMO_POSTS: DemoPost[] = [
  {
    slug: "o-silencio-que-ensina-a-orar",
    title: "O silêncio que ensina a orar",
    subtitle: "Antes de aprender a falar com Deus, talvez precisemos aprender a ficar quietos diante dele.",
    excerpt:
      "A oração moderna virou uma fila de pedidos. O salmista propõe outro começo: aquietar-se. Um convite a descobrir o silêncio como linguagem da fé.",
    category: "devocionais",
    tags: ["oração", "silêncio", "espiritualidade"],
    featured: true,
    published_at: "2026-11-18T09:00:00",
    views: 1842,
    content: `Há dias em que a oração parece uma sala cheia. Muitas vozes, muitos pedidos, muita pressa. Entramos, falamos, entregamos a lista e saímos. O encontro aconteceu, mas ninguém escutou.

O salmista conhecia outra porta de entrada:

> “Aquietai-vos, e sabei que eu sou Deus.” — Salmos 46:10

O verbo hebraico por trás de “aquietai-vos” não significa apenas parar de falar. Significa relaxar as mãos, soltar o controle, reconhecer que o mundo não depende de nós para continuar de pé. É uma rendição, não uma pausa técnica.

## O silêncio não é vazio

Nós tratamos o silêncio como ausência. Mas, na Escritura, o silêncio é frequentemente o lugar onde a presença se torna mais nítida. Elias não encontrou Deus no vento forte, nem no terremoto, nem no fogo. Encontrou-o no “murmúrio de uma brisa suave” (1 Reis 19:12).

Isso não quer dizer que Deus só fale baixo. Quer dizer que nós só conseguimos ouvir quando baixamos o volume da própria ansiedade.

## Uma prática de dez minutos

Não é preciso transformar a oração em mais uma tarefa a ser cumprida. Comece com dez minutos, três movimentos:

1. **Chegue.** Sente-se. Nomeie o que você está sentindo: cansaço, medo, gratidão, pressa. Não corrija nada ainda.
2. **Fique.** Leia um salmo em voz baixa. Depois, fique em silêncio por dois ou três minutos. Quando a mente fugir — e ela vai fugir —, volte ao versículo, sem se punir.
3. **Entregue.** Termine com uma frase curta: “Senhor, tu sabes. Eu confio.” O silêncio não precisa terminar com uma conclusão brilhante.

## Quando o silêncio dói

Há silêncios que não são paz, são luto. Se a quietude diante de Deus abrir feridas, não fuja delas. Os salmos de lamento existem porque a Bíblia não exige que a dor se vista de serenidade. O silêncio bíblico não é o silêncio de quem não tem perguntas; é o silêncio de quem sabe a quem perguntar.

A oração começa com o ouvido. E o ouvido, às vezes, só abre quando a boca descansa.

**Para levar ao dia:** antes de pedir qualquer coisa hoje, fique trinta segundos em silêncio. Deixe que esse seja o primeiro ato da sua oração.`,
  },
  {
    slug: "salmos-23-quando-o-caminho-atravessa-o-vale",
    title: "Salmos 23: quando o caminho atravessa o vale",
    subtitle: "O pastor não promete um atalho. Promete companhia, direção e uma mesa no fim.",
    excerpt:
      "Salmos 23 não é um hino sobre uma vida sem dificuldades. É uma confissão de quem aprendeu a reconhecer o pastor dentro do vale — e à mesa.",
    category: "estudos-biblicos",
    tags: ["salmos", "sofrimento", "confiança"],
    featured: true,
    published_at: "2026-11-12T08:30:00",
    views: 2401,
    content: `Poucas passagens são tão conhecidas — e tão mal compreendidas — quanto o Salmo 23. Ele aparece em cartões, funerais e tatuagens. Mas o poema não começa com uma promessa de prosperidade. Começa com uma relação: “O Senhor é o meu pastor.”

## O pastor não é uma metáfora decorativa

Para Davi, falar de pastor era falar de trabalho, cheiro de ovelha e risco real. O pastor caminhava na frente, conhecia os poços, enfrentava predadores. A ovelha não escolhia o caminho; ela reconhecia a voz.

Por isso a frase seguinte é tão ousada: “nada me faltará.” Não porque nada de ruim acontecerá, mas porque o pastor é suficiente para o que acontecer.

## O vale não é um acidente

> “Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.” — Salmos 23:4

Observe a mudança de pronome. Nos primeiros versículos, Davi fala de Deus na terceira pessoa: “ele me faz repousar”. No vale, passa para a segunda: “tu estás comigo.” A crise não afasta Deus; muitas vezes, é o lugar onde a fé deixa de ser teoria e se torna endereço.

O texto não diz que o pastor desvia a ovelha do vale. Diz que ele a acompanha dentro dele. A vara e o cajado são instrumentos de defesa e de correção: o pastor não apenas consola, ele protege e orienta.

## A mesa no meio da estrada

Há uma imagem inesperada no fim do salmo. O pastor, que caminhava com as ovelhas, agora prepara uma mesa “na presença dos meus adversários” (v. 5). A hospitalidade de Deus não espera a guerra acabar. Ele põe a mesa enquanto os inimigos ainda estão por perto.

O óleo sobre a cabeça não é perfume de festa; é cuidado de quem trata feridas. O cálice transbordante não é excesso, é suficiência que não se calcula.

## Como ler este salmo hoje

- **Se você está no vale:** não se cobre uma fé sem lágrimas. O salmo foi escrito para ser orado ali.
- **Se está na mesa:** não se esqueça de quem ainda caminha. A suficiência do pastor se torna hospitalidade nas mãos das ovelhas.
- **Se está no começo:** volte ao primeiro verso. A vida com Deus não começa com respostas, começa com uma voz que você reconhece.

O Salmo 23 termina com uma certeza que atravessa o vale e a mesa: “habitarei na casa do Senhor por longos dias.” O caminho tem destino. E o destino é casa.`,
  },
  {
    slug: "a-fe-nao-e-ausencia-de-duvidas",
    title: "A fé não é ausência de dúvidas",
    subtitle: "Talvez a dúvida não seja o contrário da fé, mas o lugar onde a fé aprende a ficar de pé.",
    excerpt:
      "Quem nunca duvidou talvez nunca tenha levado a fé a sério. Uma conversa honesta sobre certeza, coragem e a fé que convive com perguntas.",
    category: "vida-crista",
    tags: ["dúvida", "fé", "honestidade"],
    published_at: "2026-11-06T10:00:00",
    views: 1320,
    content: `Existe uma versão de testemunho que soa impecável: antes eu duvidava, depois encontrei Deus, e desde então nunca mais tive uma pergunta. Muita gente ouve isso e conclui que a sua fé é defeituosa, porque ainda pergunta.

Mas a Bíblia é menos arrumada do que os nossos púlpitos.

## Os heróis também perguntam

Abraão riu da promessa. Sara riu de novo. Moisés discutiu com Deus diante da sarça. Davi gritou “até quando?”. Habacuque perguntou por que a violência não era contida. João Batista, preso, mandou perguntar se Jesus era realmente o esperado. Tomé quis tocar as feridas.

Em nenhum desses casos a pergunta é tratada como traição. É tratada como conversa.

## Dúvida e incredulidade não são a mesma coisa

A incredulidade fecha a porta e vai embora. A dúvida fica na porta, batendo, querendo saber se vale a pena entrar. Uma rejeita o convite; a outra quer entender o anfitrião.

Isso não significa que toda dúvida seja inofensiva. Há dúvidas que se alimentam de isolamento, de cinismo e de conteúdo consumido sem digestão. A diferença raramente está na pergunta; está no que fazemos com ela.

## Três movimentos para uma fé que pergunta

1. **Nomeie a dúvida.** “Não entendo por que Deus permite isso” é mais honesto do que “estou bem”. A fé bíblica não exige maquiagem.
2. **Leve a dúvida para a comunidade.** Perguntas trancadas dentro de nós apodrecem. Perguntas ditas em confiança podem amadurecer.
3. **Continue praticando.** A dúvida não precisa parar a oração, o serviço e o amor ao próximo. Muitas vezes, a fé cresce enquanto as mãos continuam abertas.

## A certeza que não depende de nós

A fé cristã não é a certeza de que temos todas as respostas. É a confiança de que Aquele que tem as respostas nos segura mesmo quando não as vemos. Como o pai do menino em Marcos 9, podemos orar: “Creio, ajuda a minha incredulidade.”

Se hoje você só consegue dizer isso, já está orando. E já está em casa.`,
  },
  {
    slug: "como-ler-a-biblia-em-15-minutos-por-dia",
    title: "Como ler a Bíblia em 15 minutos por dia",
    subtitle: "Um método simples, sustentável e livre da culpa de não ter lido “a Bíblia toda” em um mês.",
    excerpt:
      "Não é sobre velocidade, é sobre constância. Um roteiro de 15 minutos com contexto, observação, oração e uma única aplicação concreta.",
    category: "estudos-biblicos",
    tags: ["leitura bíblica", "disciplina", "método"],
    published_at: "2026-10-29T07:45:00",
    views: 3105,
    content: `A pergunta mais comum sobre leitura bíblica não é “qual livro leio?”, mas “como encontro tempo?”. A resposta bíblica não é encontrar tempo; é oferecer um tempo, mesmo pequeno, com regularidade.

Quinze minutos por dia parecem pouco. Em um ano, são mais de noventa horas dentro da Escritura. É tempo suficiente para atravessar livros inteiros e criar raízes.

## O roteiro dos 15 minutos

**Minutos 1–2 — Chegue e ore.** Não comece lendo para cumprir tabela. Peça a Deus atenção. Uma frase basta.

**Minutos 3–5 — Leia o texto duas vezes.** A primeira leitura é para saber o que acontece. A segunda é para notar detalhes: palavras repetidas, personagens, lugares, emoções.

**Minutos 6–9 — Entenda o contexto.** Quem escreve? Para quem? O que vem antes e depois? Uma boa Bíblia de estudo ou as notas de introdução ajudam, mas não substituem a leitura do próprio texto.

**Minutos 10–13 — Faça três perguntas.**
- O que este texto revela sobre Deus?
- O que revela sobre o ser humano?
- O que muda na minha vida se isso for verdade?

**Minutos 14–15 — Ore e escreva uma frase.** Não um plano de dez passos. Uma frase: “Hoje vou…” A aplicação precisa caber no seu dia real.

## Um plano que não fracassa

Escolha um livro e leia em sequência. Se parar, retome de onde parou. Não recomece do Gênesis pela décima vez. A constância vale mais do que a originalidade.

Se você tem só cinco minutos em um dia, leia cinco minutos. O objetivo não é bater meta; é permanecer na conversa.

## Ferramentas que ajudam

- Um caderno ou aplicativo de notas com data.
- Uma tradução que você entenda. A Bíblia Livre, disponível na seção Bíblia deste site, é uma opção em português.
- Um plano de leitura — temos planos de 7, 21 e 30 dias na Biblioteca.
- Silêncio. Sem notificações. O celular pode esperar quinze minutos.

## A meta não é terminar

Ler a Bíblia não é uma corrida com linha de chegada. É aprender a reconhecer a voz de Deus no texto, dia após dia, até que o texto passe a habitar em nós. Quinze minutos fiéis fazem mais do que três horas heroicas uma vez por semestre.`,
  },
  {
    slug: "o-que-a-mesa-de-jesus-ensina-sobre-hospitalidade",
    title: "O que a mesa de Jesus ensina sobre hospitalidade",
    subtitle: "Antes de ser um móvel, a mesa é uma teologia: quem se senta, quem serve e quem é convidado.",
    excerpt:
      "Jesus foi acusado de comer com as pessoas erradas. Talvez a acusação fosse verdade — e talvez isso diga tudo sobre o Reino.",
    category: "teologia",
    tags: ["hospitalidade", "jesus", "reino"],
    published_at: "2026-10-21T11:00:00",
    views: 986,
    content: `Os evangelhos dão à mesa um lugar que a nossa espiritualidade individualista costuma esquecer. Jesus não apenas ensinava enquanto as pessoas comiam; ele ensinava comendo.

## A acusação que revela o evangelho

“Este recebe pecadores e come com eles” (Lucas 15:2). A frase foi dita como crítica. Tornou-se uma das melhores descrições da missão de Jesus.

Na cultura do primeiro século, comer com alguém era declarar pertencimento. A mesa não era um detalhe doméstico; era um mapa social. Ao sentar-se com cobradores de impostos, prostitutas e gente sem reputação, Jesus não estava sendo ingênuo. Estava reordenando o mapa.

## O banquete e os convidados improváveis

Em Lucas 14, Jesus conta a parábola do grande banquete. Os convidados de honra recusam o convite. O senhor manda trazer “os pobres, os aleijados, os cegos e os coxos”. Ainda sobra lugar, e ele manda buscar quem está “pelos caminhos e valados”.

A lógica do Reino é constrangedora: a mesa não é preenchida por mérito, mas por graça. E a graça não apenas perdoa; ela senta à mesa.

## Hospitalidade como disciplina espiritual

Ser hospitaleiro não exige uma casa grande. Exige atenção. Exige abrir espaço para alguém que não pode retribuir. Exige a coragem de ser interrompido.

Algumas perguntas para a sua mesa:

- Quem nunca é convidado para a minha casa?
- Meus encontros giram em torno de quem me faz bem ou de quem precisa de companhia?
- Eu sirvo para ser visto ou para que o outro se sinta em casa?
- Há lugar para a conversa difícil, ou só para o clima leve?

## A mesa que aponta para a cruz

Na última ceia, Jesus lavou os pés dos discípulos antes de servir o pão. A hospitalidade do Reino é inseparável do serviço e do sacrifício. Não é apenas receber bem; é entregar-se.

A mesa de Jesus não é um clube fechado de pessoas arrumadas. É um lugar onde os famintos são alimentados, os culpados são perdoados e os estranhos se tornam família. Se a Igreja leva isso a sério, a sua mesa precisa parecer um pouco com a dele.`,
  },
  {
    slug: "criar-filhos-na-era-das-telas",
    title: "Criar filhos na era das telas",
    subtitle: "A atenção é o primeiro ato de amor — e a primeira coisa que as notificações roubam.",
    excerpt:
      "Não existe fórmula para criar filhos no mundo digital. Mas existe uma liturgia diária capaz de formar mais do que qualquer regra: a liturgia da atenção.",
    category: "familia",
    tags: ["família", "tecnologia", "atenção"],
    published_at: "2026-10-14T08:00:00",
    views: 1544,
    content: `Toda família tem uma liturgia. Não necessariamente uma liturgia religiosa, mas uma repetição de gestos que ensina o que é importante. O modo como entramos em casa, como respondemos a uma pergunta, como olhamos (ou não) nos olhos de quem está falando.

As telas entraram nessa liturgia sem pedir licença.

## O que está em jogo

Não é apenas o tempo de tela. É o que o tempo de tela substitui. A conversa no carro. O tédio que inventa brincadeiras. O olhar que reconhece o cansaço do outro. A capacidade de ficar sozinho com os próprios pensamentos.

A atenção é a matéria-prima do amor. Quando oferecemos presença distraída, ensinamos que estar junto é apenas estar no mesmo ambiente.

## Regras ajudam, mas não bastam

Limites são necessários: horários, lugares livres de telas, conteúdo filtrado. Mas regras sem relacionamento produzem obediência externa e corações distantes.

O que forma filhos é ver os pais vivendo o que exigem. Um pai que pede para o filho largar o celular enquanto responde mensagens durante o jantar ensina duas coisas ao mesmo tempo — e a segunda é mais forte.

## Uma liturgia de atenção

- **Refeições sem tela.** Pelo menos uma refeição por dia com os celulares fora da mesa.
- **Uma pergunta melhor.** Troque “como foi o dia?” por “qual foi a parte mais difícil e a mais bonita de hoje?”.
- **Oração com nome.** Ore pelas pessoas específicas que cada filho mencionou.
- **Tédio protegido.** Não preencha todo silêncio com entretenimento.
- **Presença sem performance.** Às vezes, o filho não quer conselho; quer que você fique.

## Graça para os pais que erram

Nenhuma família acerta sempre. A boa notícia é que a liturgia da graça também se aprende: pedir perdão, recomeçar, olhar de novo. Filhos não precisam de pais perfeitos. Precisam de pais presentes o suficiente para mostrar que o amor não é uma notificação — é uma presença que fica.`,
  },
  {
    slug: "voce-nao-precisa-ter-todas-as-respostas",
    title: "Você não precisa ter todas as respostas",
    subtitle: "A pressão de parecer resolvido é uma prisão. A fé madura sabe habitar perguntas.",
    excerpt:
      "Vivemos numa cultura que confunde convicção com arrogância e dúvida com fraqueza. Uma palavra para quem tem vinte e poucos anos e já se cansou de fingir.",
    category: "jovens",
    tags: ["juventude", "identidade", "perguntas"],
    published_at: "2026-10-07T18:30:00",
    views: 2210,
    content: `Existe uma idade em que parece que todo mundo já descobriu a vida — menos você. Os amigos têm certeza sobre a carreira, o relacionamento, a fé. Você tem perguntas. E, como ninguém parece ter espaço para elas, você aprende a fingir.

Fingir que sabe. Fingir que crê. Fingir que está bem.

## O problema com a fé performática

A fé performática não é fé; é teatro. Ela funciona até o dia em que a plateia vai embora. E, quando vai, sobra um silêncio que assusta.

A Bíblia tem espaço para esse silêncio. Jó passa capítulos inteiros sem resposta. Eclesiastes olha para a vida e diz que muita coisa é “vaidade”. Jeremias chora. Os discípulos fogem. A Escritura não é um manual de pessoas que nunca se perderam; é o registro de pessoas que se perderam e foram encontradas por Deus.

## Convicção não é arrogância

Ter convicções não significa ter resposta para tudo. Significa saber em quem confiar quando as respostas não vêm. É possível dizer “eu não sei” e continuar cristão. É possível dizer “estou com raiva de Deus” e continuar orando. É possível dizer “não entendo a Igreja” e continuar amando o Corpo.

## Um convite à honestidade

Se você está cansado de fingir, comece por um lugar seguro: um amigo, um pastor, um caderno. Nomeie o que você realmente pensa. Deus não se assusta com a sua pergunta; ele já a conhece.

E lembre-se: a fé não é o troféu de quem nunca duvidou. É o caminho de quem decidiu continuar andando com Deus mesmo quando a névoa não levantou. Você não precisa ter todas as respostas para pertencer. Precisa apenas continuar.`,
  },
  {
    slug: "a-oracao-que-comeca-com-o-ouvido",
    title: "A oração que começa com o ouvido",
    subtitle: "Elias aprendeu que nem todo barulho é voz — e nem toda voz é barulho.",
    excerpt:
      "No monte, Elias esperou vento, terremoto e fogo. Deus veio no murmúrio. Uma reflexão sobre escuta, solidão e a voz que nos encontra.",
    category: "devocionais",
    tags: ["oração", "elias", "escuta"],
    published_at: "2026-09-30T06:30:00",
    views: 745,
    content: `Há um tipo de cansaço que não se resolve com sono. Elias estava nele. Depois de vencer no Carmelo, fugiu para o deserto, pediu a morte e dormiu debaixo de uma árvore. O profeta do fogo estava exausto.

Deus não o repreendeu com um sermão. Deu-lhe pão, água e sono. Depois, o levou a uma caverna e passou a falar.

## Vento, terremoto, fogo

“E o Senhor passava; e um grande e forte vento fendia os montes... mas o Senhor não estava no vento. Depois do vento, um terremoto... mas o Senhor não estava no terremoto. Depois do terremoto, um fogo... mas o Senhor não estava no fogo. E depois do fogo, o murmúrio de uma brisa suave.” (1 Reis 19:11-12)

Nós procuramos Deus no espetacular. Esperamos que ele fale por meio de sinais grandiosos, circunstâncias dramáticas, emoções intensas. Elias esperou o mesmo. Mas Deus escolheu o quase imperceptível.

## A voz que pergunta

O primeiro coisa que Deus diz a Elias não é uma ordem. É uma pergunta: “Que fazes aqui, Elias?” (v. 13). Deus sabe a resposta. A pergunta é um convite a falar.

Elias responde com a dor: “Só eu fiquei, e procuram tirar-me a vida.” Ele se sente sozinho, incompreendido, descartável. Deus não corrige a percepção com um “não é bem assim”. Primeiro, ele ouve. Depois, dá direção.

## Como praticar a escuta

- **Diminua o ruído.** Não apenas o som externo, mas o interno: a autocrítica, o planejamento, o medo.
- **Leia devagar.** Escolha um versículo e leia três vezes. Deixe uma palavra ficar.
- **Pergunte.** “Senhor, o que tu queres que eu veja aqui?” A resposta pode não ser imediata.
- **Espere.** A brisa não tem pressa. E Deus raramente compete com o barulho.

Elias saiu da caverna com uma tarefa e uma companhia: Eliseu. A escuta não termina em nós; termina em missão e em comunidade. Mas tudo começa quando paramos de falar o suficiente para ouvir.`,
  },
  {
    slug: "gratidao-nao-e-ingenuidade",
    title: "Gratidão não é ingenuidade",
    subtitle: "A Bíblia manda dar graças em tudo — não por tudo. A diferença é enorme.",
    excerpt:
      "Entre a gratidão que ignora a dor e a amargura que só vê a dor, existe um caminho bíblico: reconhecer o bem sem mentir sobre o mal.",
    category: "vida-crista",
    tags: ["gratidão", "sofrimento", "esperança"],
    published_at: "2026-09-22T09:15:00",
    views: 1188,
    content: `“Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco” (1 Tessalonicenses 5:18). O texto diz “em tudo”, não “por tudo”.

A diferença parece pequena, mas carrega um mundo. Não somos chamados a chamar o mal de bem, a fingir que a perda não doeu ou a agradecer pela injustiça. Somos chamados a procurar a presença de Deus dentro da circunstância, por mais escura que ela seja.

## A gratidão que a Bíblia não pede

A gratidão tóxica diz: “não reclame, tem gente pior”. Ela usa a dor alheia para silenciar a nossa. Não é bíblica. Os salmos de lamento são prova de que Deus acolhe a queixa.

A gratidão bíblica não nega a falta; reconhece o que permanece. No vale, Davi não agradece pela morte da sombra. Ele agradece porque o pastor está com ele.

## O que a gratidão faz com a gente

A gratidão não muda apenas o humor; muda a direção do olhar. Ela nos treina a notar o que sustenta a vida: o pão, a amizade, o corpo que ainda respira, a pequena misericórdia de um dia comum.

Pesquisas sobre bem-estar confirmam o que a Escritura já sabia: nomear o bem faz bem. Mas a gratidão cristã vai além da técnica de felicidade. Ela é uma forma de justiça: reconhecer que não somos autossuficientes.

## Um exercício honesto

Hoje, escreva três coisas:

1. **Uma perda** que você precisa nomear diante de Deus.
2. **Uma presença** que você reconheceu em meio a essa perda.
3. **Um pedido** de ajuda para o que ainda dói.

A gratidão não apaga o lamento. Ela o acompanha. E, juntas, as duas orações nos mantêm humanos e esperançosos.`,
  },
  {
    slug: "apocalipse-sem-sensacionalismo",
    title: "Apocalipse sem sensacionalismo",
    subtitle: "O último livro da Bíblia não foi escrito para alimentar medo, mas para sustentar a esperança de uma Igreja perseguida.",
    excerpt:
      "Mapas do fim, códigos secretos e previsões de datas transformaram o Apocalipse em entretenimento. O texto pede outra leitura: resistência, adoração e esperança.",
    category: "teologia",
    tags: ["apocalipse", "esperança", "interpretação"],
    published_at: "2026-09-15T10:00:00",
    views: 1677,
    content: `O Apocalipse vende livros. Não necessariamente por causa do seu conteúdo, mas por causa do medo que desperta. Basta uma manchete sobre a besta, um número 666 e uma data no calendário para que a especulação comece.

Mas o livro foi escrito para uma Igreja que sofria, não para um público ávido por previsões.

## Um livro pastoral

João escreve de Patmos, exilado, a sete igrejas reais na Ásia Menor. Elas enfrentavam pressão, perseguição e a tentação de se acomodar ao império. O Apocalipse é uma carta pastoral com imagens viscerais: não um quebra-cabeça para especialistas, mas um chamado à fidelidade.

A visão central não é a besta. É o Cordeiro. O poder que parece invencível é relativizado pela imagem de um Cordeiro morto, de pé, digno de adoração.

## Como ler as imagens

O gênero apocalíptico usa símbolos para falar de realidades espirituais e políticas. Os números, animais e cores não são um código a ser decifrado com uma chave secreta; são linguagem simbólica enraizada no Antigo Testamento.

Algumas perguntas melhores do que “quem é a besta?”:

- O que este texto diz sobre o poder dos impérios diante de Deus?
- Como a Igreja é chamada a resistir sem usar as armas do império?
- Qual é o centro da adoração desta cena?
- Que esperança este texto oferece a quem está sofrendo?

## A esperança que sustenta

O Apocalipse termina com uma cidade, um rio, uma árvore e uma promessa: “Ele enxugará dos seus olhos toda lágrima” (21:4). Não termina com um mapa do fim, mas com um lar.

Ler o Apocalipse sem sensacionalismo é deixar que a sua esperança seja moldada pela certeza de que o Cordeiro reina. E, se ele reina, a Igreja pode resistir com coragem, amar com ousadia e adorar sem medo — mesmo quando o império parece invencível.`,
  },
  {
    slug: "a-disciplina-da-esperanca",
    title: "A disciplina da esperança",
    subtitle: "Esperar não é ficar parado. É uma prática diária de olhar para além do agora.",
    excerpt:
      "Rascunho editorial sobre a esperança como disciplina: pequenos gestos que nos treinam a viver na direção da promessa.",
    category: "vida-crista",
    tags: ["esperança", "disciplina"],
    status: "draft",
    published_at: null,
    views: 0,
    content: `A esperança não é um sentimento que cai do céu. É uma disciplina que se aprende.

## O que estou tentando dizer

Esperar, na Bíblia, não é cruzar os braços. É plantar hoje o que só se colherá amanhã. É uma forma de resistência.

## Rascunho de estrutura

- A esperança como memória do que Deus já fez.
- A esperança como prática de comunidade.
- A esperança como cuidado com o corpo e com o outro.
- A esperança que não decepciona (Romanos 5:5).

Preencher com exemplos concretos e uma seção de aplicação.`,
  },
  {
    slug: "advento-esperar-e-um-ato-de-coragem",
    title: "Advento: esperar é um ato de coragem",
    subtitle: "Antes do menino na manjedoura, houve séculos de silêncio. A espera também é lugar de fé.",
    excerpt:
      "O Advento começa no escuro. Uma reflexão para quem está cansado de esperar e precisa reaprender a aguardar com esperança.",
    category: "devocionais",
    tags: ["advento", "esperança", "natal"],
    status: "scheduled",
    published_at: "2026-12-01T06:00:00",
    views: 0,
    content: `O calendário cristão é sábio. Antes de celebrar o Natal, ele nos faz esperar. Quatro semanas de silêncio, de luz que cresce devagar, de promessas que ainda não se cumpriram.

## A espera de Israel

Entre Malaquias e Mateus, há séculos de silêncio profético. O povo não recebeu uma nova palavra; recebeu a fidelidade de uma palavra antiga. Esperar não era passividade. Era continuar acreditando que Deus não havia esquecido.

## A nossa espera

Também esperamos. Por cura, por reconciliação, por um emprego, por uma resposta. E a espera pode nos tornar amargos ou nos tornar atentos.

O Advento nos ensina a esperar sem negar a dor. As leituras do período não pulam o exílio. Elas nos lembram de que a luz brilha no escuro, e o escuro não a venceu.

## Prática de Advento

- Acenda uma vela e leia uma promessa por dia.
- Escreva uma espera concreta em um papel e ore por ela.
- Faça um gesto de bondade que não possa ser retribuído.
- Guarde silêncio antes de dormir.

A esperança não é a certeza de que tudo sairá como planejamos. É a confiança de que Aquele que prometeu é fiel. E isso muda o modo como esperamos.`,
  },
];

export const DEMO_COMMENTS = [
  {
    post: "o-silencio-que-ensina-a-orar",
    name: "Ana Beatriz",
    email: "ana@example.com",
    content:
      "O trecho sobre o silêncio que dói me pegou. Nunca tinha pensado que orar pode ser ficar quieto sem culpa. Obrigada por escrever com tanta honestidade.",
    status: "approved" as const,
    daysAgo: 3,
  },
  {
    post: "o-silencio-que-ensina-a-orar",
    name: "Marcos Vinícius",
    email: "marcos@example.com",
    content: "Comecei a prática dos dez minutos esta semana. É incrível como a mente foge. Mas estou insistindo.",
    status: "approved" as const,
    daysAgo: 1,
  },
  {
    post: "salmos-23-quando-o-caminho-atravessa-o-vale",
    name: "Juliana Prado",
    email: "juliana@example.com",
    content:
      "A observação sobre a mudança do pronome no verso 4 me fez ler o salmo de um jeito completamente novo. Que texto!",
    status: "approved" as const,
    daysAgo: 4,
  },
  {
    post: "como-ler-a-biblia-em-15-minutos-por-dia",
    name: "Pedro Henrique",
    email: "pedro@example.com",
    content:
      "Estou usando o método há duas semanas. A parte de escrever só uma frase de aplicação foi o que me fez continuar. Antes eu tentava fazer um plano gigante e desistia.",
    status: "approved" as const,
    daysAgo: 6,
  },
  {
    post: "a-fe-nao-e-ausencia-de-duvidas",
    name: "Rebeca Lima",
    email: "rebeca@example.com",
    content: "Precisava ler isso hoje. Achei que fosse a única que ainda tinha perguntas depois de tantos anos de igreja.",
    status: "approved" as const,
    daysAgo: 2,
  },
  {
    post: "voce-nao-precisa-ter-todas-as-respostas",
    name: "Samuel",
    email: "samuel@example.com",
    content: "Esse texto deveria ser lido em todo grupo de jovens. Obrigado.",
    status: "pending" as const,
    daysAgo: 0,
  },
  {
    post: "criar-filhos-na-era-das-telas",
    name: "Carla Menezes",
    email: "carla@example.com",
    content: "A ideia da liturgia da atenção é muito boa. Vou tentar a pergunta do jantar hoje.",
    status: "pending" as const,
    daysAgo: 0,
  },
];

export const DEMO_LIBRARY = [
  {
    slug: "salmos-para-dias-dificeis",
    title: "Salmos para dias difíceis",
    subtitle: "Um guia de leitura para atravessar o vale com orações antigas",
    author: "Equipe Palavra Viva",
    type: "ebook" as const,
    pages: 48,
    featured: true,
    description:
      "Uma seleção de salmos de lamento, confiança e gratidão, com introduções curtas e perguntas para reflexão. Ideal para quem está enfrentando perda, ansiedade ou cansaço espiritual.",
    external_url: "",
    file_url: "",
  },
  {
    slug: "o-evangelho-em-90-dias",
    title: "O Evangelho em 90 dias",
    subtitle: "Uma jornada pelos quatro evangelhos",
    author: "Equipe Palavra Viva",
    type: "estudo" as const,
    pages: 112,
    featured: true,
    description:
      "Um roteiro de leitura que percorre Mateus, Marcos, Lucas e João em 90 dias, com notas de contexto, perguntas semanais e espaço para anotações.",
    external_url: "",
    file_url: "",
  },
  {
    slug: "manhas-com-deus",
    title: "Manhãs com Deus",
    subtitle: "30 devocionais para começar o dia com o coração atento",
    author: "Equipe Palavra Viva",
    type: "devocional" as const,
    pages: 72,
    featured: false,
    description:
      "Trinta leituras breves, cada uma com um texto bíblico, uma reflexão e uma oração. Para quem deseja criar o hábito de abrir a Escritura antes de abrir o celular.",
    external_url: "",
    file_url: "",
  },
  {
    slug: "caderno-de-estudos-romanos",
    title: "Caderno de Estudos: Romanos",
    subtitle: "Justificação, fé e uma vida transformada",
    author: "Equipe Palavra Viva",
    type: "estudo" as const,
    pages: 64,
    featured: false,
    description:
      "Um caderno de oito semanas para estudar Romanos em pequenos grupos. Inclui contexto histórico, perguntas de discussão e sugestões de oração.",
    external_url: "",
    file_url: "",
  },
  {
    slug: "roteiros-para-pequenos-grupos",
    title: "Roteiros para pequenos grupos",
    subtitle: "12 encontros sobre fé, comunhão e missão",
    author: "Equipe Palavra Viva",
    type: "ebook" as const,
    pages: 96,
    featured: false,
    description:
      "Doze roteiros completos para encontros de pequenos grupos: quebra-gelo, texto bíblico, perguntas, aplicação e oração. Pronto para usar.",
    external_url: "",
    file_url: "",
  },
  {
    slug: "guia-de-leitura-dos-profetas",
    title: "Guia de leitura dos Profetas",
    subtitle: "Contexto, mensagem e esperança nos livros proféticos",
    author: "Equipe Palavra Viva",
    type: "estudo" as const,
    pages: 84,
    featured: true,
    description:
      "Um mapa para ler os profetas sem se perder: quem falou, para quem, em que momento e por quê. Inclui sugestões de leitura em ordem cronológica.",
    external_url: "",
    file_url: "",
  },
];

export const DEMO_PLANS = [
  {
    slug: "7-dias-nos-salmos",
    title: "7 dias nos Salmos",
    description:
      "Uma semana para orar com os salmos de confiança e lamento. Sete leituras curtas, uma por dia, com uma pergunta simples para levar consigo.",
    featured: true,
    days: [
      {
        title: "O caminho do justo",
        passage: "Salmos 1",
        reflection: "Comece observando as imagens da árvore e da palha. O que sustenta uma vida com raízes?",
      },
      {
        title: "O pastor que acompanha",
        passage: "Salmos 23",
        reflection: "Leia o salmo duas vezes. Onde você está hoje: no pasto, no vale ou à mesa?",
      },
      {
        title: "Até quando?",
        passage: "Salmos 13",
        reflection: "Dê nome à sua espera. Depois, termine o salmo com o mesmo movimento do salmista: confiar.",
      },
      {
        title: "O refúgio",
        passage: "Salmos 46",
        reflection: "Aquietar-se é uma escolha. Separe cinco minutos de silêncio depois da leitura.",
      },
      {
        title: "Coração limpo",
        passage: "Salmos 51",
        reflection: "Escreva uma confissão honesta. Não precisa ser bonita; precisa ser verdadeira.",
      },
      {
        title: "A sede de Deus",
        passage: "Salmos 63",
        reflection: "O que você tem buscado para saciar a sede? Ore com essa pergunta.",
      },
      {
        title: "Bendize, ó minha alma",
        passage: "Salmos 103",
        reflection: "Faça uma lista de três cuidados de Deus na sua história. Agradeça por cada um.",
      },
    ],
  },
  {
    slug: "21-dias-em-proverbios",
    title: "21 dias em Provérbios",
    description:
      "Três semanas nos primeiros capítulos de Provérbios para aprender a sabedoria que se pratica na rua, no trabalho e em casa.",
    featured: true,
    days: [
      { title: "O princípio da sabedoria", passage: "Provérbios 1", reflection: "Sabedoria começa com reverência, não com informação. Onde você precisa ouvir antes de opinar?" },
      { title: "Tesouros escondidos", passage: "Provérbios 2", reflection: "Buscar sabedoria exige esforço. Que decisão hoje pede mais reflexão do que impulso?" },
      { title: "Confie de todo o coração", passage: "Provérbios 3", reflection: "Escolha uma área em que você está apoiado apenas no próprio entendimento. Entregue-a em oração." },
      { title: "Guarde o coração", passage: "Provérbios 4", reflection: "O que tem entrado pela porta dos seus olhos e ouvidos? Faça um ajuste concreto." },
      { title: "A mulher adúltera", passage: "Provérbios 5", reflection: "Fidelidade se constrói antes da tentação. Que limites protegem as suas relações?" },
      { title: "O fiador e a formiga", passage: "Provérbios 6", reflection: "Observe a formiga: pequenos passos consistentes. Qual pequeno hábito você pode retomar?" },
      { title: "A sedução da loucura", passage: "Provérbios 7", reflection: "Nem toda oportunidade é sabedoria. Que convite você precisa recusar hoje?" },
      { title: "A sabedoria que chama", passage: "Provérbios 8", reflection: "A sabedoria está disponível, mas precisa ser ouvida. Reserve tempo para escutá-la." },
      { title: "O banquete da sabedoria", passage: "Provérbios 9", reflection: "Compare os dois banquetes do capítulo. Qual deles oferece vida de verdade?" },
      { title: "A boca do justo", passage: "Provérbios 10", reflection: "Palavras constroem ou destroem. Escolha uma conversa para abençoar hoje." },
      { title: "A balança justa", passage: "Provérbios 11", reflection: "Integridade é o que fazemos quando ninguém está medindo. Reveja uma escolha recente." },
      { title: "O fruto da disciplina", passage: "Provérbios 12", reflection: "Disciplina não é punição; é direção. Onde você precisa de correção amorosa?" },
      { title: "A esperança adiada", passage: "Provérbios 13", reflection: "Nomeie uma esperança adiada. Como você pode continuar fiel enquanto espera?" },
      { title: "O caminho que parece reto", passage: "Provérbios 14", reflection: "Examine um caminho que parece certo aos seus olhos. Peça conselho a alguém maduro." },
      { title: "A resposta suave", passage: "Provérbios 15", reflection: "Uma resposta branda desarma a ira. Pratique isso em uma conversa difícil." },
      { title: "Planos e propósito", passage: "Provérbios 16", reflection: "Planeje, mas entregue. Qual plano você tem segurado com rigidez demais?" },
      { title: "O amigo em todo tempo", passage: "Provérbios 17", reflection: "Quem precisa da sua presença hoje? A amizade também é uma disciplina." },
      { title: "A língua e a vida", passage: "Provérbios 18", reflection: "Ouvir antes de responder é sabedoria. Fique em silêncio em uma discussão hoje." },
      { title: "O zelo sem conhecimento", passage: "Provérbios 19", reflection: "Boa intenção não substitui sabedoria. Onde você precisa estudar antes de agir?" },
      { title: "O conselho que corrige", passage: "Provérbios 20", reflection: "Quem pode lhe dizer a verdade? Agradeça a essa pessoa hoje." },
      { title: "A vitória com conselho", passage: "Provérbios 21", reflection: "Decisões importantes pedem conselho. Monte um pequeno conselho para sua próxima escolha." },
    ],
  },
  {
    slug: "30-dias-com-jesus",
    title: "30 dias com Jesus",
    description:
      "Um mês caminhando pelos evangelhos, do nascimento ao chamado, dos milagres à cruz e à ressurreição. Para conhecer Jesus de perto.",
    featured: true,
    days: [
      { title: "A Palavra se fez carne", passage: "João 1:1-18", reflection: "Contemple o mistério: Deus entrou na história. O que muda no seu dia?" },
      { title: "O nascimento de Jesus", passage: "Lucas 2:1-20", reflection: "Os primeiros a receber a notícia foram pastores. O que isso revela sobre o Reino?" },
      { title: "Os magos", passage: "Mateus 2:1-12", reflection: "Eles se alegraram ao ver a estrela. Onde está a sua alegria na busca por Cristo?" },
      { title: "O batismo", passage: "Mateus 3:13-17", reflection: "Jesus se identifica com os pecadores. Como você pode se aproximar de quem precisa?" },
      { title: "A tentação no deserto", passage: "Mateus 4:1-11", reflection: "Jesus responde com a Escritura. Que palavra você precisa ter à mão na próxima tentação?" },
      { title: "O chamado dos discípulos", passage: "Marcos 1:14-20", reflection: "Eles deixaram as redes imediatamente. O que você precisa deixar para seguir?" },
      { title: "O sermão da montanha", passage: "Mateus 5:1-16", reflection: "As bem-aventuranças invertem os valores. Qual delas desafia você hoje?" },
      { title: "Sal e luz", passage: "Mateus 5:13-16", reflection: "Sua vida tem sabor e direção? Escolha uma ação que torne isso visível." },
      { title: "O Pai Nosso", passage: "Mateus 6:5-15", reflection: "Ore devagar, frase por frase. Deixe cada pedido ganhar peso." },
      { title: "Não se preocupe", passage: "Mateus 6:25-34", reflection: "Liste uma preocupação e entregue-a. Observe os pássaros hoje." },
      { title: "A casa na rocha", passage: "Mateus 7:24-29", reflection: "Ouvir e praticar. Que ensinamento de Jesus você ainda não colocou em prática?" },
      { title: "A cura do paralítico", passage: "Marcos 2:1-12", reflection: "Amigos abriram o telhado. Quem você pode levar a Jesus em oração?" },
      { title: "O chamado de Levi", passage: "Marcos 2:13-17", reflection: "Jesus come com os que ninguém convida. Sua mesa reflete isso?" },
      { title: "A mulher junto ao poço", passage: "João 4:1-26", reflection: "Jesus oferece água viva. Qual sede você tem tentado saciar em outro lugar?" },
      { title: "O filho pródigo", passage: "Lucas 15:11-32", reflection: "Identifique-se com um dos filhos. O que o pai revela sobre Deus?" },
      { title: "O bom samaritano", passage: "Lucas 10:25-37", reflection: "Quem é o seu próximo hoje? Faça algo concreto por essa pessoa." },
      { title: "Marta e Maria", passage: "Lucas 10:38-42", reflection: "Serviço sem escuta vira ansiedade. Reserve um tempo para a boa parte." },
      { title: "A tempestade acalmada", passage: "Marcos 4:35-41", reflection: "Os discípulos temeram mesmo com Jesus no barco. Qual é o seu barco hoje?" },
      { title: "A multiplicação dos pães", passage: "João 6:1-15", reflection: "Jesus usa o pouco que há. O que você tem nas mãos para oferecer?" },
      { title: "O pão da vida", passage: "João 6:25-40", reflection: "O que você busca em Jesus: o pão ou o Pão? Ore com honestidade." },
      { title: "A confissão de Pedro", passage: "Mateus 16:13-20", reflection: "Quem Jesus é para você? Responda sem repetir frases prontas." },
      { title: "O monte da transfiguração", passage: "Lucas 9:28-36", reflection: "Ouça: este é o meu Filho. O que você precisa ouvir com mais atenção?" },
      { title: "O jovem rico", passage: "Marcos 10:17-31", reflection: "O que você tem dificuldade de entregar? Nomeie diante de Deus." },
      { title: "O cego Bartimeu", passage: "Marcos 10:46-52", reflection: "Ele gritou por misericórdia. Qual é o seu grito hoje?" },
      { title: "Zaqueu", passage: "Lucas 19:1-10", reflection: "Encontro gera restituição. O que precisa ser consertado em sua vida?" },
      { title: "A entrada em Jerusalém", passage: "Mateus 21:1-11", reflection: "O Rei chega manso. Como você espera que Deus venha?" },
      { title: "A última ceia", passage: "João 13:1-17", reflection: "O Mestre lava pés. Qual serviço você tem evitado?" },
      { title: "Getsêmani", passage: "Mateus 26:36-46", reflection: "Jesus ora até suar. Onde você precisa vigiar e não desistir?" },
      { title: "A cruz", passage: "João 19:16-30", reflection: "Contemple em silêncio. O que a cruz diz sobre o amor de Deus?" },
      { title: "A ressurreição", passage: "João 20:1-18", reflection: "O túmulo está vazio. Que morte em você precisa ouvir o chamado para viver?" },
    ],
  },
];

export const DEMO_DAILY_VERSES = [
  { reference: "Salmos 119:105", text: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho." },
  { reference: "Isaías 40:31", text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias." },
  { reference: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." },
  { reference: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará." },
  { reference: "Filipenses 4:6", text: "Não estejais ansiosos por coisa alguma, mas em tudo, pela oração e súplica, com ação de graças, sejam os vossos pedidos conhecidos diante de Deus." },
  { reference: "Josué 1:9", text: "Sê forte e corajoso; não temas, nem te espantes, porque o Senhor teu Deus é contigo por onde quer que andares." },
  { reference: "Romanos 8:28", text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus." },
  { reference: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento." },
  { reference: "João 14:27", text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize." },
  { reference: "Lamentações 3:22-23", text: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã. Grande é a tua fidelidade." },
  { reference: "Salmos 46:1", text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." },
  { reference: "2 Coríntios 12:9", text: "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza." },
];

export const DEMO_SUBSCRIBERS = [
  { email: "ana.beatriz@example.com", name: "Ana Beatriz", source: "home" },
  { email: "marcos.vinicius@example.com", name: "Marcos Vinícius", source: "post" },
  { email: "juliana.prado@example.com", name: "Juliana Prado", source: "home" },
  { email: "pedro.h@example.com", name: "Pedro Henrique", source: "biblioteca" },
  { email: "rebeca.lima@example.com", name: "Rebeca Lima", source: "post" },
];
