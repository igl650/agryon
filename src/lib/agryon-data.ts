import palma from "@/assets/post-palma.jpg";
import famacha from "@/assets/post-famacha.jpg";
import pasto from "@/assets/post-pasto.jpg";
import cisterna from "@/assets/post-cisterna.jpg";

export type Producer = {
  id: string;
  name: string;
  username: string;
  location: string;
  bio: string;
  followers: number;
  following: number;
};

export const producers: Producer[] = [
  {
    id: "manuel",
    name: "Manuel Custódio",
    username: "manuelcustodio",
    location: "Uauá - BA",
    bio: "Criador de caprinos da raça Boer. Palma forrageira e convivência com a seca.",
    followers: 1284,
    following: 187,
  },
  {
    id: "francisca",
    name: "Francisca Ribeiro",
    username: "franciscaribeiro",
    location: "Petrolina - PE",
    bio: "Ovinocultura de corte. Sanidade do rebanho e método FAMACHA.",
    followers: 962,
    following: 240,
  },
  {
    id: "jose",
    name: "José Anunciação",
    username: "joseanunciacao",
    location: "Juazeiro - BA",
    bio: "Manejo rotacionado de pastagem e produção de silagem.",
    followers: 431,
    following: 128,
  },
  {
    id: "antonia",
    name: "Antônia Nogueira",
    username: "antonianogueira",
    location: "Curaçá - BA",
    bio: "Água no semiárido: cisternas de placas e bebedouros automáticos.",
    followers: 2103,
    following: 96,
  },
];

export function getProducer(id: string) {
  return producers.find((p) => p.id === id) ?? null;
}

export type Comment = {
  id: string;
  author: string;
  text: string;
};

export type Post = {
  id: string;
  authorId: string;
  author: string;
  location: string;
  time: string;
  tag: string;
  body: string;
  likes: number;
  media?: string;
  mediaType?: "image" | "video";
  comments: Comment[];
};

export const posts: Post[] = [
  {
    id: "1",
    authorId: "manuel",
    author: "Manuel Custódio",
    location: "Uauá - BA",
    time: "Ontem",
    tag: "Alimentação",
    body: "“Durante o período de seca, utilizei palma associada à silagem para complementar a alimentação dos animais. Excelente resultado na manutenção do peso!”",
    likes: 14,
    media: palma,
    mediaType: "image",
    comments: [
      { id: "c1", author: "José Anunciação", text: "Qual a proporção de palma por animal?" },
      { id: "c2", author: "Francisca Ribeiro", text: "Aqui também funcionou muito bem!" },
    ],
  },
  {
    id: "2",
    authorId: "francisca",
    author: "Francisca Ribeiro",
    location: "Petrolina - PE",
    time: "Há 3 dias",
    tag: "Sanidade",
    body: "“Adotei o método FAMACHA a cada 21 dias e reduzi em 60% o uso de vermífugo no rebanho. Menos custo e menos resistência parasitária.”",
    likes: 27,
    media: famacha,
    mediaType: "image",
    comments: [
      { id: "c3", author: "Antônia Nogueira", text: "Vou começar o cartão FAMACHA essa semana." },
    ],
  },
  {
    id: "3",
    authorId: "jose",
    author: "José Anunciação",
    location: "Juazeiro - BA",
    time: "Há 5 dias",
    tag: "Manejo",
    body: "“Dividi o pasto em três piquetes com descanso de 30 dias. A recuperação da forragem foi visível já no segundo ciclo.”",
    likes: 9,
    media: pasto,
    mediaType: "image",
    comments: [],
  },
  {
    id: "4",
    authorId: "antonia",
    author: "Antônia Nogueira",
    location: "Curaçá - BA",
    time: "Há 1 semana",
    tag: "Água",
    body: "“Instalei uma cisterna de placas ligada ao bebedouro. Garantiu água limpa para 80 cabeças durante toda a estiagem.”",
    likes: 33,
    media: cisterna,
    mediaType: "image",
    comments: [{ id: "c4", author: "Manuel Custódio", text: "Quanto custou a obra completa?" }],
  },
];

export const tagColors: Record<string, string> = {
  Alimentação: "bg-brand-soft text-brand-green-deep",
  Sanidade: "bg-brand-soft text-brand-green-deep",
  Manejo: "bg-brand-soft text-brand-green-deep",
  Água: "bg-brand-soft text-brand-green-deep",
};

export type RuralEvent = {
  id: string;
  day: string;
  month: string;
  title: string;
  description: string;
};

