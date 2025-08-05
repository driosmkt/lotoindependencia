// Valores fixos da premiação por acerto simples
const PREMIOS_FIXOS = {
    11: 6.00,
    12: 12.00,
    13: 30.00
};

// Tabela de multiplicação de prêmios para apostas múltiplas
const MULTIPLICADORES = {
    16: { 11: { 11: 5 }, 12: { 11: 12, 12: 4 }, 13: { 12: 13, 13: 3 }, 14: { 13: 14, 14: 2 }, 15: { 14: 15, 15: 1 } },
    // Adicionar aqui para 17, 18, 19, 20 dezenas se necessário no futuro
};

// --- Funções de Animação (sem alterações) ---
function criarConfete(container) {
    const confete = document.createElement('div');
    confete.className = 'confetti';
    confete.style.left = `${Math.random() * 100}vw`;
    confete.style.animationDelay = `${Math.random() * 2}s`;
    const colors = ['#FFD700', '#7F3992', '#FF4500', '#00BFFF'];
    confete.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(confete);
    setTimeout(() => confete.remove(), 4000);
}

function gerarConfetes(quantidade, container) {
    for (let i = 0; i < quantidade; i++) {
        criarConfete(container);
    }
}

function mostrarMensagemVitoria(pontuacao, tipoAposta) {
    const container = document.getElementById('confetti-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'win-message';
    messageDiv.innerHTML = `
        🎉 PARABÉNS! 🎉<br>
        Você acertou ${pontuacao} dezenas! (${tipoAposta})<br><br>
        <small style="font-size:0.7em;">Busque os canais oficiais da Loteria para saber o valor exato do prêmio e como resgatá-lo!</small>
    `;
    container.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 6000);
}


// --- Lógica Principal ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resultadoContainer');
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'tel'; input.className = 'dezena-sorteada-input';
        input.maxLength = 2; input.placeholder = '00';
        input.setAttribute('aria-label', `Dezena ${i + 1}`);
        container.appendChild(input);
        
        input.addEventListener('input', () => {
            if (input.value.length === input.maxLength && i < 14) {
                container.children[i + 1].focus();
            }
        });
    }
});

