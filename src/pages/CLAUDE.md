# Pages — Páginas e Roteamento

## Estrutura de Rotas

As rotas são definidas em `App.tsx` usando React Router v7. A página de login é pública; todas as demais rotas são protegidas pelo componente ProtectedRoute e envolvidas pelo DashboardLayout (que inclui a Sidebar).

## Páginas Disponíveis

- `LoginPage` — autenticação simples via localStorage (chave `isAuthenticated`)
- `HomePage` — dashboard principal com visão geral
- `PatientsPage` — listagem de pacientes
- `PatientDetailPage` — detalhe do paciente com abas (dados, evoluções, prescrições, avaliações, financeiro)
- `ProfessionalsPage` — listagem de profissionais
- `ProfessionalDetailPage` — detalhe do profissional com abas
- `ClinicalPage` — gestão clínica (evoluções e prescrições)
- `FinancesPage` — gestão financeira (orçamentos, contas a receber/pagar, tabelas de preço)
- `TabelasPage` — tabelas de referência do sistema
- `StockPage` — gestão de estoque e logística
- `ReportsPage` — relatórios e censo
- `LogsPage` — visualização de logs de auditoria
- `NotificationsPage` — centro de notificações
- `AuthorizationPage` — gestão de papéis e permissões (RBAC)

## Convenções

- Pages são componentes finos que delegam para modules ou compõem componentes do diretório `components/`
- Nomenclatura: `*Page.tsx`
- Páginas de detalhe recebem parâmetros de rota (ex: `:id`)
- A navegação é feita pelo Sidebar em `components/navigation/`
