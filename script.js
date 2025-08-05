// Valores fixos da premiação por acerto simples
const PREMIOS_FIXOS = {
    11: 6.00,
    12: 12.00,
    13: 30.00
};

// Tabela de multiplicação de prêmios para apostas de 16 dezenas
const MULTIPLICADOR_16_DEZENAS = {
    11: { 11: 5 }, // Acertando 11, ganha 5x o prêmio de 11
    12: { 11: 12, 12: 4 }, // Acertando 12, ganha 12x o de 11 e 4x o de 12
    13: { 12: 13, 13: 3 }, // Acertando 13, ganha 13x o de 12 e 3x o de 13
    14: { 13: 14, 14: 2 }, // Acertando 14, ganha 14x o de 13 e 2x o de 14
    15: { 14: 15, 15: 1 }  // Acertando 15, ganha 15x o de 14 e 1x o de 15
};

// Função para criar um único confete
function criarConfete(x, y, container, cor, tamanho, rotacao) {
    const confete = document.createElement('div');
    confete.className = 'confetti';
    confete.style.left = `${x}px`;
    confete.style.top = `${y}px`;
    confete.style.setProperty('--size', `${tamanho}px`);
    confete.style.setProperty('--rotation', `${rotacao}deg`);
    confete.classList.add(cor);
    container.appendChild(confete);

    // Remove o confete do DOM após o fim da animação
    setTimeout(() => {
        confete.remove();
    }, 4000); // A animação dura 4 segundos
}

// Função para criar múltiplos confetes
function gerarConfetes(quantidade, container) {
    for (let i = 0; i < quantidade; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const tamanho = Math.random() * 15 + 10; // Tamanho entre 10px e 25px
        const rotacao = Math.random() * 360;
        const cor = `color-${Math.floor(Math.random() * 4) + 1}`; // Escolhe uma cor aleatória
        criarConfete(x, y, container, cor, tamanho, rotacao);
    }
}

// Função para mostrar a mensagem de vitória
function mostrarMensagemVitoria(pontuacao, ehDezesseisNumeros) {
    const winMessageContainer = document.getElementById('confetti-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('win-message');
    
    let mensagem = '🎉 PARABÉNS! 🎉<br>';
    mensagem += `Você acertou ${pontuacao} dezenas em uma das suas apostas!`;
    if (ehDezesseisNumeros) {
        mensagem += ' (Aposta de 16 números)';
    }
    mensagem += '<br><br>';
    mensagem += 'Busque informações nos canais oficiais da Loteria para saber o valor exato do prêmio e como resgatá-lo!';
    
    messageDiv.innerHTML = mensagem;
    winMessageContainer.appendChild(messageDiv);

    // Remove a mensagem após alguns segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 6000); // A animação dura 6 segundos
}

// Roda quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resultadoContainer');
    // Cria os 15 campos de input dinamicamente
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'tel';
        input.className = 'dezena-sorteada-input';
        input.maxLength = 2;
        input.placeholder = '00';
        input.setAttribute('aria-label', `Dezena ${i + 1}`);
        container.appendChild(input);
    }
    
    // Adiciona a lógica de auto-pulo para os campos
    const inputs = document.querySelectorAll('.dezena-sorteada-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === input.maxLength && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
});

