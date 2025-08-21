// --- SUAS 72 APOSTAS FIXAS E CORRIGIDAS ---
const MINHAS_APOSTAS = [
    "02 04 05 06 08 09 10 11 12 15 16 17 18 20 21 22", "02 03 04 06 09 11 12 13 14 17 18 20 21 22 23 25",
    "02 03 04 05 06 08 09 11 12 14 15 18 20 21 22 25", "01 02 03 04 07 08 10 11 12 13 16 17 18 19 20 21",
    "01 02 04 07 08 11 12 13 15 18 19 20 21 22 25", "02 03 04 05 06 08 09 11 16 18 19 20 21 22 25",
    "01 02 03 04 08 09 10 11 12 17 18 19 20 21 25", "01 03 04 05 06 07 10 11 12 14 15 18 19 24 25",
    "02 03 04 05 06 09 10 11 12 13 17 18 19 21 25", "03 04 05 06 07 08 11 12 14 16 18 19 20 22 25",
    "02 03 04 06 07 08 09 11 13 15 18 19 21 23 25", "02 03 04 05 07 09 10 11 13 14 18 20 21 23 25",
    "01 02 04 05 07 08 11 12 13 18 19 20 21 22 24", "02 03 04 05 06 10 11 12 13 14 18 20 21 23 25",
    "01 02 04 05 06 10 11 12 13 14 15 17 20 21 25", "03 04 05 06 08 10 11 14 15 16 20 21 22 24 25",
    "02 04 05 06 07 11 13 14 15 16 18 20 21 23 25", "01 02 05 10 11 12 13 14 15 17 20 21 22 24 25",
    "02 03 04 06 07 08 09 11 12 14 15 18 20 22 25", "01 04 07 08 09 10 11 12 15 16 18 19 20 21 25",
    "01 03 04 09 11 12 14 15 17 18 19 20 21 24 25", "01 02 03 05 06 09 11 13 14 16 18 21 22 24 25",
    "02 03 04 05 06 07 11 14 15 16 18 20 21 24 25", "02 03 04 05 07 08 09 11 15 16 17 20 21 23 24",
    "04 05 06 08 09 11 12 13 14 18 20 21 23 24 25", "02 03 05 08 09 11 12 14 15 17 18 19 20 21 25",
    "02 03 04 05 06 08 10 11 12 16 17 21 22 23 25", "01 02 04 07 08 10 11 12 13 14 15 18 20 21 25",
    "02 03 04 06 08 09 10 11 13 14 15 18 20 24 25", "03 04 05 06 08 11 12 15 16 18 19 20 21 24 25",
    "02 03 04 07 10 11 14 15 16 17 18 19 20 22 25", "01 03 04 05 06 08 11 12 14 18 19 20 21 23 25",
    "04 05 07 09 11 12 14 15 16 17 18 19 20 21 23", "01 02 03 04 08 09 11 12 13 14 18 19 21 23 25",
    "01 02 03 04 08 11 14 15 16 18 19 20 21 23 25", "01 02 03 05 06 09 10 11 13 14 15 16 20 21 25",
    "02 04 08 09 10 11 12 13 17 18 19 20 21 23 25", "02 03 04 06 08 09 10 11 13 17 18 19 20 21 23",
    "02 04 05 10 11 12 13 14 15 18 19 20 22 23 25", "03 04 05 08 09 11 12 14 15 17 18 20 21 23 25",
    "01 02 03 04 06 09 10 11 12 16 18 20 21 22 25", "01 02 03 05 06 10 11 12 15 17 18 20 21 23 25",
    "02 03 04 05 08 09 10 11 13 15 17 18 20 21 25", "02 04 05 07 09 10 11 12 14 15 16 18 19 20 25",
    "01 03 04 05 06 09 11 12 13 14 16 18 19 20 21", "02 06 09 10 11 12 13 14 16 18 19 20 21 22 25",
    "02 03 06 07 09 11 12 13 15 18 19 20 21 23 25", "02 03 04 05 06 10 11 12 14 15 18 20 21 22 23",
    "01 03 04 05 08 09 11 12 13 16 18 20 21 23 24", "01 03 04 05 06 09 11 13 17 18 19 20 22 24 25",
    "03 04 05 06 09 10 11 13 18 19 20 22 23 24 25", "02 04 06 07 08 09 11 12 14 15 16 17 20 23 25",
    "02 03 04 06 08 09 10 11 12 14 16 17 18 20 21", "01 02 04 05 07 08 10 11 12 13 18 19 20 21 25",
    "03 04 05 08 09 10 11 12 13 15 17 18 20 21 25", "01 02 03 04 06 08 11 13 15 18 20 21 22 24 25",
    "01 04 05 08 10 11 12 13 14 15 16 18 20 23 25", "02 04 05 10 11 12 13 14 15 17 18 20 21 22 25",
    "02 03 04 05 09 10 11 12 13 15 17 18 19 20 24", "01 04 05 06 08 09 11 12 14 17 18 21 22 23 25",
    "01 02 03 05 06 07 10 11 12 16 18 19 20 21 25", "02 03 04 05 06 10 11 12 13 15 17 20 22 23 25",
    "04 05 06 07 08 10 11 12 13 15 16 18 20 21 25", "02 04 07 08 10 11 12 14 15 18 21 22 23 24 25",
    "02 03 04 05 08 10 11 12 16 17 18 20 21 24 25", "01 02 04 06 08 09 11 12 14 15 18 19 20 21 22",
    "02 03 04 05 06 10 11 12 13 16 17 18 20 21 25", "01 02 05 06 09 10 11 12 13 17 18 19 20 21 24",
    "02 03 04 08 09 10 11 12 14 15 17 18 20 21 23", "01 02 04 05 06 08 10 11 12 18 19 21 23 24 25",
    "01 02 03 04 07 11 12 13 14 18 19 20 21 22 25", "01 03 05 06 07 08 11 12 13 17 18 20 21 22 25"
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

    const tabelaBody = document.getElementById('tabelaResultados').querySelector('tbody');
    MINHAS_APOSTAS.forEach((apostaStr, index) => {
        const newRow = tabelaBody.insertRow();
        const dezenas = apostaStr.split(/[\s,]+/).map(d => d.trim().padStart(2, '0')).filter(d => d && d !== '00');
        const dezenasHtml = dezenas.map(dezena => `<span class="dezena-numero">${dezena}</span>`).join('');
        
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left; padding-left: 10px;">${dezenasHtml}</td>
            <td>-</td>
        `;
    });
});

function conferirJogos() {
    const dezenasSorteadas = new Set(Array.from(document.querySelectorAll('.dezena-sorteada-input')).map(i => parseInt(i.value, 10)).filter(v => !isNaN(v)));
    if (dezenasSorteadas.size !== 15) { alert("Preencha as 15 dezenas sorteadas sem repetição."); return; }

    const todasAsLinhas = document.querySelectorAll('#tabelaResultados tbody tr');
    let resumo = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalJogosPremiados: 0, premioTotalFixo: 0, maiorAcerto: 0 };

    todasAsLinhas.forEach((linha) => {
        const spansDasDezenas = linha.querySelectorAll('.dezena-numero');
        const dezenasAposta = Array.from(spansDasDezenas).map(span => parseInt(span.textContent, 10));
        
        const acertos = dezenasAposta.filter(dezena => dezenasSorteadas.has(dezena)).length;
        
        spansDasDezenas.forEach(span => {
            const dezena = parseInt(span.textContent, 10);
            if (dezenasSorteadas.has(dezena)) {
                span.classList.add('dezena-acertada');
            } else {
                span.classList.remove('dezena-acertada');
            }
        });

        if (acertos > resumo.maiorAcerto) resumo.maiorAcerto = acertos;

        linha.classList.remove('premiada-11', 'premiada-12', 'premiada-13', 'premiada-14', 'premiada-15');
        if (acertos >= 11) {
            linha.classList.add(`premiada-${acertos}`);
            resumo.totalJogosPremiados++;
            const multiplicador = MULTIPLICADORES[dezenasAposta.length];
            if (multiplicador && multiplicador[acertos]) {
                Object.entries(multiplicador[acertos]).forEach(([faixa, qtd]) => {
                    resumo[faixa] += qtd;
                    if (PREMIOS_FIXOS[faixa]) resumo.premioTotalFixo += qtd * PREMIOS_FIXOS[faixa];
                });
            } else {
                resumo[acertos]++;
                if (PREMIOS_FIXOS[acertos]) resumo.premioTotalFixo += PREMIOS_FIXOS[acertos];
            }
        }
        
        const acertosTexto = `<b>${acertos}</b>`;
        const emoji = acertos === 15 ? '🎉' : acertos === 14 ? '🏆' : acertos === 13 ? '💰' : '';
        linha.cells[2].innerHTML = `${acertosTexto} ${emoji}`;
    });

    gerarResumo(resumo, todasAsLinhas.length);
}

function gerarResumo(resumo, totalApostas) {
    const resumoDiv = document.getElementById('resumoPremios');
    resumoDiv.innerHTML = '';
    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    const totalPremios = resumo[11] + resumo[12] + resumo[13] + resumo[14] + resumo[15];

    if (totalPremios > 0) {
        resumoHtml += `<p>Você teve <strong>${resumo.totalJogosPremiados}</strong> de <strong>${totalApostas}</strong> apostas premiadas.</p>`;

        const confettiContainer = document.getElementById('confetti-container');
        if (resumo.maiorAcerto === 15) {
            gerarConfetes(150, confettiContainer);
            mostrarMensagemVitoria('PRÊMIO MÁXIMO!', 'Parabéns! Verifique os canais oficiais para o resgate.');
        } else if (resumo.maiorAcerto === 14) {
            gerarConfetes(70, confettiContainer);
            mostrarMensagemVitoria('EXCELENTE PRÊMIO!', 'Você acertou 14 dezenas! Quase lá!');
        }

        resumoHtml += `
            <table class="tabela-resumo">
                <tbody>
                    <tr><td>15 acertos 🎉</td><td>${resumo[15]}</td><td>Variável</td></tr>
                    <tr><td>14 acertos 🏆</td><td>${resumo[14]}</td><td>Variável</td></tr>
                    <tr><td>13 acertos 💰</td><td>${resumo[13]}</td><td>${(resumo[13] * PREMIOS_FIXOS[13]).toFixed(2).replace('.',',')}</td></tr>
                    <tr><td>12 acertos</td><td>${resumo[12]}</td><td>${(resumo[12] * PREMIOS_FIXOS[12]).toFixed(2).replace('.',',')}</td></tr>
                    <tr><td>11 acertos</td><td>${resumo[11]}</td><td>${(resumo[11] * PREMIOS_FIXOS[11]).toFixed(2).replace('.',',')}</td></tr>
                </tbody>
            </table>
            <div class="total-premios-container">
                <span class="total-premios-label">Total em Prêmios Fixos (11, 12 e 13 acertos):</span>
                <span class="total-premios-valor">R$ ${resumo.premioTotalFixo.toFixed(2).replace('.',',')}</span>
            </div>
        `;
    } else {
        resumoHtml += `<p>Nenhuma aposta foi premiada. Foram conferidos ${totalApostas} jogos.</p>`;
    }
    resumoDiv.innerHTML = resumoHtml;
}
