const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => [...document.querySelectorAll(seletor)];

const fundoLogin = $("#fundo-login");
const fundoReceita = $("#fundo-receita");
const fundoCriarReceita = $("#fundo-criar-receita");
const fundoPerfil = $("#fundo-perfil");
const menuPerfil = $("#menu-perfil");
const mural = $("#mural-receitas");

let usuarioLogado = false;

function atualizarBloqueio() {
    const modalAberto = $$(".fundo-modal").some(
        modal => modal.classList.contains("aberto")
    );

    const perfilAberto = menuPerfil.classList.contains("aberto");

    document.body.classList.toggle(
        "bloqueado",
        modalAberto || perfilAberto
    );
}

function abrirModal(modal) {
    modal.classList.add("aberto");
    atualizarBloqueio();

    const primeiroCampo = modal.querySelector("input");

    if (primeiroCampo) {
        setTimeout(() => primeiroCampo.focus(), 50);
    }
}

function fecharModal(modal) {
    modal.classList.remove("aberto");
    atualizarBloqueio();
}

function abrirPerfil() {
    if (!usuarioLogado) {
        abrirModal(fundoLogin);
        return;
    }

    fundoPerfil.classList.add("aberto");
    menuPerfil.classList.add("aberto");
    menuPerfil.setAttribute("aria-hidden", "false");

    atualizarBloqueio();
}

function fecharPerfil() {
    fundoPerfil.classList.remove("aberto");
    menuPerfil.classList.remove("aberto");
    menuPerfil.setAttribute("aria-hidden", "true");

    atualizarBloqueio();
}

function atualizarCabecalho() {
    $("#btn-login").textContent = usuarioLogado
        ? "Deslogar"
        : "Login";

    $("#btn-perfil").hidden = !usuarioLogado;
}

function deslogar() {
    const confirmar = confirm("Deseja realmente sair da sua conta?");

    if (!confirmar) return;

    usuarioLogado = false;

    $("#nome_usuario").textContent = "SAEPChef";
    $("#nome-menu-perfil").textContent = "SAEPChef";
    $(".usuario-tag").textContent = "@chef1";

    atualizarCabecalho();
    fecharPerfil();
    fecharModal(fundoLogin);
}

$("#btn-login").addEventListener("click", () => {
    if (usuarioLogado) {
        deslogar();
        return;
    }

    $("#mensagem-login").textContent = "";
    abrirModal(fundoLogin);
});

$("#fechar-login").addEventListener("click", () => {
    fecharModal(fundoLogin);
});

fundoLogin.addEventListener("click", event => {
    if (event.target === fundoLogin) {
        fecharModal(fundoLogin);
    }
});

$("#form-login").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#email").value.trim();
    const senha = $("#senha").value;
    const mensagem = $("#mensagem-login");

    if (!$("#form-login").checkValidity()) {
        $("#form-login").reportValidity();
        return;
    }

    if (!email || !senha) {
        mensagem.textContent = "Preencha o e-mail e a senha.";
        return;
    }

    const nome = email
        .split("@")[0]
        .replace(/[._-]+/g, " ");

    const nomeFormatado =
        nome.charAt(0).toUpperCase() + nome.slice(1);

    usuarioLogado = true;

    $("#nome_usuario").textContent = nomeFormatado;
    $("#nome-menu-perfil").textContent = nomeFormatado;
    $(".usuario-tag").textContent = "@" + email.split("@")[0];

    atualizarCabecalho();
    fecharModal(fundoLogin);
    $("#form-login").reset();
    mensagem.textContent = "";

    abrirPerfil();
});

$("#abrir-perfil").addEventListener("click", abrirPerfil);
$("#btn-perfil").addEventListener("click", abrirPerfil);
$("#fechar-perfil").addEventListener("click", fecharPerfil);

fundoPerfil.addEventListener("click", fecharPerfil);

$("#btn-notificacao").addEventListener("click", () => {
    alert("Você está em dia! Não há novas notificações.");
});

function atualizarFavoritos() {
    $("#quantidade-favoritas").textContent =
        $$(".btn-favorito.ativo").length;
}

function abrirDetalhes(receita) {
    const imagem = receita.querySelector(".img-receita");

    const nome = receita.dataset.nome ||
        receita.querySelector("h2").textContent;

    const avaliacao = receita
        .querySelector(".avaliacao-receita")
        .textContent.trim();

    const descricao = receita.dataset.descricao ||
        "Uma receita deliciosa para compartilhar.";

    const tempo = receita.dataset.tempo ||
        receita.querySelector(".tempo-receita").textContent.trim();

    $("#img-modal-receita").src = imagem.src;
    $("#img-modal-receita").alt = imagem.alt;
    $("#titulo-modal-receita").textContent = nome;
    $("#avaliacao-modal-receita").textContent = avaliacao;
    $("#descricao-modal-receita").textContent = descricao;
    $("#tempo-modal-receita").textContent =
        "Tempo de preparo: " + tempo;

    abrirModal(fundoReceita);
}

mural.addEventListener("click", event => {
    const favorito = event.target.closest(".btn-favorito");

    if (favorito) {
        const ativo = favorito.classList.toggle("ativo");

        favorito.setAttribute("aria-pressed", String(ativo));

        favorito.setAttribute(
            "aria-label",
            ativo ? "Remover dos favoritos" : "Adicionar aos favoritos"
        );

        favorito.textContent = ativo ? "♥" : "♡";

        atualizarFavoritos();
        return;
    }

    const receita = event.target.closest(".receita");

    if (receita) {
        abrirDetalhes(receita);
    }
});

$("#fechar-receita").addEventListener("click", () => {
    fecharModal(fundoReceita);
});

