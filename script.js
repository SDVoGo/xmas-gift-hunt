let jsonSoluzione;
let soluzione = Array.from({ length: 7 }, () => Array(11).fill(""));

const caricaDatiCruciverba = async () => {
  try {
    // Carica il file JSON
    const response = await fetch('./parole.json');
    const json = await response.json();
    jsonSoluzione = json;
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
  }
};

// Carica la matrice e sblocca i campi che andranno valorizzati
const caricaMatrice = (jsonSoluzione) => {
  jsonSoluzione.forEach(element => {
    if (element.orientamento == "orizzontale") {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y][element.posizione.x + i] = element.parola[i];
        document.querySelector(`[data-y='${element.posizione.y}'][data-x='${element.posizione.x + i}']`).removeAttribute("disabled")
      }
    } else {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y + i][element.posizione.x] = element.parola[i];
        document.querySelector(`[data-y="${element.posizione.y + i}"][data-x="${element.posizione.x}"]`).removeAttribute("disabled")
      }
    }
  });
};

const disegnaCruciverba = () => {

  // Ciclo per disegnare 77 input nella griglia
  for (let i = 0; i < 77; i++) {
    const input = document.createElement("input");
    input.classList.add("editable-tile");
    input.id = i;
    input.type = "text";
    input.maxLength = 1;
    input.size = 1;

    // Calcolo le coordinate y e x dalla posizione
    const y = Math.floor(i / 11);
    const x = i % 11;

    input.setAttribute("data-y", y);
    input.setAttribute("data-x", x);

    // Se la cella nella soluzione è vuota, disabilita l'input
    input.disabled = soluzione[y][x].length === 0;

    // Aggiungi l'input al contenitore
    document.getElementById("cruciverba-container").appendChild(input);
  }
};

window.addEventListener("load", async () => {
  // Carica i dati e la matrice in modo sequenziale
  await caricaDatiCruciverba();
  disegnaCruciverba();
  caricaMatrice(jsonSoluzione);
});