function conferirJogos() {
    // Lê os números dos 15 campos do sorteio
    const inputsSorteados = document.querySelectorAll('.dezena-sorteada-input');
    const dezenasSorteadas = new Set();
    
    inputsSorteados.forEach(input => {
        const valor = parseInt(input.value, 10);
        if (!isNaN(valor) && valor >= 1 && valor <= 25) {
            dezenasSorteadas.add(valor);
        }
    });

    if (dezenasSorteadas.size !== 15) {
        alert("Por favor, preencha todos os 15 campos do sorteio com números válidos (de 01 a 25) e sem repetição.");
        return;
    }

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
    let houvePremioMaximo = false; // Flag para indicar se houve prêmio máximo

    // Itera sobre cada aposta colada
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
            const ehDezesseisNumeros = dezenasAposta.length === 16;

            if (acertos === 15) { // Prêmio máximo!
                houvePremioMaximo = true;
                // Para o prêmio máximo, apenas contamos e mostramos a informação
                // Não calculamos prêmios fixos, pois o valor é variável e alto
                if (ehDezesseisNumeros) {
                    resumoContadores[15] += 1; // Conta como um jogo de 15 acertos (desdobrado)
                } else {
                    resumoContadores[15]++;
                }
            } else if (acertos >= 11) { // Prêmios menores
                if (ehDezesseisNumeros) {
                    const premiosMultiplos = MULTIPLICADOR_16_DEZENAS[acertos];
                    for (const faixa in premiosMultiplos) {
                        const quantidade = premiosMultiplos[faixa];
                        resumoContadores[faixa] += quantidade;
                        if (PREMIOS_FIXOS[faixa]) {
                            premioTotalFixo += quantidade * PREMIOS_FIXOS[faixa];
                        }
                    }
                } else { // Aposta simples de 15 dezenas
                    resumoContadores[acertos]++;
                    if (PREMIOS_FIXOS[acertos]) {
                        premioTotalFixo += PREMIOS_FIXOS[acertos];
                    }
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
             acertosTexto += ` <i style="font-size:0.8em;">(de 16)</i>`;
        }

        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align: left; padding-left: 10px;">${dezenasHtml}</td>
            <td>${acertosTexto} ${emoji}</td>
        `;
    });

    // Gera o HTML do resumo final
    let resumoHtml = '<h2>Resumo da Premiação</h2>';
    const totalDePremiosContados = Object.values(resumoContadores).slice(0, 5).reduce((a, b) => a + b, 0);

    if (totalDePremiosContados > 0) {
        resumoHtml += `<p>Você teve <strong>${resumoContadores.totalJogosPremiados}</strong> de <strong>${linhasApostas.length}</strong> apostas premiadas.</p><hr>`;
        
        if (resumoContadores[15] > 0) {
            resumoHtml += `<p style="color: #FFD700; font-size: 1.2em;"><strong>${resumoContadores[15]}</strong> aposta(s) com 15 acertos! PARABÉNS! 🎉 Busque informações oficiais para o valor exato e resgate seu prêmio!</p><hr>`;
            // Chama a função para gerar confetes e a mensagem de vitória quando houver 15 acertos
            const confettiContainer = document.getElementById('confetti-container');
            gerarConfetes(100, confettiContainer); // Cria 100 confetes
            // Encontra qual foi a aposta de 15 acertos para passar os detalhes
            linhasApostas.forEach((linha, index) => {
                const dezenasAposta = linha.trim().split(/[\s,]+/).map(Number);
                let acertos = 0;
                dezenasAposta.forEach(dezena => {
                    if (dezenasSorteadas.has(dezena)) {
                        acertos++;
                    }
                });
                if (acertos === 15) {
                    mostrarMensagemVitoria(15, dezenasAposta.length === 16);
                }
            });
        }

        resumoHtml += `<p><strong>${resumoContadores[11]}</strong> prêmio(s) de 11 acertos: <strong>R$ ${(resumoContadores[11] * PREMIOS_FIXOS[11]).toFixed(2).replace('.',',')}</strong></p>`;
        resumoHtml += `<p><strong>${resumoContadores[12]}</strong> prêmio(s) de 12 acertos: <strong>R$ ${(resumoContadores[12] * PREMIOS_FIXOS[12]).toFixed(2).replace('.',',')}</strong></p>`;
        resumoHtml += `<p><strong>${resumoContadores[13]}</strong> prêmio(s) de 13 acertos 💰: <strong>R$ ${(resumoContadores[13] * PREMIOS_FIXOS[13]).toFixed(2).replace('.',',')}</strong></p>`;
        resumoHtml += `<p><strong>${resumoContadores[14]}</strong> prêmio(s) de 14 acertos (Prêmio Variável) 🏆</p>`;
        
        resumoHtml += `<hr><h3>Total em Prêmios Fixos (11, 12 e 13 acertos): R$ ${premioTotalFixo.toFixed(2).replace('.',',')}</h3>`;
    } else {
        resumoHtml += `<p>Nenhuma aposta foi premiada. Foram conferidos ${linhasApostas.length} jogos. Mais sorte na próxima vez!</p>`;
    }

    resumoPremiosDiv.innerHTML = resumoHtml;
}
