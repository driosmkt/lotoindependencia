// Valores fixos da premiação por acerto simples
const PREMIOS_FIXOS = {
    11: 6.00,
    12: 12.00,
    13: 30.00
};

// Tabela de multiplicação de prêmios para apostas de 16 dezenas
const MULTIPLICADOR_16_DEZENAS = {
    11: { 11: 5 }, // 5 prêmios de 11 acertos
    12: { 11: 12, 12: 4 }, // 12 de 11 acertos, 4 de 12 acertos
    13: { 12: 13, 13: 3 }, // 13 de 12 acertos, 3 de 13 acertos
    14: { 13: 14, 14: 2 }, // 14 de 13 acertos, 2 de 14 acertos (prêmio variável)
    15: { 14: 15, 15: 1 }  // 15 de 14 acertos, 1 de 15 acertos (prêmio variável)
};

function conferirJogos() {
    // Obter e validar os números sorteados
    const resultadoInput = document.getElementById('resultadoSorteado').value;
    const dezenasSorteadas = new Set(resultadoInput.trim().split(/[\s,]+/).map(Number));

    if (dezenasSorteadas.has(NaN) || dezenasSorteadas.size !== 15) {
        alert("Por favor, insira as 15 dezenas sorteadas corretamente, separadas por espaço ou vírgula.");
        return;
    }

    // Obter as apostas do usuário
    const apostasInput = document.getElementById('minhasApostas').value;
    const linhasApostas = apostasInput.trim().split('\n').filter(linha => linha.trim() !== '');

    if (linhasApostas.length === 0) {
        alert("Por favor, cole suas apostas na área indicada. São esperados 52 jogos (6 de 16 dezenas e 46 de 15).");
        return;
    }

    const tabelaResultados = document.getElementById('tabelaResultados').getElementsByTagName('tbody')[0];
    const resumoPremiosDiv = document.getElementById('resumoPremios');
    tabelaResultados.innerHTML = '';
    resumoPremiosDiv.innerHTML = '';

    // Contadores para o resumo final
    let resumoContadores = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalJogosPremiados: 0 };
    let premioTotalFixo = 0;

    // Iterar sobre cada aposta
    linhasApostas.forEach((linha, index) => {
        const dezenasAposta = linha.trim().split(/[\s,]+/).map(Number);
        if (dezenasAposta.some(isNaN) || (dezenasAposta.length !== 15 && dezenasAposta.length !== 16)) {
            return; // Pula linhas mal formatadas
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
            // Lógica para calcular prêmios com base no tipo de aposta
            if (dezenasAposta.length === 16) { // Aposta com 16 números
                const premiosMultiplos = MULTIPLICADOR_16_DEZENAS[acertos];
                for (const faixa in premiosMultiplos) {
                    const quantidade = premiosMultiplos[faixa];
                    resumoContadores[faixa] += quantidade;
                    if (PREMIOS_FIXOS[faixa]) {
                        premioTotalFixo += quantidade * PREMIOS_FIXOS[faixa];
                    }
                }
            } else { // Aposta com 15 números
                resumoContadores[acertos]++;
                if (PREMIOS_FIXOS[acertos]) {
                    premioTotalFixo += PREMIOS_FIXOS[acertos];
                }
            }
        }

        // Adicionar a linha na tabela de resultados
        const newRow = tabelaResultados.insertRow();
        let classePremiada = '';
        let emoji = '';

        if (acertos >= 11) {
            classePremiada = `premiada-${acertos}`;
            if (acertos >= 13 && acertos <= 15) emoji = '🏆';
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

    // Gerar o resumo final da premiação
    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    if (premioTotalFixo > 0 || resumoContadores[13] > 0 || resumoContadores[14] > 0 || resumoContadores[15] > 0) {
        resumoHtml += `<p>Você teve <strong>${resumoContadores.totalJogosPremiados}</strong> de <strong>${linhasApostas.length}</strong> apostas premiadas.</p><hr>`;
        resumoHtml += `
            <p><strong>${resumoContadores[11]}</strong> prêmio(s) de 11 acertos: <strong>R$ ${(resumoContadores[11] * PREMIOS_FIXOS[11]).toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${resumoContadores[12]}</strong> prêmio(s) de 12 acertos: <strong>R$ ${(resumoContadores[12] * PREMIOS_FIXOS[12]).toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${resumoContadores[13]}</strong> prêmio(s) de 13 acertos: <strong>R$ ${(resumoContadores[13] * PREMIOS_FIXOS[13]).toFixed(2).replace('.',',')}</strong></p>
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
