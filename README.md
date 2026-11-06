<div align="center">

# 🎮 iGames

**Jogos grátis direto no navegador. Sem downloads e sem cadastro.**

HTML, CSS e JavaScript puro · Mobile-first · Sem frameworks e sem build

</div>

---

## 📖 Sobre o projeto

O **iGames** é um portal de jogos de navegador. A home lista todos os jogos com busca em tempo real e filtro por categoria. Cada jogo tem uma página própria, com o jogo rodando dentro de um `iframe`, botão de tela cheia, descrição, autor e uma lista de "Mais jogos".

O site é 100% estático: não tem back-end, banco de dados nem etapa de build. Para adicionar um jogo basta **colocar uma pasta em `jogos/`** e **registrar uma entrada no `jogos.json`**.

### ✨ Recursos

- Visual clean, escuro, com laranja de destaque, blur (vidro fosco) e animações suaves
- Busca em tempo real (ignora acentos e maiúsculas) e filtro por categoria
- Página individual por jogo, com tela cheia (nativa, ou um plano B para iOS)
- Miniatura automática (placeholder em SVG) caso a imagem do jogo falhe ou não exista
- Layout responsivo, pensado primeiro para celular
- Respeita `prefers-reduced-motion` e tem foco visível para navegação por teclado

---

## 🗂️ Estrutura do projeto

```
iGames/
├── index.html            # Home: lista de jogos, busca e categorias
├── jogo.html             # Página do jogo (recebe ?id=nome-do-jogo)
├── 404.html              # Página de "jogo não encontrado"
├── jogos.json            # Catálogo: a lista de todos os jogos
├── css/
│   └── style.css         # Estilos globais (tokens de cor em :root)
├── js/
│   ├── comum.js          # Funções compartilhadas (window.iGames)
│   ├── main.js           # Lógica da home (busca + chips)
│   └── jogo.js           # Lógica da página do jogo (iframe + tela cheia)
├── assets/
│   └── thumbs/           # Miniaturas dos jogos (ex.: tetris.jpg)
└── jogos/
    └── tetris/           # Um jogo por subpasta
        └── index.html    # Ponto de entrada do jogo
```

---

## 🚀 Rodando localmente

O site carrega o `jogos.json` com `fetch`, e isso **não funciona abrindo o arquivo com duplo clique** (`file://`). É preciso um servidor local simples.

```bash
# 1. Clone o repositório
git clone https://github.com/weizinxp/iGames.git
cd iGames

# 2. Suba um servidor local (escolha um)
python3 -m http.server 8000
# ou
npx serve .
```

Abra `http://localhost:8000` no navegador.

> **Dica:** se aparecer "Não foi possível carregar os jogos", quase sempre é porque o site foi aberto sem servidor local.

---

## ➕ Como adicionar um jogo

Esta é a parte principal. O processo tem duas fases: **(A)** preparar o jogo e **(B)** enviar para o repositório.

### Parte A: Preparando o jogo

#### 1. Escolha o `id` do jogo

O `id` é o identificador único. Ele é usado no nome da pasta e na URL (`jogo.html?id=...`).

- Apenas letras minúsculas, números e hífen: `tetris`, `corrida-de-carros`, `jogo-da-memoria`
- Sem espaços, acentos ou maiúsculas
- Não pode repetir o `id` de outro jogo

#### 2. Crie a pasta do jogo

```
jogos/<id>/
└── index.html     ← obrigatório: é o que abre dentro do iframe
```

Todos os arquivos do jogo (JS, CSS, imagens, sons) ficam **dentro dessa pasta**.

#### 3. Siga as regras do jogo

