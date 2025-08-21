// --- SUAS APOSTAS FIXAS ---
const MINHAS_APOSTAS = [
    "02 03 04 05 07 10 11 12 15 16 18 19 20 21 22 25", "02 03 04 05 07 08 11 12 14 15 17 18 20 21 23 25",
    "02 03 04 05 06 09 11 12 14 18 20 21 22 23 24 25", "02 03 04 05 06 07 11 12 14 17 18 20 21 22 23 25",
    "02 03 04 05 06 07 10 11 12 13 16 18 20 21 23 25", "01 04 06 08 11 12 13 14 15 17 18 19 20 21 22 25",
    "01 02 03 04 05 06 07 11 12 13 18 20 21 22 24 25", "02 03 04 05 06 10 11 12 15 16 18 19 20 21 25",
    "01 02 03 04 05 08 09 10 11 12 13 18 20 21 25", "02 03 07 09 11 12 13 14 15 16 19 20 21 23 25",
    "01 02 03 04 05 10 11 12 13 14 18 20 21 22 25", "02 03 04 05 08 09 11 12 14 18 19 20 21 23 25",
    "01 05 08 10 11 12 13 14 15 16 18 19 21 22 25", "02 03 04 05 11 12 16 17 18 19 20 21 23 24 25",
    "02 03 04 05 09 10 11 12 13 14 17 18 20 21 25", "02 04 09 10 11 12 13 14 15 17 18 20 22 24 25",
    "02 03 04 05 06 10 11 12 13 16 17 18 20 21 25", "02 03 04 05 06 09 11 12 16 18 19 20 21 22 25",
    "01 03 07 10 11 12 13 14 15 16 18 20 21 22 25", "02 03 04 05 09 11 12 16 17 18 19 20 21 22 25",
    "02 03 04 05 10 11 12 13 14 15 18 19 20 21 25", "03 04 06 08 11 12 13 14 15 17 19 20 22 23 25",
    "01 02 03 04 05 11 12 13 14 16 17 18 20 21 25", "01 02 03 04 05 07 11 12 14 16 18 20 21 23 25",
    "02 05 07 10 11 12 13 14 15 17 18 19 22 23 25", "02 03 04 05 09 11 12 13 15 17 18 20 21 23 25",
    "02 03 04 05 07 10 11 12 13 14 16 18 20 21 25", "01 02 07 09 11 12 13 14 15 16 18 19 21 22 25",
    "01 02 03 04 05 07 09 11 12 13 14 18 20 21 25", "02 03 04 05 06 09 11 12 17 18 19 20 21 24 25",
    "01 02 08 10 11 12 13 14 15 17 18 19 22 23 25", "02 03 04 05 08 09 11 12 13 18 20 21 22 23 25",
    "01 02 03 04 05 11 12 13 15 18 19 20 21 24 25", "02 04 07 08 11 12 13 14 15 17 18 19 21 24 25",
    "02 03 04 05 07 08 11 12 17 18 19 20 21 24 25", "02 03 04 05 06 08 11 12 13 15 17 18 20 21 25",
    "02 05 06 09 11 12 13 14 15 16 18 19 22 24 25"
];

const PREMIOS_FIXOS = { 11: 6.00, 12: 12.00, 13: 30.00 };
const MULTIPLICADORES = {
    16: { 11: { 11: 5 }, 12: { 11: 12, 12: 4 }, 13: { 12: 13, 13: 3 }, 14: { 13: 14, 14: 2 }, 15: { 14: 15, 15: 1 } }
};

// --- Funções de Animação ---
function criarConfete(container) {
    const confete = document.createElement('div');
    confete.className = 'confetti';
    confete.style.left = `${Math.random() * 100}vw`;
    confete.style.animationDelay = `${Math.random() * 2}s`;
    const colors = ['#FFD700', '#FF4500', '#FFFFFF', '#00BFFF'];
    confete.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(confete);
    setTimeout(() => confete.remove(), 3000);
}
function gerarConfetes(quantidade, container) { for (let i = 0; i < quantidade; i++) { criarConfete(container); } }
function mostrarMensagemVitoria(titulo, subtitulo) {
    const container = document.getElementById('confetti-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'win-message';
    messageDiv.innerHTML = `<strong style="font-size: 1.5em; display: block;">${titulo}</strong><p style="font-size: 0.8em; margin: 10px 0 0 0;">${subtitulo}</p>`;
    container.appendChild(messageDiv);
    setTimeout(() => { if (messageDiv) messageDiv.remove(); }, 8000);
}

// --- Lógica Principal que Roda ao Carregar a Página ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cria os campos para digitar o resultado
    const containerResultado = document.getElementById('resultadoContainer');
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'tel'; input.className = 'dezena-sorteada-input'; input.maxLength = 2;
        input.placeholder = '00'; input.setAttribute('aria-label', `Dezena ${i + 1}`);
        containerResultado.appendChild(input);
        input.addEventListener('input', () => {
            if (input.value.length === input.maxLength && i < 14) containerResultado.children[i + 1].focus();
        });
    }

    // 2. Carrega as suas apostas fixas na tabela
    const tabelaBody = document.getElementById('tabelaResultados').querySelector('tbody');
    MINHAS_APOSTAS.forEach((apostaStr, index) => {
        const newRow = tabelaBody.insertRow();
        const dezenas = apostaStr.split(' ');
        const dezenasHtml = dezenas.map(dezena => `<span class="dezena-numero">${dezena}</span>`).join('');
        
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td styl
