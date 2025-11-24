document.addEventListener("DOMContentLoaded", () => {
  carregarNomes("nomes.txt");
});

let nomesGlobais = [];

// Carregar nomes e criar checkboxes estilo Bootstrap
async function carregarNomes(ficheiro) {
  try {
    const response = await fetch(ficheiro);
    const text = await response.text();

    nomesGlobais = text.split("\n").map(n => n.trim()).filter(n => n !== "");
    const container = document.getElementById("lista-nomes");
    container.innerHTML = "";

    nomesGlobais.forEach((nome, index) => {
      const id = "membro_" + index;
      const card = document.createElement("div");
      card.className = "col";

      card.innerHTML = `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${nome}" id="${id}">
          <label class="form-check-label" for="${id}">
            ${nome}
          </label>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (e) {
    console.error("Erro ao carregar nomes:", e);
  }
}

// Geração de equipas com regra Terroristas ≤ CT
function gerarEquipasSelecionadas() {
  const checkboxes = document.querySelectorAll("#lista-nomes input[type=checkbox]:checked");
  const selecionados = Array.from(checkboxes).map(c => c.value);

  if (selecionados.length < 2) {
    abrirModal("<h5 class='text-danger'>Selecione pelo menos 2 nomes!</h5>");
    return;
  }

  // Embaralhar
  for (let i = selecionados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selecionados[i], selecionados[j]] = [selecionados[j], selecionados[i]];
  }

  const total = selecionados.length;
  let tamanhoTerroristas, tamanhoCT;

  if (total % 2 === 0) {
    tamanhoTerroristas = tamanhoCT = total / 2;
  } else {
    tamanhoCT = Math.ceil(total / 2);
    tamanhoTerroristas = total - tamanhoCT;
  }

  const terroristas = selecionados.slice(0, tamanhoTerroristas);
  const ct = selecionados.slice(tamanhoTerroristas);

  abrirModal(`
    <div class="row mt-3">
      <div class="col-md-6">
        <h6 class="text-danger">🧨 Terroristas</h6>
        <ul class="list-group list-group-flush">
          ${terroristas.map(n => `<li class="list-group-item">${n}</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h6 class="text-primary">🛡️ Contra-Terroristas</h6>
        <ul class="list-group list-group-flush">
          ${ct.map(n => `<li class="list-group-item">${n}</li>`).join("")}
        </ul>
      </div>
    </div>
  `);
}

// Abrir modal Bootstrap
function abrirModal(conteudo) {
  document.getElementById("modal-content").innerHTML = conteudo;
  const modal = new bootstrap.Modal(document.getElementById('equipasModal'));
  modal.show();

  // Limpar checkboxes ao fechar
  document.getElementById('equipasModal').addEventListener('hidden.bs.modal', () => {
    const checkboxes = document.querySelectorAll("#lista-nomes input[type=checkbox]");
    checkboxes.forEach(cb => cb.checked = false);
  }, { once: true });
}