| Regra | Por quê |
|---|---|
| O ponto de entrada deve ser `jogos/<id>/index.html` | É o arquivo que o `iframe` carrega |
| Use **caminhos relativos** (`./script.js`, `img/bola.png`), nunca `/script.js` | O jogo precisa funcionar em qualquer subpasta |
| O jogo deve ser **responsivo** e ocupar 100% da largura e altura do `iframe` | Ele roda em uma moldura 4:3 no celular e 16:9 no computador |
| Deve funcionar com **toque** e com **teclado/mouse** | O público é majoritariamente mobile |
| Evite depender de internet (CDNs, APIs externas) | Mais rápido e não quebra se o serviço cair |
| Sem anúncios, rastreadores, pop-ups ou redirecionamentos | Experiência limpa |
| Use apenas imagens, sons e fontes que você **tem direito de usar** | Evita problemas de direitos autorais |
| Jogos leves ficam no repositório; **jogos pesados** seguem a seção [Jogos pesados](#-jogos-pesados-são-bem-vindos) | Carregamento rápido e repositório saudável |

#### 4. Prepare a miniatura

- Salve em `assets/thumbs/<id>.jpg`
- Proporção **16:10** (recomendado **640×400 px**), leve (abaixo de ~100 KB)
- Se a miniatura não existir ou falhar, o site mostra um placeholder automático, mas é melhor ter a imagem

#### 5. Registre o jogo no `jogos.json`

Adicione um novo objeto ao array:

```json
{
  "id": "meu-jogo",
  "nome": "Meu Jogo",
  "descricao": "Uma frase curta e atraente sobre o jogo.",
  "autor": "Seu Nome ou Usuário do GitHub",
  "categoria": "Puzzle",
  "thumb": "assets/thumbs/meu-jogo.jpg",
  "caminho": "jogos/meu-jogo/index.html"
}
```

| Campo | Descrição |
|---|---|
| `id` | Identificador único, igual ao nome da pasta |
| `nome` | Nome exibido no site |
| `descricao` | Texto curto da página do jogo (e meta description) |
| `autor` | Quem criou/adicionou o jogo |
| `categoria` | Ex.: `Puzzle`, `Ação`, `Corrida`, `Arcade`. **Reutilize categorias existentes** quando possível; uma nova categoria cria um novo filtro automaticamente |
| `thumb` | Caminho da miniatura (pode omitir o campo para usar o placeholder) |
| `caminho` | Sempre `jogos/<id>/index.html` |

> ⚠️ **Atenção à vírgula:** ao adicionar um objeto no meio ou no fim do array, lembre-se da vírgula entre os objetos e **nunca** coloque vírgula depois do último. Um JSON inválido quebra o site inteiro. Valide em [jsonlint.com](https://jsonlint.com) ou com `python3 -m json.tool jogos.json`.

#### 6. Teste localmente

Suba o servidor local (veja acima) e confira:

- [ ] O card do jogo aparece na home, com miniatura e categoria corretas
- [ ] A busca encontra o jogo pelo nome
- [ ] A página `jogo.html?id=<id>` abre e o jogo carrega
- [ ] O botão de **tela cheia** funciona
- [ ] O jogo funciona no **celular** (use o modo responsivo do navegador ou abra pelo IP da sua rede)
- [ ] Não há erros vermelhos no console (F12)

---

### Parte B: Enviando para o repositório

Todo jogo novo entra por **Fork + Pull Request**: você envia uma proposta e o dono do projeto **revisa e aceita** (ou pede ajustes). Assim o repositório original fica protegido e todo jogo passa por uma conferência antes de ir ao ar.

---

#### Passo a passo: Fork + Pull Request

**1. Faça o fork**

No GitHub, abra `github.com/weizinxp/iGames` e clique em **Fork**. Isso cria uma cópia do repositório na sua conta.

**2. Clone o SEU fork**

```bash
git clone https://github.com/SEU-USUARIO/iGames.git
cd iGames
```

**3. Conecte ao repositório original (para se manter atualizado)**

```bash
git remote add upstream https://github.com/weizinxp/iGames.git
git remote -v   # deve mostrar origin (seu fork) e upstream (o original)
```

**4. Atualize antes de começar**

```bash
git checkout main
git pull upstream main
```

**5. Crie uma branch para o seu jogo**

```bash
git checkout -b adiciona-meu-jogo
```

**6. Adicione os arquivos** (pasta do jogo, miniatura e a entrada no `jogos.json`) e confira o que mudou:

```bash
git status
```

**7. Faça o commit**

```bash
git add jogos/meu-jogo assets/thumbs/meu-jogo.jpg jogos.json
git commit -m "feat: adiciona o jogo Meu Jogo"
```

**8. Envie (push) para o seu fork**

```bash
git push origin adiciona-meu-jogo
```

**9. Abra o Pull Request**

No GitHub, aparecerá o botão **Compare & pull request**. Clique nele, escreva um título e descreva o jogo, e envie. Use este modelo:

```markdown
## Novo jogo: Meu Jogo

- **Categoria:** Puzzle
- **Descrição:** (uma frase)
- **Controles:** (toque / teclado / mouse)
- **Licença dos assets:** (próprios / livres, com link da fonte)

### Checklist
- [ ] Testei localmente (home, busca, página do jogo e tela cheia)
- [ ] Testei no celular
- [ ] O jogo roda só com arquivos da pasta `jogos/<id>/`
- [ ] O `jogos.json` está válido
- [ ] Tenho direito de usar todos os assets
```

**10. Aguarde a revisão**

O dono do projeto vai revisar. Pode acontecer:

- ✅ **Aprovado e mesclado (merge):** o jogo entra no site.
- 💬 **Ajustes solicitados:** faça as correções na mesma branch e dê `git push` de novo. O Pull Request se atualiza sozinho.
- ❌ **Recusado:** você receberá o motivo no próprio Pull Request.

**11. Depois do merge, limpe e sincronize**

```bash
git checkout main
git pull upstream main
git branch -d adiciona-meu-jogo
```

---

### ⚡ Contribuindo sem baixar o repositório inteiro

Conforme o catálogo crescer, o repositório pode ficar grande. **Você não precisa baixar tudo** para adicionar um jogo. Escolha uma das opções abaixo, da mais simples para a mais avançada.

#### Opção 1: Direto pelo site do GitHub (zero download)

Ideal para jogos pequenos. Não precisa instalar o Git nem clonar nada.

1. Faça o **fork** do repositório (botão **Fork**).
2. No seu fork, abra a pasta `jogos/` e clique em **Add file → Upload files**.
3. Envie a pasta do seu jogo (arraste a pasta inteira) e faça o commit em uma nova branch.
4. Repita para a miniatura em `assets/thumbs/`.
5. Abra o `jogos.json`, clique no lápis (✏️) para editar, adicione a sua entrada e faça o commit.
6. Clique em **Contribute → Open pull request**.

> O upload pelo navegador aceita até 100 arquivos por vez e arquivos de até 25 MB. Para algo maior, use a Opção 2.

#### Opção 2: Clone leve (baixa só o necessário)

O Git consegue baixar **apenas o histórico recente** e **apenas as pastas que você escolher**:

```bash
# Clona SEM os arquivos pesados e sem o histórico antigo
git clone --depth 1 --filter=blob:none --sparse https://github.com/SEU-USUARIO/iGames.git
cd iGames

# Baixa só o que você precisa (código do site + o seu jogo)
git sparse-checkout set --no-cone /*.html /*.json /css /js /assets/thumbs /jogos/meu-jogo
```

Explicando as flags:

| Flag | O que faz |
|---|---|
| `--depth 1` | Baixa só o último commit, sem o histórico inteiro |
| `--filter=blob:none` | Não baixa o conteúdo dos arquivos até você precisar dele |
| `--sparse` | Começa só com os arquivos da raiz, sem as pastas dos jogos |
| `sparse-checkout set` | Define exatamente quais pastas aparecem no seu computador |

Com isso você trabalha normalmente (`git add`, `git commit`, `git push`) sem os gigabytes dos outros jogos. Para testar o site localmente, o `jogos.json` já lista todos os jogos, mas só o seu terá os arquivos no disco. Os outros cards aparecerão normalmente e só a abertura deles vai falhar localmente, o que é esperado.

#### Opção 3: Na nuvem (GitHub Codespaces)

No seu fork, clique em **Code → Codespaces → Create codespace**. O ambiente roda no GitHub, então o download pesado não passa pelo seu computador.

---

### 🪶 Mantendo o repositório leve

Para o projeto não virar um monstro de gigabytes, siga estas regras ao enviar um jogo:

- **Comprima as imagens** (use WebP ou JPG otimizado) e converta os áudios para `.mp3` ou `.ogg` em qualidade razoável.
- **Não envie** arquivos de projeto (`.psd`, `.blend`, `.aseprite`), vídeos de gameplay, `node_modules`, builds duplicados ou arquivos temporários.
- **Jogos leves** (até **~20 MB**) ficam direto na pasta `jogos/<id>/`. O GitHub bloqueia arquivos acima de 100 MB e recomenda manter o repositório abaixo de ~1 GB.
- Passou disso? Veja a seção abaixo.

---

### 🔥 Jogos pesados são bem-vindos

**Sim, você pode enviar jogos grandes e ambiciosos**, como um shooter 3D estilo **ULTRAKILL**, um mundo aberto estilo **GTA 3** ou qualquer porte para o navegador (WebGL, WebAssembly, WebGPU). O limite de ~20 MB vale só para o que fica **dentro do repositório**. Jogos pesados usam o esquema abaixo:

1. **Abra uma *issue* antes** descrevendo o jogo (o que é, tamanho estimado, tecnologia). Assim o mantenedor combina a melhor forma de hospedar.
2. **Hospede os arquivos pesados fora do repositório**, em um destes lugares:
   - outro repositório com **GitHub Pages**;
   - um **CDN** ou armazenamento de arquivos estáticos (Cloudflare R2, Netlify, Vercel etc.);
   - **Git LFS**, se o mantenedor autorizar.
3. **No repositório do iGames, entra só a entrada do catálogo**: uma linha no `jogos.json`, em que o `caminho` aponta para a URL externa.

```json
{
  "id": "meu-jogo-pesado",
  "nome": "Meu Jogo Pesado",
  "descricao": "Shooter 3D frenético direto no navegador.",
  "autor": "seu-usuario",
  "categoria": "Ação",
  "thumb": "assets/thumbs/meu-jogo-pesado.jpg",
  "caminho": "https://seu-usuario.github.io/meu-jogo-pesado/"
}
```

4. **Carregue com inteligência**: mostre uma barra de progresso, carregue os recursos sob demanda (*streaming* de assets), use compressão (gzip/brotli) e texturas otimizadas. Jogo pesado sem tela de carregamento afasta o jogador.
5. **Pense no celular**: se o jogo exigir teclado e mouse ou uma máquina potente, avise na descrição.

#### ⚖️ Importante: direitos autorais em portes e homenagens

Portar ou recriar um jogo existente é permitido **desde que você tenha o direito de usar tudo o que está nele**. Na prática:

| Pode ✅ | Não pode ❌ |
|---|---|
| Criar um jogo **original** inspirado em outro (mecânica, estilo, clima), com **arte, sons e código seus** | Subir **modelos, texturas, músicas, falas ou mapas originais** de um jogo comercial (GTA, ULTRAKILL e outros) |
| Usar assets com **licença livre** (CC0, CC-BY, MIT etc.), citando a fonte e a licença | Hospedar o jogo comercial completo ou "ripado" no site, mesmo que seja "só um porte" |
| Fazer um **motor/engine** que só roda com arquivos que o próprio jogador fornece | Usar nomes, logos e personagens registrados como se o jogo fosse oficial |

Jogos que violarem isso serão **recusados no Pull Request** e podem ser removidos do site a qualquer momento, mesmo depois de aceitos, caso o titular dos direitos peça.

---

### 🧩 Resolvendo conflitos no `jogos.json`

Como todo mundo edita o mesmo arquivo, conflitos podem acontecer quando dois jogos são adicionados ao mesmo tempo. O Git marcará o trecho assim:

```
<<<<<<< HEAD
  { ...jogo que já estava na main... }
=======
  { ...seu jogo... }
>>>>>>> adiciona-meu-jogo
```

Para resolver: **mantenha os dois jogos**, apague as linhas `<<<<<<<`, `=======` e `>>>>>>>`, confira as **vírgulas** entre os objetos, valide o JSON e finalize:

```bash
git add jogos.json
git commit
git push
```

---

### 📝 Padrão de mensagens de commit

| Prefixo | Quando usar | Exemplo |
|---|---|---|
| `feat:` | Novo jogo ou recurso | `feat: adiciona o jogo Snake` |
| `fix:` | Correção de bug | `fix: corrige tela cheia no iOS` |
| `style:` | Mudança visual / CSS | `style: ajusta espaçamento dos cards` |
| `docs:` | Documentação | `docs: atualiza o README` |
| `chore:` | Manutenção, miniaturas, ajustes gerais | `chore: otimiza miniatura do Tetris` |

---

## 🎨 Identidade visual

Os tokens ficam em `css/style.css` (seção `:root`):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0a0a0a` | Fundo |
| `--surface` / `--surface-2` | `#141414` / `#1c1c1c` | Cards e superfícies |
| `--accent` | `#F5A623` | Laranja de destaque |
| `--accent-light` | `#FFC15A` | Hover |
| `--text` / `--text-muted` | `#ffffff` / `#b4b4b4` | Textos |

Fonte: **Sora** (Google Fonts).

---

## 🛠️ Tecnologias

- HTML5, CSS3 e JavaScript (ES6+), sem dependências
- Google Fonts (Sora)
- `iframe` para isolar cada jogo e a Fullscreen API para a tela cheia

---

## ❓ Problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| "Não foi possível carregar os jogos" | Site aberto sem servidor, ou `jogos.json` inválido | Use `python3 -m http.server` e valide o JSON |
| O jogo não aparece na home | Falta de vírgula, ou o objeto não está dentro do array | Valide o `jogos.json` |
| Cai na página 404 ao abrir o jogo | O `id` da URL não existe no `jogos.json` | Confira se o `id` está idêntico |
| Iframe em branco | `caminho` errado ou jogo usando caminhos absolutos (`/...`) | Use `jogos/<id>/index.html` e caminhos relativos |
| Miniatura não aparece | Nome ou extensão diferente do informado em `thumb` | Confira o nome do arquivo (`.jpg` vs `.png`) |

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Antes de abrir um Pull Request:

1. Leia a seção [Como adicionar um jogo](#-como-adicionar-um-jogo)
2. Teste o jogo no celular e no computador
3. Garanta que você tem direito de usar todos os arquivos enviados
4. Abra o Pull Request seguindo o modelo acima

---

## 👤 Autor

Criado por **weizinxp** — [github.com/weizinxp](https://github.com/weizinxp)

---

<div align="center">

Feito com 🧡 para quem só quer jogar um pouco.

</div>
