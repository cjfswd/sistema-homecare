# Requisitos e estado do sistema de home care (HealthMais)

Documento único que consolida as conversas sobre o sistema de gestão da HealthMais. Junta a estratégia (sistema de mercado x sistema próprio), os módulos, a evolução, a prescrição, a prorrogação, os indicadores, o faturamento e a interoperabilidade, com as decisões já tomadas e as pendências.

## 1. Contexto e estratégia

- A dor declarada: a empresa **não tem um sistema de gestão unificado**, com lacunas em informação de paciente, faturamento e controle de estoque.
- Duas frentes em paralelo:
  1. **Sistema de mercado**: MV e SpinCare foram avaliados e não seguiram. Hoje usam o **Mais Vidas** (HopeSolution). O **AxoraCare** (fornecedor Raul) é o sistema futuro para HealthMais e Córdiva (licença, valores e ciclo a definir).
  2. **Sistema próprio** em protótipo (Prontuário HealthMais).
- O diretor médico foi ao **HIS 2026** (Healthcare Innovation Show, São Paulo Expo, 16 e 17/09/2026); o critério de escolha de sistema foi preparado para a conversa após o evento.
- Quer uma **RFP** com requisitos de **FHIR**.
- A cláusula 10 (rescisão) do contrato de licença com a HopeSolution foi analisada.

## 2. Sistema próprio: protótipo Prontuário HealthMais

- Módulos do protótipo (em canvas): **pacientes, prontuário, escala, farmácia, compras, faturamento, RH, notificações**.
- **Permissões por módulo** (não por exceção individual).
- **Tours guiados** montados automaticamente a partir dos módulos habilitados em cada perfil.
- No protótipo: **sem** assinatura eletrônica e **sem** integração com WhatsApp.
- Prontuário: por enquanto não envia contrato pela plataforma nem evoluções direto à operadora. Cada paciente tem uma operadora ou é particular. Situação do paciente: alta, óbito, internação hospitalar. Bloquear profissional = bloquear só o login.

## 3. Perfis e evolução objetiva

- O **profissional de ponta** usa um **site** (não app), com **geolocalização, microfone e horário** habilitados.
- O **perfil** (técnico de enfermagem, enfermagem, fisioterapia, fonoaudiologia ou médico) **define o formulário**; o profissional não escolhe o tipo.
- Sem agendamento prévio: o profissional escolhe na lista de pacientes quem vai evoluir. Devoluções aparecem só em "Minhas evoluções".
- **Evolução objetiva (checkbox)** por categoria, para enfermagem e fisioterapia (telas montadas a partir de 17 post-its de ajuste). O **campo de fonoaudiologia** ficou para confirmar.
- A **evolução médica é texto livre** com gravação de áudio e transcrição (não checkbox).

## 4. Evolução médica por áudio (escriba)

- Decisão: **solução própria**, não ferramenta pronta, a **custo marginal zero** (só a assinatura do Claude, sem pagar API; self-host ou recursos nativos).
- Captura: **ditado nativo do celular** (iPhone/Android) via **PWA**. Descartados: extensão de navegador e áudio de WhatsApp. Os médicos usam majoritariamente iPhone.
- A **IA só padroniza** a evolução, não redige.
- Transcrição local própria ficou **lenta e com qualidade duvidosa**; segue a busca por alternativa gratuita de alta qualidade (Groq Whisper foi comparado).

## 5. Prorrogação (fluxo home care)

- Página de prorrogação com **3 abas** (evolução, prorrogação, prescrição), cada uma com botão de salvar.
- A **evolução transcrita do áudio é exportada e importada** na prorrogação, junto com as validações do prompt de prorrogação.
- A aba **Prescrição** ficou como espaço reservado.

## 6. Prescrição (estudo AxoraCare)

- Login do médico, catálogo de itens, prescrição médica e de enfermagem.
- Documentação de requisitos com **diagramas UML** (prescrição médica e de enfermagem) para validar com a diretoria.
- Perguntas em aberto para o Raul: **assinatura CFM** e **medicamentos controlados**.

## 7. Indicadores

- Projeto no GitHub: **`cjfswd/indicadores-healthmais`** (painel de indicadores assistenciais).
- Nova **categorização v2** (quadro/mapa mental em PDF e CSV); escopo: tudo, incluindo schema de custo e denominador.
- Base de dados migrada de **MongoDB para PostgreSQL**.
- Ao aplicar a taxonomia v2, foram diagnosticados e corrigidos **6 problemas** que causavam perda de dados.
- Ideia (sem definição ainda): criar 5W2H, SWOT, Ishikawa e Kanban dentro do sistema de indicadores.

## 8. Faturamento

- Padronizar as planilhas de faturamento da HealthMais **dentro do sistema próprio**, com integração direta à gestão de evoluções.

## 9. Notificações e eventos

- **Mural de Recados** (feed de eventos dos pacientes) e **Prorrogação de Evolução** leem da **mesma tabela de eventos** dos indicadores.

## 10. Interoperabilidade (para a RFP)

- Padrões: **HL7 x FHIR e TISS**; há um esquema de **API FHIR** para home care.
- Critério: importar **Brasíndice** e **Simpro** (bases de preço de medicamentos e materiais).
- Documentação das versões do TISS e da nota fiscal ficou incompleta (retomar).

## 11. Requisitos funcionais consolidados

- Levantamento de **149 RFs em 14 módulos** de uma plataforma de home care unificando SpinCare e IW-Care. A lista completa está na conversa "Features compiladas dos projetos"; trazer para cá quando for detalhar RF a RF.
- Documento de diagnóstico do estado atual dos sistemas do Mais Vidas: onde o processo é inadequado e onde já funciona.

## 12. Avaliação de fornecedores

| Sistema | Fornecedor | Situação |
|---|---|---|
| MV | - | avaliado, não seguiu |
| SpinCare | - | avaliado, não seguiu |
| Mais Vidas | HopeSolution | em uso (R$ 3.450/mês); cláusula 10 de rescisão analisada |
| AxoraCare | Raul | sistema futuro (HealthMais e Córdiva); licença/valores/ciclo a definir |

- Técnica: **mapeamento só leitura** de um sistema em produção (operado por fornecedor), sem alterar dados, conduzido como projeto do Claude Code (SDD, grafos e revisão de segurança).

## 13. Decisões e pendências em aberto

- Confirmar o **campo de fonoaudiologia** na evolução objetiva.
- Detalhar a aba **Prescrição** (hoje reservada).
- Levar ao **Raul**: assinatura CFM e controlados no AxoraCare.
- Achar uma **alternativa gratuita de alta qualidade** para a transcrição de áudio.
- Definir **modelo de licença e valores** do AxoraCare.
- Formalizar o **documento de requisitos da RFP** com FHIR/TISS (ainda não feito).
- Retomar a **documentação das versões do TISS** e da nota fiscal.
