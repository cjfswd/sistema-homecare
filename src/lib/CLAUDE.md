# Lib — Serviços e Utilitários

## Serviços

### AuthService (authService.ts)
Serviço singleton para controle de acesso baseado em papéis (RBAC). Persiste dados no localStorage com chaves `homecare_roles` e `homecare_user_roles`. Gerencia roles, permissions e verifica acesso do usuário autenticado.

### LoggingService (loggingService.ts)
Serviço singleton de audit trail. Registra todas as ações do sistema no localStorage com chave `homecare_system_logs`. Fornece métodos para criar, consultar e limpar logs.

## Utilitários

### formatters.ts
Funções de formatação para datas, moeda (BRL), CPF, telefone e outros dados do domínio brasileiro.

### translations.ts
Mapeamento de traduções para labels do sistema (status, roles, categorias).

## Mock Data (mockData/)

Diretório com geradores de dados fictícios para desenvolvimento, organizados por domínio:
- patients, professionals, clinical, financial, logistics, schedule, assessments, services, auth
- Barrel export em `index.ts`

Os dados mock são inicializados no primeiro carregamento e persistidos via localStorage. Simulam um backend real para fins de prototipagem.

## Padrão de Persistência

Toda persistência usa localStorage com prefixo `homecare_`. Sincronização entre abas via CustomEvent. Não há backend ou API externa — toda a lógica é client-side.
