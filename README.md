# Mind Ease System (Mobile)

O **Mind Ease System** é um aplicativo mobile desenvolvido com [React Native](https://reactnative.dev) e [Expo](https://expo.dev) focado na organização pessoal e bem-estar cognitivo.

## Objetivo do Projeto

O principal objetivo do Mind Ease é oferecer um ambiente de gestão de tarefas adaptável ao estado mental e cognitivo do próprio usuário. Ele foi desenhado para facilitar o foco e reduzir a sobrecarga de informações (overwhelm) por meio da personalização extrema da interface. 

O sistema conta com funcionalidades como:
- **Painel Cognitivo:** Permite o ajuste da interface visual ao seu ritmo mental daquele momento, alterando o nível de complexidade (simples vs detalhada), tamanho da fonte, espaçamentos e contrastes.
- **Gestão de Tarefas:** Integra ferramentas de foco (como Pomodoro, Kanban e Checklists) adaptáveis para impulsionar a produtividade respeitando os limites da mente.
- **Modos de Foco e Resumo:** Opções para ocultar descrições e distrações visuais, permitindo uma rotina fluída e eficiente.
- **Autenticação Segura:** Autenticação e sincronização de progresso providas através de integração robusta com [Supabase](https://supabase.com).

## Tecnologias Utilizadas

- **React Native** + **Expo** (com *Expo Router*)
- **TypeScript** para garantir segurança e previsibilidade do código
- **Gluestack UI** (`@gluestack-ui/themed` + `@gluestack-style/react`) para construção de telas modernas, responsivas e flexíveis.
- **Supabase** (`@supabase/supabase-js`) como Backend-as-a-Service para persistência de dados (Banco de dados) e Autenticação.

---

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente:

### 1. Pré-requisitos
- Ter o [Node.js](https://nodejs.org/en/) instalado (versão 18 ou superior).
- Ter configurado um emulador de Android/iOS ou o aplicativo **Expo Go** no seu celular para visualizar a aplicação; as orientações completas para ambiente React Native podem ser conferidas [na documentação do Expo](https://docs.expo.dev/get-started/installation/).

### 2. Passo a Passo

1. **Clone do Repositório (se aplicável)**
   Caso ainda não o tenha feito, primeiro acesse a pasta do projeto:
   ```bash
   cd RN-mind-ease-system-mobile
   ```

2. **Instalação das Dependências**
   Rode o comando abaixo para instalar todas as bibliotecas necessárias:
   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente**
   Existe um arquivo `.env` na raiz do projeto onde ficam as credenciais de acesso para a API do Supabase e outras plataformas. Certifique-se de preenchê-las com as chaves apropriadas do seu ambiente.
   ```bash
   # Exemplo (Verifique seu arquivo .env)
   EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

4. **Iniciando o Servidor de Desenvolvimento**
   Execute o comando do Expo para iniciar a aplicação:
   ```bash
   npx expo start
   ```

5. **Exibindo no Celular ou Emulador**
   - No terminal, um QR Code será gerado.
   - Pelo seu aparelho móvel, escaneie-o usando o app **Expo Go** (no Android via próprio app do Expo Go e no iOS pela Câmera).
   - Alternativamente, pressione `a` no terminal para rodar o emulador do Android, ou `i` para o simulador do iOS, caso os tenha instalado.

## Scripts Disponíveis
Dentro do arquivo `package.json`, alguns scripts podem ser rodados utilizando `npm run <script>`:

- `npm run start` ou `npx expo start`: Inicia o bundler do Expo.
- `npm run android`: Inicia o app no emulador Android de modo direto.
- `npm run ios`: Inicia o app no emulador iOS de modo direto.
- `npm run reset-project`: Remove código padrão do Expo Router e inicia com um `/app` em branco.

---

*Crie o seu ritmo, adapte a sua mente. Boas contribuições!*
