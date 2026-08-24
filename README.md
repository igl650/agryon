# 🐐 AGRYON — Conectando Conhecimento, Fortalecendo o Campo

<p align="center">
  <img src="src/assets/goat-logo.png" alt="AGRYON Logo" width="100" />
</p>

<p align="center">
  <strong>Plataforma mobile/social de compartilhamento de manejos técnicos, soluções para convivência com a seca e rede comunitária para produtores rurais.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Capacitor_8-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI/CD" />
</p>

---

## 📌 Visão Geral

O **AGRYON** é uma solução AgTech desenvolvida para conectar pequenos e médios criadores (caprinocultura, ovinocultura e bovinocultura) no semiárido brasileiro. 

A plataforma transforma o conhecimento tácito do produtor em um ecossistema estruturado de soluções práticas, combinando uma experiência social interativa com índices de eficiência técnica (IER), biblioteca offline e calendário sanitário integrado.

---

## ✨ Principais Funcionalidades

### 🌐 1. Feed Comunitário & Interações em Tempo Real
- **Relatos Técnicos:** Publicação de dúvidas, manejos e casos de sucesso categorizados (Sanidade, Alimentação, Água, Manejo, Reprodução).
- **Mídia em Nuvem:** Upload e streaming direto de fotos e vídeos com persistência em bucket dedicado no Supabase Storage.
- **Deleção em Cascata & Garbage Collection:** Exclusão de publicações com remoção automática dos arquivos vinculados no Storage para evitar custos desnecessários de infraestrutura.
- **Comentários & Debates:** Espaço interativo para discussão de casos clínicos e soluções de pastagem.

### ⚡ 2. Mecânica Social Otimista (*Optimistic UI*)
- **Curtidas Instantâneas:** Atualização visual imediata de *likes* via cache de mutação do `@tanstack/react-query`, com reversão automática (*rollback*) em caso de instabilidade de conexão.
- **Grafo Social (Seguidores / Seguindo):** Sistema relacional de conexões entre produtores com contadores em tempo real.
- **Modais de Conexão Estilo Instagram:** Listagem interativa de seguidores e seguidos diretamente pelo perfil, permitindo seguir/deixar de seguir diretamente pela lista.

### 🔍 3. Pesquisa Inteligente & Índice IER
- **Índice de Eficiência Rural (IER):** Soluções validadas com cálculo de viabilidade econômica, facilidade de aplicação e índice de adaptação climática.
- **Filtros Parametrizados:** Busca por categoria de problema, região (Semiárido, Sertão, Agreste) e faixa de custo estimado.
- **Busca de Produtores:** Diretório dinâmico de criadores com localização e dados do rebanho.

### 📚 4. Biblioteca Técnica & Calendário Rural
- **Guias Práticos:** Material de consulta sobre cultivo de palma forrageira, método FAMACHA, reservação hídrica e instalações.
- **Calendário Sanitário:** Acompanhamento de janelas de vacinação obrigatória, vermifugação seletiva e períodos de suplementação pré-parto.

### 👤 5. Perfil Dinâmico do Produtor
- Customização de dados da propriedade (tipo de criação, quantidade de animais, finalidade e experiência).
- Galeria de publicações próprias e estatísticas de engajamento.
- Suporte a **Modo Escuro (Dark Mode)** com persistência de preferência.

---

## 🛠️ Stack Tecnológica

### Frontend & Mobile
- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Roteamento:** [TanStack Router](https://tanstack.com/router) (Roteamento baseado em arquivos totalmente tipado)
- **Gerenciamento de Estado de Servidor:** [TanStack Query v5](https://tanstack.com/query) (Cache inteligente e mutações otimistas)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + CSS Custom Properties dinâmicas
- **Componentes Base:** [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/) (Ícones)
- **Runtime Nativo:** [Capacitor 8](https://capacitorjs.com/) (Build híbrido Android de alta performance)

### Backend & Infraestrutura (BaaS)
- **Banco de Dados:** [Supabase](https://supabase.com/) / PostgreSQL
- **Autenticação:** Supabase Auth (JWT, sessões seguras e gerenciamento de permissões)
- **Armazenamento de Mídia:** Supabase Storage com políticas de acesso público e upload autenticado
- **Segurança:** Políticas granulares de **Row Level Security (RLS)** em todas as tabelas

### DevOps & Build
- **Bundler:** [Vite 8](https://vitejs.dev/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) com pipeline automatizada de compilação Android (Gradle + Java 21) gerando artefatos `.apk` a cada push.

---

## 📐 Arquitetura & Modelagem de Dados

O banco de dados relacional foi estruturado para garantir integridade referencial, queries de alta performance e segurança a nível de linha (RLS):

```mermaid
erDiagram
    PROFILES ||--o{ POSTS : "publica"
    PROFILES ||--o{ POST_LIKES : "curte"
    PROFILES ||--o{ COMMENTS : "escreve"
    PROFILES ||--o{ FOLLOWS : "segue/seguido"
    POSTS ||--o{ POST_LIKES : "recebe"
    POSTS ||--o{ COMMENTS : "possui"

    PROFILES {
        uuid id PK "auth.users FK"
        text nome
        text username
        text municipio
        text estado
        text tipo_criacao
        text quantidade_animais
        text finalidade
        text experiencia
        timestamp created_at
    }

    POSTS {
        uuid id PK
        uuid author_id FK
        text location
        text tag
        text body
        text media_url
        text media_type
        integer likes
        timestamp created_at
    }

    POST_LIKES {
        uuid post_id PK, FK
        uuid user_id PK, FK
        timestamp created_at
    }

    FOLLOWS {
        uuid follower_id PK, FK
        uuid following_id PK, FK
        timestamp created_at
    }

    COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid author_id FK
        text text
        timestamp created_at
    }