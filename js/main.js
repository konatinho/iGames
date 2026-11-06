/* ==========================================================================
   iGames — Home: busca em tempo real + filtro por categoria
   ========================================================================== */
(function () {
  'use strict';
  const { normalizar, esc, carregarJogos, renderizarCards, renderizarSkeleton, renderizarErro } = window.iGames;

  const grade = document.getElementById('grade');
  const chips = document.getElementById('chips');
  const campo = document.getElementById('busca');
  const contagem = document.getElementById('contagem');

  const estado = { jogos: [], categoria: 'Todos', termo: '' };

  /** Aplica busca + categoria e redesenha a grade. */
  function atualizar() {
    const termo = normalizar(estado.termo);
    const lista = estado.jogos.filter((j) =>
      (estado.categoria === 'Todos' || j.categoria === estado.categoria) &&
      (!termo || normalizar(j.nome).includes(termo)));

    contagem.textContent = lista.length === 1 ? '1 jogo' : `${lista.length} jogos`;
    if (!lista.length) {
      grade.innerHTML = '<div class="estado"><h2>Nenhum jogo encontrado</h2><p>Tente outro nome ou escolha outra categoria.</p></div>';
      return;
    }
    renderizarCards(grade, lista);
  }

  /** Cria os chips a partir das categorias presentes no jogos.json. */
  function montarChips() {
    const cats = ['Todos', ...new Set(estado.jogos.map((j) => j.categoria))];
    chips.innerHTML = cats.map((c) =>
      `<button class="chip" type="button" aria-pressed="${c === estado.categoria}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  }

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    estado.categoria = b.dataset.cat;
    chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c === b));
    atualizar();
  });

  campo.addEventListener('input', () => { estado.termo = campo.value; atualizar(); });
  campo.form.addEventListener('submit', (e) => e.preventDefault()); // busca é em tempo real na home

  async function iniciar() {
    renderizarSkeleton(grade, 8);
    try {
      estado.jogos = await carregarJogos();
      estado.termo = new URLSearchParams(location.search).get('q') || ''; // vindo da página do jogo
      campo.value = estado.termo;
      grade.removeAttribute('aria-busy');
      montarChips();
      atualizar();
    } catch (err) {
      console.error('[iGames] Falha ao carregar jogos.json:', err);
      renderizarErro(grade, iniciar);
    }
  }
  iniciar();
})();