export const events: RuralEvent[] = [
  {
    id: "1",
    day: "15",
    month: "AGO",
    title: "Campanha de Vacinação contra Raiva",
    description: "Imunização obrigatória do rebanho na região.",
  },
  {
    id: "2",
    day: "22",
    month: "AGO",
    title: "Avaliação FAMACHA no Piquete 02",
    description: "Inspeção de coloração ocular para controle de verminose.",
  },
  {
    id: "3",
    day: "05",
    month: "SET",
    title: "Início da Suplementação Pré-parto",
    description: "Fornecimento de ração concentrada para matrizes.",
  },
  {
    id: "4",
    day: "18",
    month: "SET",
    title: "Feira Agropecuária do Semiárido",
    description: "Exposição de genética, insumos e tecnologias de baixo custo.",
  },
  {
    id: "5",
    day: "02",
    month: "OUT",
    title: "Plantio de Palma Forrageira",
    description: "Janela ideal para preparo do solo e plantio dos cladódios.",
  },
];

export type LibraryItem = {
  id: string;
  icon: "book" | "sprout" | "droplet" | "stethoscope";
  title: string;
  description: string;
};

export const library: LibraryItem[] = [
  {
    id: "1",
    icon: "book",
    title: "Manual Prático de Ovinocultura",
    description: "Guia completo sobre instalações, sanidade e manejo diário.",
  },
  {
    id: "2",
    icon: "sprout",
    title: "Cultivo e Uso da Palma Forrageira",
    description: "Como plantar, tratar e fornecer palma sem riscos de diarreia.",
  },
  {
    id: "3",
    icon: "droplet",
    title: "Convivência com a Seca",
    description: "Reservação de água, cisternas e estratégias para a estiagem.",
  },
  {
    id: "4",
    icon: "stethoscope",
    title: "Controle de Verminose no Rebanho",
    description: "Método FAMACHA, rotação de princípios ativos e prevenção.",
  },
];

export type SearchResult = {
  id: string;
  title: string;
  score: number;
  solution: string;
  detail: string;
  cost: string;
  application: string;
  adaptation: string;
  results: string;
  rating: string;
  category: string;
  region: string;
};

export const searchResults: SearchResult[] = [
  {
    id: "1",
    title: "Escassez de forragem na seca",
    score: 95,
    solution: "Uso de palma forrageira e silagem na seca",
    detail:
      "Suplementação volumosa com palma forrageira sem espinho e silagem de sorgo enriquecida com ureia.",
    cost: "Baixo",
    application: "Fácil",
    adaptation: "Alta",
    results:
      "Manutenção de 100% do rebanho sem perda de peso durante os 6 meses de estiagem.",
    rating: "Excelente",
    category: "Seca",
    region: "Semiárido",
  },
  {
    id: "2",
    title: "Baixa taxa de parição",
    score: 92,
    solution: "Estação de monta controlada com suplementação",
    detail:
      "Concentração da monta em 60 dias com flushing nutricional das matrizes antes da cobertura.",
    cost: "Médio",
    application: "Moderada",
    adaptation: "Alta",
    results: "Aumento da taxa de parição de 68% para 91% em duas estações.",
    rating: "Excelente",
    category: "Alimentação",
    region: "Sertão",
  },
  {
    id: "3",
    title: "Verminose recorrente no rebanho",
    score: 88,
    solution: "Método FAMACHA associado à rotação de pastagem",
    detail:
      "Avaliação individual da mucosa ocular a cada 21 dias com vermifugação seletiva apenas dos animais afetados.",
    cost: "Baixo",
    application: "Fácil",
    adaptation: "Alta",
    results: "Redução de 60% no uso de vermífugos e queda da mortalidade de borregos.",
    rating: "Muito bom",
    category: "Verminose",
    region: "Semiárido",
  },
  {
    id: "4",
    title: "Falta de água no período crítico",
    score: 84,
    solution: "Cisterna de placas com bebedouro automático",
    detail:
      "Captação da água de chuva do telhado do aprisco com filtragem simples e distribuição por gravidade.",
    cost: "Alto",
    application: "Moderada",
    adaptation: "Alta",
    results: "Abastecimento contínuo de 80 cabeças durante 5 meses sem carro-pipa.",
    rating: "Muito bom",
    category: "Seca",
    region: "Agreste",
  },
];

export const filterChips = [
  "Verminose",
  "Seca",
  "Alimentação",
  "Água",
  "Manejo",
  "Reprodução",
];
