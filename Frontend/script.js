const modal = document.getElementById('modal-container');
const btnAbrir = document.getElementById('btn-login');
const btnFechar = document.getElementById('btn-fechar');
const btnPerfil = document.querySelector('.btn-perfil');



btnAbrir.addEventListener('click', () => {
    modal.classList.add('ativo');
});


btnFechar.addEventListener('click', () => {
    modal.classList.remove('ativo');
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('ativo');
    }
});

