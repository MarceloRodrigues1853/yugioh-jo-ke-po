// Estado da aplicação
const estado = {
  pontuacao: {
    pontuacaoJogador: 0,
    pontuacaoComputador: 0,
    caixaPontuacao: document.getElementById("score_points"),
  },
  spritesCarta: {
    avatar: document.getElementById("card-image"),
    nome: document.getElementById("card-name"),
    tipo: document.getElementById("card-type"),
  },
  cartasCampo: {
    jogador: document.getElementById("player-field-card"),
    computador: document.getElementById("computer-field-card"),
  },
  ladosJogadores: {
    jogador1: "player-cards",
    caixaJogador1: document.querySelector("#player-cards"),
    computador: "computer-cards",
    caixaComputador: document.querySelector("#computer-cards"),
  },
  acoes: {
    botao: document.getElementById("next-duel"),
  },
};

// Lados dos jogadores
const ladosJogadores = {
  jogador1: "player-cards",
  computador: "computer-cards",
};

// Caminho para as imagens
const caminhoImagens = "./src/assets/icons/";

// Dados das cartas
const dadosCartas = [
  {
    id: 0,
    nome: "Dragão Branco de Olhos Azuis",
    tipo: "Papel",
    img: `${caminhoImagens}dragon.png`,
    venceDe: [1],
    perdeDe: [2],
  },
  {
    id: 1,
    nome: "Mago Negro",
    tipo: "Pedra",
    img: `${caminhoImagens}magician.png`,
    venceDe: [2],
    perdeDe: [0],
  },
  {
    id: 2,
    nome: "Exodia",
    tipo: "Tesoura",
    img: `${caminhoImagens}exodia.png`,
    venceDe: [0],
    perdeDe: [1],
  },
];

// Função para obter um ID aleatório
async function obterIdAleatorio() {
  const indiceAleatorio = Math.floor(Math.random() * dadosCartas.length);
  return dadosCartas[indiceAleatorio].id;
}

// Função para criar a imagem de uma carta
async function criarImagemCarta(idCarta, ladoCampo) {
  const imagemCarta = document.createElement("img");
  imagemCarta.setAttribute("height", "100px");
  imagemCarta.setAttribute("src", "./src/assets/icons/card-back.png");
  imagemCarta.setAttribute("data-id", idCarta);
  imagemCarta.classList.add("carta");

  // Adiciona evento de clique apenas para o lado do jogador
  if (ladoCampo === ladosJogadores.jogador1) {
    // Adiciona evento de mouseover para destacar a carta
    imagemCarta.addEventListener("mouseover", () => {
       desenharCartaSelecionada(idCarta);
    });

    imagemCarta.addEventListener("click", () => {
      definirCartasCampo(imagemCarta.getAttribute("data-id"));
    });
  }

  return imagemCarta;
}

// Função para definir cartas no campo
async function definirCartasCampo(idCarta) {
  // Remove todas as cartas antes
  await removerTodasImagensCartas();

  let idCartaComputador = await obterIdAleatorio();

  await ocultarImagensCampos(true);

  await ocultarDetalhesCartas();

  await desenharCartasNoCampo(idCarta, idCartaComputador);

  let resultadoDuelo = await verificarResultadoDuelo(
    idCarta,
    idCartaComputador
  );

  await atualizarPontuacao();

  await desenharBotao(resultadoDuelo);
}

// Função para desenhar cartas no campo
async function desenharCartasNoCampo(idCarta, idCartaComputador) {
  estado.cartasCampo.jogador.src = dadosCartas[idCarta].img;
  estado.cartasCampo.computador.src = dadosCartas[idCartaComputador].img;
}

// Função para ocultar imagens dos campos de cartas
async function ocultarImagensCampos(valor) {
  if (valor === true) {
    estado.cartasCampo.jogador.style.display = "block";
    estado.cartasCampo.computador.style.display = "block";
  }

  if (valor === false) {
    estado.cartasCampo.jogador.style.display = "none";
    estado.cartasCampo.computador.style.display = "none";
  }
}

