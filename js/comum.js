/* ==========================================================================
   iGames — funções compartilhadas (home e página do jogo)
   Expõe o objeto global window.iGames.
   ========================================================================== */
(function () {
  'use strict';

  /** Remove acentos e caixa: "Estratégia" -> "estrategia" (busca tolerante). */
  const normalizar = (s) =>
    String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  /** Escapa texto antes de inserir em HTML (evita quebrar o layout / XSS). */
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let cache = null;

  /** Lê o jogos.json (uma única vez por página). Lança erro se falhar. */
  async function carregarJogos() {
    if (cache) return cache;
    const resp = await fetch('jogos.json', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const dados = await resp.json();
    if (!Array.isArray(dados)) throw new Error('jogos.json deve ser um array');
    cache = dados;
    return cache;
  }

  /** Miniatura placeholder em SVG inline, cor derivada do id do jogo (tons quentes). */
  function thumbPlaceholder(j) {
    let h = 0;
    for (const c of j.id) h = (h * 31 + c.charCodeAt(0)) % 360;
    const matiz = 8 + (h % 50);
    const gid = 'g-' + esc(j.id);
    return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Miniatura de ${esc(j.nome)}">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${matiz} 85% 48%)"/><stop offset="1" stop-color="hsl(${matiz + 20} 60% 12%)"/>
      </linearGradient></defs>
      <rect width="320" height="200" fill="url(#${gid})"/>
      <circle cx="270" cy="30" r="70" fill="#fff" opacity=".07"/><circle cx="40" cy="190" r="60" fill="#000" opacity=".18"/>
      <text x="160" y="125" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="96" fill="#fff" opacity=".9">${esc(j.nome.charAt(0))}</text>
    </svg>`;
  }

  /** HTML de um card. Se houver j.thumb usa a imagem; se faltar/falhar, usa o placeholder. */
  function cardHTML(j, i = 0) {
    const thumb = j.thumb
      ? `<img src="${esc(j.thumb)}" alt="Miniatura de ${esc(j.nome)}" width="320" height="200" loading="lazy" data-id="${esc(j.id)}">`
      : thumbPlaceholder(j);
    return `<a class="card revelar" style="--i:${i}" href="jogo.html?id=${encodeURIComponent(j.id)}">
      <div class="card__thumb">${thumb}</div>
      <div class="card__info"><h3 class="card__nome">${esc(j.nome)}</h3><span class="tag">${esc(j.categoria)}</span></div>
    </a>`;
  }

  /** Renderiza cards na grade e ativa fallback de imagem + fade ao rolar. */
  function renderizarCards(grade, jogos) {
    grade.innerHTML = jogos.map(cardHTML).join('');
    grade.querySelectorAll('img[data-id]').forEach((img) => {
      img.addEventListener('error', () => {
        const j = jogos.find((x) => x.id === img.dataset.id);
        if (j) img.replaceWith(new DOMParser().parseFromString(thumbPlaceholder(j), 'text/html').body.firstChild);
      }, { once: true });
    });
    revelarAoRolar(grade);
  }

  /** Cards "fantasma" com shimmer enquanto o JSON carrega. */
  function renderizarSkeleton(grade, n = 6) {
    grade.setAttribute('aria-busy', 'true');
    grade.innerHTML = Array.from({ length: n }, () =>
      `<div class="card skeleton" aria-hidden="true"><div class="card__thumb"></div>
       <div class="card__info"><div class="linha"></div><div class="linha curta"></div></div></div>`).join('');
  }

  /** Mensagem amigável de erro com botão de tentar de novo. */
  function renderizarErro(grade, aoTentar) {
    grade.removeAttribute('aria-busy');
    grade.innerHTML = `<div class="estado" role="alert"><h2>Não foi possível carregar os jogos</h2>
      <p>Verifique sua conexão e se o site está rodando em um servidor local.</p>
      <button class="btn" type="button">Tentar de novo</button></div>`;
    grade.querySelector('button').addEventListener('click', aoTentar);
  }

  /** Fade-in suave dos elementos .revelar quando entram na tela. */
  function revelarAoRolar(raiz = document) {
    const itens = raiz.querySelectorAll('.revelar:not(.visivel)');
    if (!('IntersectionObserver' in window)) return itens.forEach((el) => el.classList.add('visivel'));
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    itens.forEach((el) => obs.observe(el));
  }

  window.iGames = { normalizar, esc, carregarJogos, cardHTML, renderizarCards, renderizarSkeleton, renderizarErro, revelarAoRolar };
})();
