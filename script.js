// Valores fixos da premiação por acerto simples
const PREMIOS_FIXOS = {
    11: 6.00,
    12: 12.00,
    13: 30.00
};

// Tabela de multiplicação de prêmios para apostas de 16 dezenas
const MULTIPLICADOR_16_DEZENAS = {
    11: { 11: 5 },
    12: { 11: 12, 12: 4 },
    13: { 12: 13, 13: 3 },
    14: { 13: 14, 14: 2 },
    15: { 14: 15, 15: 1 }
};

// Roda quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resultadoContainer');
    // Cria os 15 campos de input
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'tel'; // 'tel' ajuda a abrir o teclado numérico em celulares
        input.classList.add('dezena-sorteada-input');
        input.maxLength = 2;
        input.placeholder = '00';
        container.appendChild(input);
    }
    
    // Adiciona a lógica de auto-pulo
    const inputs = document.querySelectorAll('.dezena-sorteada-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            // Se o campo tiver 2 dígitos e não for o último, foca no próximo
            if (input.value.length === 2 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
});


function conferirJogos() {
    // ---- NOVO: Lendo os números dos 15 campos ----
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
    // ---- FIM DA NOVA LÓGICA ----

    const apostasInput = document.getElementById('minhasApostas').value;
    const linhasApostas = apostasInput.trim().split('\n').filter(linha => linha.trim() !== '');

    if (linhasApostas.length === 0) {
        alert("Por favor, cole suas apostas na área indicada.");
        return;
    }

    const tabelaResultados = document.getElementById('tabelaResultados').getElementsByTagName('tbody')[0];
    const resumoPremiosDiv = document.getElementById('resumoPremios');
    tabelaResultados.innerHTML = '';
    resumoPremiosDiv.innerHTML = '';

    let resumoContadores = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalJogosPremiados: 0 };
    let premioTotalFixo = 0;

    linhasApostas.forEach((linha, index) => {
        const dezenasAposta = linha.trim().split(/[\s,]+/).map(Number);
        if (dezenasAposta.some(isNaN) || (dezenasAposta.length !== 15 && dezenasAposta.length !== 16)) {
            return;
        }

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
            if (dezenasAposta.length === 16) {
                const premiosMultiplos = MULTIPLICADOR_16_DEZENAS[acertos];
                for (const faixa in premiosMultiplos) {
                    const quantidade = premiosMultiplos[faixa];
                    resumoContadores[faixa] += quantidade;
                    if (PREMIOS_FIXOS[faixa]) {
                        premioTotalFixo += quantidade * PREMIOS_FIXOS[faixa];
                    }
                }
            } else {
                resumoContadores[acertos]++;
                if (PREMIOS_FIXOS[acertos]) {
                    premioTotalFixo += PREMIOS_FIXOS[acertos];
                }
            }
        }

        const newRow = tabelaResultados.insertRow();
        let classePremiada = '';
        let emoji = '';

        if (acertos >= 11) {
            classePremiada = `premiada-${acertos}`;
            if (acertos === 13) emoji = '💰';
            if (acertos === 14) emoji = '🏆';
            if (acertos === 15) emoji = '🎉';
        }
        if (classePremiada) newRow.classList.add(classePremiada);
        
        let acertosTexto = `<b>${acertos}</b>`;
        if (dezenasAposta.length === 16) {
             acertosTexto += ` <i>(de 16)</i>`;
        }

        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left;">${dezenasHtml}</td>
            <td>${acertosTexto} ${emoji}</td>
        `;
    });

    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    if (premioTotalFixo > 0 || resumoContadores[14] > 0 || resumoContadores[15] > 0) {
        resumoHtml += `<p>Você teve <strong>${resumoContadores.totalJogosPremiados}</strong> de <strong>${linhasApostas.length}</strong> apostas premiadas.</p><hr>`;
        resumoHtml += `
            <p><strong>${resumoContadores[11]}</strong> prêmio(s) de 11 acertos: <strong>R$ ${(resumoContadores[11] * PREMIOS_FIXOS[11]).toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${resumoContadores[12]}</strong> prêmio(s) de 12 acertos: <strong>R$ ${(resumoContadores[12] * PREMIOS_FIXOS[12]).toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${resumoContadores[13]}</strong> prêmio(s) de 13 acertos 💰: <strong>R$ ${(resumoContadores[13] * PREMIOS_FIXOS[13]).toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${resumoContadores[14]}</strong> prêmio(s) de 14 acertos (Prêmio Variável) 🏆</p>
            <p><strong>${resumoContadores[15]}</strong> prêmio(s) de 15 acertos (Prêmio Principal) 🎉</p>
            <hr>
            <h3>Total em Prêmios Fixos (11, 12 e 13 acertos): R$ ${premioTotalFixo.toFixed(2).replace('.',',')}</h3>
        `;
    } else {
        resumoHtml += `<p>Nenhuma aposta foi premiada. Foram conferidos ${linhasApostas.length} jogos. Mais sorte na próxima!</p>`;
    }

    resumoPremiosDiv.innerHTML = resumoHtml;
}