// Função para ocultar detalhes das cartas
async function ocultarDetalhesCartas() {
  estado.spritesCarta.avatar.src = "";
  estado.spritesCarta.nome.innerText = "";
  estado.spritesCarta.tipo.innerText = "";
}

// Função para atualizar a pontuação
async function atualizarPontuacao() {
  estado.pontuacao.caixaPontuacao.innerText = `Venceu: ${estado.pontuacao.pontuacaoJogador} Perdeu: ${estado.pontuacao.pontuacaoComputador}`;
}

// Função para desenhar o botão
async function desenharBotao(texto) {
  estado.acoes.botao.innerText = texto.toUpperCase();
  estado.acoes.botao.style.display = "block";
}

// Função para verificar o resultado do duelo
async function verificarResultadoDuelo(idCartaJogador, idCartaComputador) {
  let resultadoDuelo = "Empate";
  let cartaJogador = dadosCartas[idCartaJogador];

  if (cartaJogador.vitoriaDe.includes(idCartaComputador)) {
    resultadoDuelo = "Venceu";
    estado.pontuacao.pontuacaoJogador++;
  }

  if (cartaJogador.derrotaDe.includes(idCartaComputador)) {
    resultadoDuelo = "Perdeu";
    estado.pontuacao.pontuacaoComputador++;
  }
  await reproduzirAudio(resultadoDuelo);

  return resultadoDuelo;
}

// Função para remover todas as imagens de cartas
async function removerTodasImagensCartas() {
  let { caixaComputador, caixaJogador1 } = estado.ladosJogadores;
  let elementosImagem = caixaComputador.querySelectorAll("img");
  elementosImagem.forEach((img) => img.remove());

  elementosImagem = caixaJogador1.querySelectorAll("img");
  elementosImagem.forEach((img) => img.remove());
}

/**
 * Atualiza as informações e a imagem da carta selecionada no estado da aplicação.
 * @param {number} index - O índice da carta no array de dados das cartas.
 */
async function desenharSelecaoCarta(index) {
  // Atualiza a imagem do avatar no estado com a imagem da carta selecionada
  estado.spritesCarta.avatar.src = dadosCartas[index].img;

  // Atualiza o texto do nome da carta no estado
  estado.spritesCarta.nome.innerText = dadosCartas[index].nome;

  // Atualiza o texto do tipo da carta no estado, adicionando o atributo
  estado.spritesCarta.tipo.innerText = "Atributo: " + dadosCartas[index].tipo;
}

// Função para desenhar cartas no campo
async function desenharCartas(quantidadeCartas, ladoCampo) {
  for (let i = 0; i < quantidadeCartas; i++) {
    const idCartaAleatorio = await obterIdAleatorio();
    const imagemCarta = await criarImagemCarta(idCartaAleatorio, ladoCampo);

    document.getElementById(ladoCampo).appendChild(imagemCarta);
  }
}

// Função para redefinir o duelo
async function resetarDuelo() {
  // Reinicia os elementos visuais para um novo duelo
  estado.spritesCarta.avatar.src = "";
  estado.acoes.botao.style.display = "none";

  estado.cartasCampo.jogador.style.display = "none";
  estado.cartasCampo.computador.style.display = "none";

  // Inicializa um novo duelo
  inicializar();
}

// Função para reproduzir áudio com tratamento de erro
async function reproduzirAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch (erro) {
    console.error("Erro ao reproduzir áudio:", erro.message);
  }
}

// Inicialização do jogo
function inicializar() {
  // Configuração inicial para um novo duelo
  ocultarImagensCampos(false);

  desenharCartas(5, ladosJogadores.jogador1);
  desenharCartas(5, ladosJogadores.computador);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

// Chama a função de inicialização
inicializar();
