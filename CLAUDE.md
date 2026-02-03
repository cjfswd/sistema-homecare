# Sistema Homecare (Sistema do Futuro)

## Visão Geral

Sistema de gestão de home care para gerenciar operações de atendimento domiciliar no Brasil. Inclui gestão de pacientes, profissionais, finanças, estoque, agendamento, evolução clínica, prescrições e controle de acesso baseado em papéis (RBAC).

## Stack Tecnológico

- **Framework:** React 19 com TypeScript 5.9 (strict mode)
- **Bundler:** Vite com rolldown-vite (experimental)
- **Estilo:** Tailwind CSS 4 via plugin Vite
- **Roteamento:** React Router v7
- **Ícones:** Lucide React
- **Gerenciador de pacotes:** pnpm
- **React Compiler:** habilitado via Babel plugin

## Comandos Principais

- `pnpm dev` — servidor de desenvolvimento com HMR
- `pnpm build` — build de produção (tsc + vite build)
- `pnpm lint` — verificação ESLint
- `pnpm preview` — preview do build de produção

## Estrutura do Projeto

- `src/pages/` — componentes de página (vinculados às rotas)
- `src/modules/` — módulos de funcionalidade com lógica de negócio
- `src/components/` — componentes reutilizáveis organizados por domínio
- `src/components/ui/` — componentes atômicos de interface (Button, Modal, Card, Table, etc.)
- `src/components/forms/` — componentes de formulário (Input, Select, SearchInput)
- `src/types/` — definições de tipos TypeScript centralizadas
- `src/lib/` — serviços, utilitários e formatadores
- `src/lib/mockData/` — geradores de dados mock para desenvolvimento
- `src/layouts/` — wrappers de layout (DashboardLayout)

## Convenções de Código

- Path alias configurado: `@/*` mapeia para `src/*`
- Barrel exports (index.ts) em cada diretório de componentes
- Componentes seguem nomenclatura PascalCase
- Arquivos de tipo organizados por domínio (clinical.ts, financial.ts, logistics.ts, etc.)
- TypeScript strict mode — sem variáveis ou parâmetros não utilizados

## Arquitetura

- **Sem backend** — aplicação client-side only com dados mock
- **Persistência via localStorage** — chaves prefixadas com `homecare_`
- **Comunicação entre componentes** — CustomEvent para sincronização
- **Sem gerenciamento de estado externo** — apenas useState e localStorage
- **Serviços singleton** — AuthService (RBAC) e LoggingService (audit trail)
- **Rotas protegidas** — via componente ProtectedRoute com autenticação localStorage

## Domínio (Home Care)

O sistema lida com entidades do domínio de saúde domiciliar:
- **Pacientes** — CPF, diagnóstico, endereço, alergias, status
- **Profissionais** — médicos, enfermeiros, técnicos, fisioterapeutas, fonoaudiólogos, admins
- **Serviços** — procedimentos, consultas, plantões, locações com tabela de preços
- **Evoluções clínicas** — sinais vitais, notas, documentos por profissional
- **Prescrições** — medicamentos, cuidados, dispensação
- **Orçamentos (PAD)** — original, aditivo, prorrogação
- **Estoque** — multi-localização, transferências, perdas
- **Agendamento** — calendário com check-in/check-out geolocalizados

## Deploy

Build para `dist/` com deploy via gh-pages.
