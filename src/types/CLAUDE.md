# Tipos TypeScript

## Organização

Tipos centralizados e organizados por domínio, com barrel export em `index.ts`:

- `common.ts` — tipos compartilhados (statuses, roles, interfaces base)
- `administrative.ts` — pacientes, profissionais, serviços
- `clinical.ts` — evoluções, prescrições, sinais vitais
- `financial.ts` — orçamentos, contas a receber/pagar, tabelas de preço
- `logistics.ts` — estoque, movimentações, localizações
- `schedule.ts` — agendamento, check-in/check-out
- `auth.ts` — RBAC (roles, permissions, actions)
- `logs.ts` — audit trail
- `assessments.ts` — avaliações de paciente

## Convenções

- Todos os tipos são exportados via barrel export: importar de `@/types`
- Status types usam union types literais em português (ex: "pendente" | "pago" | "vencido")
- Entidades possuem campo `id` string e campos de data como string ISO
- Papéis profissionais: doctor, nurse, technician, physiotherapist, speechTherapist, admin
- Ações de permissão: view, create, edit, delete, manage
- Entidades de permissão: patients, professionals, services, evolutions, prescriptions, finances, stock, logs, roles, notifications

## Padrão de Status

O sistema usa múltiplos enums de status conforme o contexto:
- Status de registro: active, inactive, vacation, discharged, deceased
- Status de movimentação: completed, pending, approved, rejected, lost
- Status de pagamento: pendente, parcialmente_pago, pago, vencido, cancelado
- Status de agendamento: scheduled, confirmed, in_progress, completed, cancelled, no_show