fundoReceita.addEventListener("click", event => {
    if (event.target === fundoReceita) {
        fecharModal(fundoReceita);
    }
});

function pesquisarReceitas() {
    const termo = $("#barra-pesquisa")
        .value
        .trim()
        .toLocaleLowerCase("pt-BR");

    let encontradas = 0;

    $$(".receita").forEach(receita => {
        const nome = receita.dataset.nome || "";
        const titulo = receita.querySelector("h2").textContent;

        const corresponde = (nome + " " + titulo)
            .toLocaleLowerCase("pt-BR")
            .includes(termo);

        receita.hidden = !corresponde;

        if (corresponde) {
            encontradas++;
        }
    });

    $("#sem-resultados").hidden = encontradas > 0;
}

$("#barra-pesquisa").addEventListener("input", pesquisarReceitas);
$("#btn-pesquisar").addEventListener("click", pesquisarReceitas);

$("#barra-pesquisa").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        pesquisarReceitas();
    }
});

function mostrarTodasReceitas() {
    $("#barra-pesquisa").value = "";
    pesquisarReceitas();
}

function mostrarFavoritas() {
    $("#barra-pesquisa").value = "";

    $$(".receita").forEach(receita => {
        receita.hidden = !receita
            .querySelector(".btn-favorito")
            .classList.contains("ativo");
    });

    $("#sem-resultados").hidden =
        $$(".receita").some(receita => !receita.hidden);
}

$(".opcoes-menu").addEventListener("click", event => {
    const opcao = event.target.closest("[data-acao]");

    if (!opcao) return;

    const acao = opcao.dataset.acao;

    fecharPerfil();

    if (acao === "perfil") {
        abrirPerfil();
    } else if (acao === "todas") {
        mostrarTodasReceitas();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else if (acao === "favoritas") {
        mostrarFavoritas();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else if (acao === "login") {
        if (usuarioLogado) {
            deslogar();
        } else {
            $("#mensagem-login").textContent = "";
            abrirModal(fundoLogin);
        }
    }
});

$("#btn-criar-receita").addEventListener("click", () => {
    if (!usuarioLogado) {
        fecharPerfil();
        abrirModal(fundoLogin);
        return;
    }

    fecharPerfil();
    abrirModal(fundoCriarReceita);
});

$("#fechar-criar-receita").addEventListener("click", () => {
    fecharModal(fundoCriarReceita);
});

fundoCriarReceita.addEventListener("click", event => {
    if (event.target === fundoCriarReceita) {
        fecharModal(fundoCriarReceita);
    }
});

$("#form-criar-receita").addEventListener("submit", event => {
    event.preventDefault();

    if (!usuarioLogado) {
        fecharModal(fundoCriarReceita);
        abrirModal(fundoLogin);
        return;
    }

    const nome = $("#nova-receita").value.trim();
    const descricao = $("#descricao-nova-receita").value.trim();
    const tempo = $("#tempo-nova-receita").value.trim();

    if (!nome || !descricao || !tempo) return;

    const receita = document.createElement("article");

    receita.className = "receita";
    receita.dataset.id = Date.now();
    receita.dataset.nome = nome;
    receita.dataset.tempo = tempo;
    receita.dataset.descricao = descricao;

    const imagemContainer = document.createElement("div");
    imagemContainer.className = "imagem-container";

    const imagem = document.createElement("img");

    imagem.className = "img-receita";
    imagem.src = "../anexos_prova/receitas/receita1.jpg";
    imagem.alt = nome;

    const favorito = document.createElement("button");

    favorito.className = "btn-favorito";
    favorito.type = "button";
    favorito.setAttribute("aria-label", "Adicionar aos favoritos");
    favorito.setAttribute("aria-pressed", "false");
    favorito.textContent = "♡";

    imagemContainer.append(imagem, favorito);

    const info = document.createElement("div");
    info.className = "info-receita";

    const titulo = document.createElement("h2");
    titulo.textContent = nome;

    const detalhes = document.createElement("div");
    detalhes.className = "detalhes-receita";

    const avaliacao = document.createElement("span");
    avaliacao.className = "avaliacao-receita";

    const estrela = document.createElement("img");
    estrela.src = "../anexos_prova/icones/estrela.svg";
    estrela.alt = "";

    avaliacao.append(
        estrela,
        document.createTextNode("0")
    );

    const tempoElemento = document.createElement("span");
    tempoElemento.className = "tempo-receita";

    const relogio = document.createElement("span");
    relogio.className = "relogio";
    relogio.textContent = "◷";

    tempoElemento.append(
        relogio,
        document.createTextNode(tempo)
    );

    detalhes.append(avaliacao, tempoElemento);
    info.append(titulo, detalhes);
    receita.append(imagemContainer, info);
    mural.appendChild(receita);

    $("#form-criar-receita").reset();

    $("#quantidade-receitas").textContent =
        $$(".receita").length;

    fecharModal(fundoCriarReceita);
    mostrarTodasReceitas();

    receita.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharPerfil();

        [
            fundoLogin,
            fundoReceita,
            fundoCriarReceita
        ].forEach(fecharModal);
    }
});

atualizarCabecalho();

$("#quantidade-receitas").textContent =
    $$(".receita").length;

atualizarFavoritos();


$("#footer-inicio").addEventListener("click", event => {
    event.preventDefault();

    mostrarTodasReceitas();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

$("#footer-receitas").addEventListener("click", event => {
    event.preventDefault();

    mostrarTodasReceitas();

    mural.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

$("#footer-favoritas").addEventListener("click", event => {
    event.preventDefault();

    if (!usuarioLogado) {
        abrirModal(fundoLogin);
        return;
    }

    mostrarFavoritas();

    mural.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
