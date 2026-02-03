# Componentes

## Organização

Componentes estão organizados por domínio funcional, não por tipo técnico:

- `ui/` — componentes atômicos reutilizáveis (Button, Modal, Card, Table, Tabs, StatusBadge, Pagination)
- `forms/` — componentes de entrada de dados (Input, Select, SearchInput)
- `administrative/` — formulários de cadastro (PatientForm, ProfessionalForm, ServiceForm, NotificationForm)
- `clinical/` — evolução clínica, prescrições, sinais vitais
- `financial/` — orçamentos, tabelas de preço
- `logistics/` — estoque, localizações, transferências, perdas
- `professionals/` — check-in/check-out, financeiro do profissional
- `schedule/` — calendário, agendamentos (MonthView, WeekView)
- `patients/` — avaliações, orçamentos e contas do paciente
- `auth/` — ProtectedRoute para controle de acesso
- `navigation/` — Sidebar

## Convenções

- Cada diretório possui um `index.ts` com barrel exports
- Componentes de modal seguem o padrão `*Modal.tsx` (recebem props onClose e onSave/onSubmit)
- Componentes de listagem seguem o padrão `*List.tsx` ou `*View.tsx`
- Componentes de card seguem o padrão `*Card.tsx`
- Componentes de formulário seguem o padrão `*Form.tsx`
- Estilização via classes utilitárias do Tailwind CSS diretamente no JSX
- Ícones importados de `lucide-react`

## Componentes UI Base

Os componentes em `ui/` servem de fundação para toda a interface. Antes de criar elementos HTML diretos, verificar se já existe um componente base adequado (Button, Card, Table, Modal, etc.).