function conferirJogos() {
    const inputsSorteados = document.querySelectorAll('.dezena-sorteada-input');
    const dezenasSorteadas = new Set();
    inputsSorteados.forEach(input => {
        const valor = parseInt(input.value, 10);
        if (!isNaN(valor) && valor >= 1 && valor <= 25) {
            dezenasSorteadas.add(valor);
        }
    });

    if (dezenasSorteadas.size !== 15) {
        alert("Por favor, preencha todos os 15 campos do sorteio com números válidos e sem repetição.");
        return;
    }

    const linhasApostas = document.getElementById('minhasApostas').value.trim().split('\n').filter(l => l.trim() !== '');
    if (linhasApostas.length === 0) {
        alert("Por favor, cole suas apostas na área indicada.");
        return;
    }

    const tabelaBody = document.getElementById('tabelaResultados').querySelector('tbody');
    const resumoDiv = document.getElementById('resumoPremios');
    tabelaBody.innerHTML = '';
    resumoDiv.innerHTML = '';

    let resumoContadores = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalJogosPremiados: 0 };
    let premioTotalFixo = 0;
    let houvePremioMaximo = false;

    linhasApostas.forEach((linha, index) => {
        const dezenasAposta = linha.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0);
        if (dezenasAposta.length < 15) return;

        let acertos = 0;
        let dezenasHtml = '';
        dezenasAposta.forEach(dezena => {
            if (dezenasSorteadas.has(dezena)) {
                acertos++;
                dezenasHtml += `<span class="dezena-numero dezena-acertada">${String(dezena).padStart(2, '0')}</span>`;
            } else {
                dezenasHtml += `<span class="dezena-numero">${String(dezena).padStart(2, '0')}</span>`;
            }
        });

        if (acertos >= 11) {
            resumoContadores.totalJogosPremiados++;
            const multiplicador = MULTIPLICADORES[dezenasAposta.length];

            if (multiplicador && multiplicador[acertos]) {
                const premiosMultiplos = multiplicador[acertos];
                for (const faixa in premiosMultiplos) {
                    const quantidade = premiosMultiplos[faixa];
                    resumoContadores[faixa] += quantidade;
                    if (PREMIOS_FIXOS[faixa]) {
                        premioTotalFixo += quantidade * PREMIOS_FIXOS[faixa];
                    }
                }
            } else { // Aposta simples ou acerto máximo
                resumoContadores[acertos]++;
                if (PREMIOS_FIXOS[acertos]) {
                    premioTotalFixo += PREMIOS_FIXOS[acertos];
                }
            }
        }
        
        const newRow = tabelaBody.insertRow();
        let emoji = '';
        if (acertos >= 11) newRow.classList.add(`premiada-${acertos}`);
        if (acertos === 15) {
            houvePremioMaximo = true;
            newRow.classList.add('premiada-maxima'); // Adiciona a classe para a animação de brilho
            emoji = '🎉';
        } else if (acertos === 14) {
            emoji = '🏆';
        } else if (acertos === 13) {
            emoji = '💰';
        }
        
        // --- NOVO: Lógica corrigida para exibir o texto de acertos ---
        let acertosTexto = `<b>${acertos}</b>`;
        if (dezenasAposta.length > 15) {
             acertosTexto += ` <i style="font-size:0.8em;">(de ${dezenasAposta.length})</i>`;
        }

        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left; padding-left: 10px;">${dezenasHtml}</td>
            <td>${acertosTexto} ${emoji}</td>
        `;
    });

    // --- NOVO: Geração do resumo em formato de TABELA ---
    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    const totalDePremios = resumoContadores[11] + resumoContadores[12] + resumoContadores[13] + resumoContadores[14] + resumoContadores[15];
    if (totalDePremios > 0) {
        resumoHtml += `<p>Você teve <strong>${resumoContadores.totalJogosPremiados}</strong> de <strong>${linhasApostas.length}</strong> apostas premiadas.</p>`;
        
        if (houvePremioMaximo) {
            const confettiContainer = document.getElementById('confetti-container');
            gerarConfetes(100, confettiContainer);
            mostrarMensagemVitoria('15', 'Prêmio Máximo');
        }

        resumoHtml += `
            <table class="tabela-resumo">
                <thead>
                    <tr><th>Faixa de Prêmio</th><th>Qtd. Prêmios</th><th>Valor (R$)</th></tr>
                </thead>
                <tbody>
                    <tr><td>15 acertos 🎉</td><td>${resumoContadores[15]}</td><td>Variável</td></tr>
                    <tr><td>14 acertos 🏆</td><td>${resumoContadores[14]}</td><td>Variável</td></tr>
                    <tr><td>13 acertos 💰</td><td>${resumoContadores[13]}</td><td>${(resumoContadores[13] * PREMIOS_FIXOS[13]).toFixed(2).replace('.',',')}</td></tr>
                    <tr><td>12 acertos</td><td>${resumoContadores[12]}</td><td>${(resumoContadores[12] * PREMIOS_FIXOS[12]).toFixed(2).replace('.',',')}</td></tr>
                    <tr><td>11 acertos</td><td>${resumoContadores[11]}</td><td>${(resumoContadores[11] * PREMIOS_FIXOS[11]).toFixed(2).replace('.',',')}</td></tr>
                </tbody>
            </table>
            <hr>
            <h3>Total em Prêmios Fixos (11, 12 e 13 acertos): R$ ${premioTotalFixo.toFixed(2).replace('.',',')}</h3>
        `;
    } else {
        resumoHtml += `<p>Nenhuma aposta foi premiada. Foram conferidos ${linhasApostas.length} jogos. Mais sorte na próxima!</p>`;
    }

    resumoDiv.innerHTML = resumoHtml;
}
