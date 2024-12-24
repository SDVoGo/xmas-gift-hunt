// Funzione per creare la griglia
function creaGriglia() {
  const table = document.getElementById('cruciverba');
  const gridSize = 10;

  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('td');
      cell.classList.add('input-cell');
      const input = document.createElement('input');
      input.maxLength = 1; // Permette solo un carattere per cella
      input.disabled = false;
      cell.appendChild(input);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

// Funzione per posizionare le parole nella griglia
function posizionaParole(parole) {
  parole.forEach(parola => {
    const { parola: word, x, y, orientamento } = parola;

    for (let i = 0; i < word.length; i++) {
      const row = document.querySelectorAll('tr')[y + (orientamento === 'verticale' ? i : 0)];
      const cell = row.children[x + (orientamento === 'orizzontale' ? i : 0)];
      const input = cell.querySelector('input');

      input.value = ''; // Rimuove eventuali valori precedenti
      input.dataset.word = word; // Salva la parola nella cella per confronto
      input.dataset.index = i; // Salva l'indice del carattere
    }
  });
}

// Funzione per aggiungere le definizioni
function aggiungiDefinizioni(parole) {
  const definizioniList = document.getElementById('definizioni');
  parole.forEach(parola => {
    const li = document.createElement('li');
    li.textContent = `${parola.definizione}`;
    definizioniList.appendChild(li);
  });
}

// Funzione per inizializzare il cruciverba
function inizializzaCruciverba(parole) {
  creaGriglia();
  posizionaParole(parole);
  aggiungiDefinizioni(parole);
}
