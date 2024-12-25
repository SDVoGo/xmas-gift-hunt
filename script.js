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
  let j = 0;
  jsonSoluzione.forEach(element => {

    // Disegna soluzione e abilita caselle corrette
    if (element.orientamento == "orizzontale") {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y][element.posizione.x + i] = element.parola[i];
        const tile = document.querySelector(`[data-y='${element.posizione.y}'][data-x='${element.posizione.x + i}']`)
        tile.removeAttribute("disabled")
        tile.setAttribute("tabindex", j)
        j++
      }
    } else {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y + i][element.posizione.x] = element.parola[i];
        const tile = document.querySelector(`[data-y="${element.posizione.y + i}"][data-x="${element.posizione.x}"]`)
        tile.removeAttribute("disabled")
        tile.setAttribute("tabindex", j)
        j++
      }
    }

    // Aggiungi definizione
    const definizione = document.createElement("span")
    definizione.textContent = ` ${element.numero} - ${element.orientamento}: ${element.definizione}`
    definizione.classList.add("definizione")

    const containerDefinizioni = document.getElementById("cruciverba-definizioni")
    containerDefinizioni.appendChild(definizione)
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
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
    })

    // Calcolo le coordinate y e x dalla posizione
    const y = Math.floor(i / 11);
    const x = i % 11;
    input.setAttribute("data-y", y);
    input.setAttribute("data-x", x);

    // Se la cella nella soluzione è vuota, disabilita l'input e aggiungi il numero
    if (soluzione[y][x].length === 0) {
      input.disabled = true;

    }

    // Aggiungi l'input al contenitore
    document.getElementById("cruciverba-container").appendChild(input);
  }
};

const creaFase2 = () => {

  const soluzioneFase2 = ["48.166484273443835", "7.299395126276755"]
  const criptazioneFase2 = ["ZL.DFFZLSINZZNLNM", "I.SRRNRMSDFSIFIMM"]

  // Caselle riempibili per decifrare
  for (let NordEst = 0; NordEst < 2; NordEst++) {
    const soluzione = soluzioneFase2[NordEst]
    const criptazione = criptazioneFase2[NordEst]
    // Crea lo span in cui va inserita la parte della soluzione
    const span = document.createElement("span")
    span.className = "soluzioneFase2"
    for (let index = 0; index < soluzione.length; index++) {
      // Se è un punto basta una label
      if (!soluzione[index].localeCompare(".")) {
        const label = document.createElement("label")
        label.textContent = "."
        span.appendChild(label)
      }
      // Altrimeti fa un input
      else {
        const input = document.createElement("input")
        // input.type = "number"
        input.placeholder = criptazione[index]
        input.maxLength = 1
        input.className = "input_fase2"
        input.setAttribute("data-placeholder", input.placeholder)
        input.addEventListener("input", valorizzaRisultatoFase2)
        span.appendChild(input)
      }
    }
    document.getElementById("fase2").appendChild(span)
  }
}

const valorizzaRisultatoFase2 = (e) => {
  //Valorizzare tutte le input della stessa <classe></classe>
  const input_target = e.target
  const input_associati = document.querySelectorAll("[data-placeholder='" + input_target.dataset.placeholder + "' ]")
  input_associati.forEach(input => {
    input.value = input_target.value
  });
}

window.addEventListener("load", async () => {
  // Carica i dati e la matrice in modo sequenziale
  await caricaDatiCruciverba();
  disegnaCruciverba();
  caricaMatrice(jsonSoluzione);

  // TODO: Qui si nasconderanno le definzione (fase 1) se si vince e avviare la fase 2

  // costruzione della fase 2
  creaFase2()

});
