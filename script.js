// Valores fixos da premiação
const PREMIO_11_ACERTOS = 6.00;
const PREMIO_12_ACERTOS = 12.00;
// O prêmio de 13 acertos também é fixo, mas como pediu para não incluir, mantemos separado
const PREMIO_13_ACERTOS = 30.00;

function conferirJogos() {
    // Obter os números sorteados e validar
    const resultadoInput = document.getElementById('resultadoSorteado').value;
    const dezenasSorteadas = resultadoInput.trim().split(/[\s,]+/).map(Number);

    if (dezenasSorteadas.some(isNaN) || dezenasSorteadas.length !== 15) {
        alert("Por favor, insira as 15 dezenas sorteadas, separadas por espaço ou vírgula.");
        return;
    }

    // Obter as apostas do usuário
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

    // Contadores para o resumo
    let contadores = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 };

    // Iterar sobre cada aposta
    linhasApostas.forEach((linha, index) => {
        const dezenasAposta = linha.trim().split(/[\s,]+/).map(Number);
        if (dezenasAposta.some(isNaN) || dezenasAposta.length < 15) {
            return; // Pula linhas mal formatadas
        }

        let acertos = 0;
        let dezenasHtml = '';

        dezenasAposta.forEach(dezena => {
            if (dezenasSorteadas.includes(dezena)) {
                acertos++;
                dezenasHtml += `<span class="dezena-numero dezena-acertada">${String(dezena).padStart(2, '0')}</span>`;
            } else {
                dezenasHtml += `<span class="dezena-numero">${String(dezena).padStart(2, '0')}</span>`;
            }
        });

        // Adicionar a linha na tabela de resultados
        const newRow = tabelaResultados.insertRow();
        let classePremiada = '';
        let emoji = '';

        if (acertos >= 11) {
            contadores[acertos]++;
            classePremiada = `premiada-${acertos}`;
            if (acertos === 13) emoji = '💰';
            if (acertos === 14) emoji = '🏆';
            if (acertos === 15) emoji = '🎉';
        }

        if (classePremiada) {
            newRow.classList.add(classePremiada);
        }

        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left;">${dezenasHtml}</td>
            <td><b>${acertos} ${emoji}</b></td>
        `;
    });

    // Calcular prêmios e gerar o resumo
    const totalPremio11 = contadores[11] * PREMIO_11_ACERTOS;
    const totalPremio12 = contadores[12] * PREMIO_12_ACERTOS;
    const totalPremioEstimado = totalPremio11 + totalPremio12;

    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    if (totalPremioEstimado > 0 || contadores[13] > 0 || contadores[14] > 0 || contadores[15] > 0) {
         resumoHtml += `
            <p><strong>${contadores[11]}</strong> aposta(s) com 11 acertos: <strong>R$ ${totalPremio11.toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${contadores[12]}</strong> aposta(s) com 12 acertos: <strong>R$ ${totalPremio12.toFixed(2).replace('.',',')}</strong></p>
            <p><strong>${contadores[13]}</strong> aposta(s) com 13 acertos (Prêmio Variável) 💰</p>
            <p><strong>${contadores[14]}</strong> aposta(s) com 14 acertos (Prêmio Variável) 🏆</p>
            <p><strong>${contadores[15]}</strong> aposta(s) com 15 acertos (Prêmio Principal) 🎉</p>
            <hr>
            <h3>Total Estimado (Prêmios Fixos): R$ ${totalPremioEstimado.toFixed(2).replace('.',',')}</h3>
        `;
    } else {
        resumoHtml += '<p>Nenhuma aposta foi premiada. Mais sorte na próxima vez!</p>';
    }

    resumoPremiosDiv.innerHTML = resumoHtml;
}