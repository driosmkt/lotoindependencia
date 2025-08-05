// --- Valores e Multiplicadores (sem alterações) ---
const PREMIOS_FIXOS = { 11: 6.00, 12: 12.00, 13: 30.00 };
const MULTIPLICADORES = {
    16: { 11: { 11: 5 }, 12: { 11: 12, 12: 4 }, 13: { 12: 13, 13: 3 }, 14: { 13: 14, 14: 2 }, 15: { 14: 15, 15: 1 } }
};

// --- Funções de Animação (com melhorias) ---
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
    messageDiv.innerHTML = `
        <strong style="font-size: 1.5em; display: block;">${titulo}</strong>
        <p style="font-size: 0.8em; margin: 10px 0 0 0;">${subtitulo}</p>
    `;
    container.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// --- Lógica Principal (com as principais correções) ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resultadoContainer');
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'tel'; input.className = 'dezena-sorteada-input'; input.maxLength = 2;
        input.placeholder = '00'; input.setAttribute('aria-label', `Dezena ${i + 1}`);
        container.appendChild(input);
        input.addEventListener('input', () => {
            if (input.value.length === input.maxLength && i < 14) container.children[i + 1].focus();
        });
    }
});

function conferirJogos() {
    const dezenasSorteadas = new Set(Array.from(document.querySelectorAll('.dezena-sorteada-input')).map(i => parseInt(i.value, 10)).filter(v => !isNaN(v)));
    if (dezenasSorteadas.size !== 15) { alert("Preencha as 15 dezenas sorteadas sem repetição."); return; }

    const linhasApostas = document.getElementById('minhasApostas').value.trim().split('\n').filter(l => l.trim() !== '');
    if (linhasApostas.length === 0) { alert("Cole suas apostas na área indicada."); return; }

    const tabelaBody = document.getElementById('tabelaResultados').querySelector('tbody');
    tabelaBody.innerHTML = '';

    let resumo = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalJogosPremiados: 0, premioTotalFixo: 0, maiorAcerto: 0 };

    linhasApostas.forEach((linha, index) => {
        const dezenasAposta = [...new Set(linha.trim().split(/[\s,]+/).map(Number).filter(n => n > 0 && n <= 25))];
        if (dezenasAposta.length < 15) return;

        const acertos = dezenasAposta.filter(dezena => dezenasSorteadas.has(dezena)).length;
        if (acertos > resumo.maiorAcerto) resumo.maiorAcerto = acertos;

        let dezenasHtml = dezenasAposta.map(dezena => `<span class="dezena-numero ${dezenasSorteadas.has(dezena) ? 'dezena-acertada' : ''}">${String(dezena).padStart(2, '0')}</span>`).join('');
        
        if (acertos >= 11) {
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
        
        const newRow = tabelaBody.insertRow();
        if (acertos >= 11) newRow.classList.add(`premiada-${acertos}`);
        
        // --- LÓGICA CORRIGIDA: Texto de acertos ---
        let acertosTexto = `<b>${acertos}</b>`;
        if (dezenasAposta.length > 15) {
            acertosTexto += ` <i style="font-size:0.8em;opacity:0.8;">(de ${dezenasAposta.length})</i>`;
        }

        let emoji = acertos === 15 ? '🎉' : acertos === 14 ? '🏆' : acertos === 13 ? '💰' : '';
        newRow.innerHTML = `<td>${index + 1}</td><td style="text-align: left; padding-left: 10px;">${dezenasHtml}</td><td>${acertosTexto} ${emoji}</td>`;
    });

    gerarResumo(resumo, linhasApostas.length);
}

function gerarResumo(resumo, totalApostas) {
    const resumoDiv = document.getElementById('resumoPremios');
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
