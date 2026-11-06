/* ==========================================================================
   iGames — Página do jogo: dados por ?id=, iframe, tela cheia e "Mais jogos"
   ========================================================================== */
(function () {
  'use strict';
  const { carregarJogos, renderizarCards, renderizarSkeleton, renderizarErro } = window.iGames;
  const $ = (id) => document.getElementById(id);

  const moldura = $('moldura'), frame = $('frame'), btnTela = $('btnTela'), btnSair = $('btnSair');
  const grade = $('grade');

  /* ---------- Tela cheia: nativa (Fullscreen API) ou pseudo (CSS) ---------- */
  const pedirNativa = frame.requestFullscreen || frame.webkitRequestFullscreen;
  const emNativa = () => document.fullscreenElement || document.webkitFullscreenElement;
  const emPseudo = () => moldura.classList.contains('pseudo-fs');

  function entrarPseudo() {
    moldura.classList.add('pseudo-fs');
    document.body.classList.add('sem-scroll');
    btnSair.focus();
  }
  function sairPseudo() {
    moldura.classList.remove('pseudo-fs');
    document.body.classList.remove('sem-scroll');
    btnTela.focus();
  }
  function alternarTela() {
    if (emPseudo()) return sairPseudo();
    if (emNativa()) return (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (!pedirNativa) return entrarPseudo();             // iOS Safari: plano B
    try {
      const p = pedirNativa.call(frame);
      if (p && p.catch) p.catch(entrarPseudo);           // bloqueado -> plano B
    } catch (e) { entrarPseudo(); }
  }
  btnTela.addEventListener('click', alternarTela);
  btnSair.addEventListener('click', sairPseudo);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && emPseudo()) sairPseudo(); });

  /* ---------- Dados do jogo ---------- */
  function preencher(j) {
    document.title = `${j.nome} — jogue grátis no iGames`;
    document.querySelector('meta[name="description"]').content = j.descricao;
    document.querySelector('meta[property="og:title"]').content = `${j.nome} — iGames`;
    document.querySelector('meta[property="og:description"]').content = j.descricao;
    $('nome').textContent = j.nome;
    $('descricao').textContent = j.descricao;
    $('categoria').textContent = j.categoria;
    $('autor').textContent = j.autor;
    frame.title = j.nome;
    frame.src = j.caminho;
  }

  async function iniciar() {
    const id = new URLSearchParams(location.search).get('id');
    renderizarSkeleton(grade, 4);
    try {
      const jogos = await carregarJogos();
      const jogo = jogos.find((j) => j.id === id);
      if (!jogo) return location.replace('404.html');
      preencher(jogo);
      // Mais jogos: mesma categoria primeiro, depois o resto (máx. 4)
      const outros = jogos.filter((j) => j.id !== id)
        .sort((a, b) => (b.categoria === jogo.categoria) - (a.categoria === jogo.categoria)).slice(0, 4);
      grade.removeAttribute('aria-busy');
      renderizarCards(grade, outros);
    } catch (err) {
      console.error('[iGames] Falha ao carregar jogos.json:', err);
      renderizarErro(grade, iniciar);
    }
  }
  iniciar();
})();
