document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('gerarBtn').addEventListener('click', gerarCUI);
  document.getElementById('validarBtn').addEventListener('click', validarCUI);
  document.getElementById('digitosBtn').addEventListener('click', gerarCheckDigits);
  
  document.getElementById('cui').addEventListener('input', limparValidacao);
  document.getElementById('cuiCheck').addEventListener('input', limparCheckDigits);
});

function limparValidacao() {
  const validacaoDiv = document.getElementById('validacao');
  validacaoDiv.textContent = 'Resultado da validação aparecerá aqui';
  validacaoDiv.className = 'result-box';
}

function limparCheckDigits() {
  const checkDigitsDiv = document.getElementById('checkDigits');
  checkDigitsDiv.textContent = 'Dígitos calculados aparecerão aqui';
  checkDigitsDiv.className = 'result-box';
}

function gerarCodigoLocal() {
  const digitosAleatorios = parseInt(document.getElementById('digitosAleatorios').value);
  const digitosFixos = 12 - digitosAleatorios;
  
  let codigo = '';
  
  // Parte fixa (zeros)
  for (let i = 0; i < digitosFixos; i++) {
    codigo += '0';
  }
  
  // Parte aleatória
  for (let i = 0; i < digitosAleatorios; i++) {
    codigo += Math.floor(Math.random() * 10).toString();
  }
  
  return codigo;
}

function calculateCheckDigits(base) {
  const numericPart = base.startsWith('PT') ? base.slice(2) : base;
  
  if (numericPart.length !== 16) {
    throw new Error('A parte numérica deve ter 16 dígitos');
  }

  let mod = 0;
  for (let i = 0; i < numericPart.length; i++) {
    const digit = parseInt(numericPart[i], 10);
    if (isNaN(digit)) {
      throw new Error('Caractere inválido na parte numérica');
    }
    mod = (mod * 10 + digit) % 529;
  }

  const table = [
    'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X',
    'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'
  ];

  const a = Math.floor(mod / 23);
  const b = mod % 23;

  return table[a] + table[b];
}

function copiarParaClipboard(texto, btn) {
  navigator.clipboard.writeText(texto).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '✓';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
    }, 2000);
  }).catch(err => {
    console.error('Erro ao copiar: ', err);
  });
}

function gerarCUI() {
  try {
    const prefixo = 'PT';
    const operador = document.getElementById('operador').value;
    const digitosAleatorios = parseInt(document.getElementById('digitosAleatorios').value);
    const codigoLocal = gerarCodigoLocal();
    const base = prefixo + operador + codigoLocal;
    const checkDigits = calculateCheckDigits(base);
    
    const cuiCompleto = base + checkDigits;
    const resultadoDiv = document.getElementById('resultado');
    
    const digitosFixos = 12 - digitosAleatorios;
    const parteAleatoria = codigoLocal.slice(digitosFixos);
    
    resultadoDiv.innerHTML = `
      <div class="copy-container">
        <button class="copy-btn" title="Copiar CUI" onclick="copiarParaClipboard('${cuiCompleto}', this)">📋</button>
      </div>
      <div class="result-content">
        <strong>CUI Gerado:</strong> ${cuiCompleto}
        <div class="cui-details">
          <strong>Dígitos aleatórios:</strong> ${digitosAleatorios} (<span class="random-part">${parteAleatoria}</span>)
        </div>
        <div class="cui-structure">
          <div><strong>País:</strong> ${prefixo}</div>
          <div><strong>Código operador:</strong> ${operador}</div>
          <div><strong>Código livre:</strong> ${codigoLocal}</div>
          <div><strong>Código verificação:</strong> ${checkDigits}</div>
        </div>
      </div>
    `;
    
    resultadoDiv.className = 'result-box success';
  } catch (error) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<div class="result-content">❌ <strong>Erro ao gerar CUI:</strong> ${error.message}</div>`;
    resultadoDiv.className = 'result-box error';
  }
}

function gerarCheckDigits() {
  try {
    const cuiInput = document.getElementById('cuiCheck').value.trim().toUpperCase();
    const checkDigitsDiv = document.getElementById('checkDigits');
    
    if (cuiInput.length !== 18) {
      checkDigitsDiv.textContent = '❌ Comprimento inválido! Deve ter 18 caracteres (incluindo PT).';
      checkDigitsDiv.className = 'result-box error';
      return;
    }

    const checkDigits = calculateCheckDigits(cuiInput);
    checkDigitsDiv.innerHTML = `
      <div class="copy-container">
        <button class="copy-btn" title="Copiar dígitos" onclick="copiarParaClipboard('${cuiInput}${checkDigits}', this)">📋</button>
      </div>
      <div class="result-content">
        <div><strong>Dígitos de verificação:</strong> ${checkDigits}<div>
        <div><strong>CUI completo:</strong> ${cuiInput}${checkDigits}</div>
      </div>
    `;
    
    checkDigitsDiv.className = 'result-box success';
  } catch (error) {
    const checkDigitsDiv = document.getElementById('checkDigits');
    checkDigitsDiv.textContent = `❌ Erro no cálculo: ${error.message}`;
    checkDigitsDiv.className = 'result-box error';
  }
}

function validarCUI() {
  try {
    const cuiInput = document.getElementById('cui').value.trim().toUpperCase();
    const validacaoDiv = document.getElementById('validacao');
    
    if (cuiInput.length !== 20) {
      validacaoDiv.textContent = '❌ CUI inválido! Deve ter exatamente 20 caracteres.';
      validacaoDiv.className = 'result-box error';
      return;
    }

    const base = cuiInput.slice(0, -2);
    const checkDigits = cuiInput.slice(-2);
    const calculatedDigits = calculateCheckDigits(base);
    
    if (checkDigits === calculatedDigits) {
      validacaoDiv.textContent = '✅ CUI válido!';
      validacaoDiv.className = 'result-box success';
    } else {
      validacaoDiv.textContent = `❌ CUI inválido! Dígitos corretos: ${calculatedDigits}`;
      validacaoDiv.className = 'result-box error';
    }
  } catch (error) {
    const validacaoDiv = document.getElementById('validacao');
    validacaoDiv.textContent = `❌ Erro na validação: ${error.message}`;
    validacaoDiv.className = 'result-box error';
  }
}
