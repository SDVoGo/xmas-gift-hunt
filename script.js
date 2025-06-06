let jsonSoluzione;
let jsonPosizioni;
let soluzione = Array.from({ length: 7 }, () => Array(11).fill(""));
let movimentazioneCorrente = "";

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

const caricaPosizioniCruciverba = async () => {
  try {
    // Carica il file JSON
    const response = await fetch('./posizioni_aggiuntive.json');
    const json = await response.json();
    jsonPosizioni = json;
  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
  }
};

// Carica la matrice e sblocca i campi che andranno valorizzati
const caricaMatrice = (jsonSoluzione) => {
  jsonSoluzione.forEach(element => {

    // Disegna soluzione e abilita caselle corrette
    if (element.orientamento == "orizzontale") {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y][element.posizione.x + i] = element.parola[i];
        const tile = document.querySelector(`[data-y='${element.posizione.y}'][data-x='${element.posizione.x + i}']`)
        tile.removeAttribute("disabled")
        tile.classList.remove("disabled")
        // Indirizzamento per tab
        if (i == element.parola.length - 1)
          tile.setAttribute("data-orientamento", "stop")
        else
          tile.setAttribute("data-orientamento", element.orientamento)
      }
    } else {
      for (let i = 0; i < element.parola.length; i++) {
        soluzione[element.posizione.y + i][element.posizione.x] = element.parola[i];
        const tile = document.querySelector(`[data-y="${element.posizione.y + i}"][data-x="${element.posizione.x}"]`)
        tile.removeAttribute("disabled")
        tile.classList.remove("disabled")
        // Indirizzamento per tab
        if (i == element.parola.length - 1)
          tile.setAttribute("data-orientamento", "stop")
        else
          tile.setAttribute("data-orientamento", element.orientamento)
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
    // Wrapper
    const wrapper = document.createElement("span")
    wrapper.classList.add("wrapper-editable-tile")

    const input = document.createElement("input");
    input.classList.add("editable-tile");
    input.id = i;
    input.type = "text";
    input.maxLength = 1;
    input.size = 1;
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.toUpperCase();
      gestioneTab(e)
      // Convalida la risposta
      convalidaFase1()
    })

    // Calcolo le coordinate y e x dalla posizione
    const y = Math.floor(i / 11);
    const x = i % 11;
    input.setAttribute("data-y", y);
    input.setAttribute("data-x", x);

    // Se la cella nella soluzione è vuota, disabilita l'input e aggiungi il numero
    if (soluzione[y][x].length === 0) {
      input.classList.add("disabled");
      input.disabled = true;
    }

    // Se c'è una posizione valorizzata sui suggerimenti lo carica
    const posizione = jsonPosizioni.filter((item) => item.posizione.x == x && item.posizione.y == y)
    if (posizione.length == 1) {
      const hint = document.createElement("label")
      hint.innerText = posizione[0].numero
      hint.className = "hint"
      hint.htmlFor = i
      wrapper.appendChild(hint)
    }

    // Assembla il tutto 
    wrapper.appendChild(input)

    // Aggiungi l'input al contenitore
    document.getElementById("cruciverba-container").appendChild(wrapper);
  }
};

const creaFase2 = () => {

  const soluzioneFase2 = ["48.16669745205527", "7.299419453336915"]
  const criptazioneFase2 = ["ZL.DFFFRIZMS0MMSI", "I.SRRZDRZMNNNFRDM"]

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
  //Valorizzare tutte le input della stessa classe
  const input_target = e.target
  const input_associati = document.querySelectorAll("[data-placeholder='" + input_target.dataset.placeholder + "' ]")
  input_associati.forEach(input => {
    input.value = input_target.value
    convalidaFase2()
  });
}

const convalidaFase1 = () => {
  // Qui si nasconderanno le definzione (fase 1) se si vince e avviare la fase 2

  for (let y = 0; y < soluzione.length; y++) {
    for (let x = 0; x < soluzione[y].length; x++) {

      // Se la casella non doveva essere bloccata allora faccio il controllo
      const rispostaCorretta = soluzione[y][x];
      if (rispostaCorretta !== "") {

        const tile = document.querySelector(`[data-x='${x}'][data-y='${y}']`)
        // Se anche solo una è sbagliata, salta
        if (!(rispostaCorretta === tile.value))
          return
      }
    }

  }


  // In caso di fase 1 risolto, nascondere le definizioni
  const definizioni = document.getElementById("cruciverba-definizioni")
  const fase2 = document.getElementById("fase2")

  // Disabilita me modifiche al cruciverba (essendo utile per il prossimo step)
  document.querySelectorAll(".editable-tile").forEach(input => { input.disabled = true });

  // costruzione della fase 2
  creaFase2()

  definizioni.classList.add("riduci");
  fase2.classList.add("compari")
}
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const convalidaFase2 = async () => {
  // Controllo vittora fase 2
  const soluzioneFase2 = "48166697452055277299419453336915"
  const container = document.getElementById("fase2")
  const inputs = container.querySelectorAll(".input_fase2")
  for (let i = 0; i < inputs.length; i++) {
    if (soluzioneFase2[i] !== inputs[i].value)
      return
  }

  // Disabilito i campi
  inputs.forEach(input => {
    input.disabled = true
  });
  const title_fase2 = container.getElementsByTagName("h2")[0]
  const descr_fase2 = container.getElementsByClassName("descr-init")[0]
  // Nascondi campo
  title_fase2.classList.toggle("scompari-testo")
  descr_fase2.classList.toggle("scompari-testo")
  // Modifica scritta
  title_fase2.innerText = "Fase 3: Comprensione"
  descr_fase2.innerHTML = `Opss, che smemorato che sono. Stavo per dimenticarmi cosa stiamo cercando. Sul mio diario ho appuntato :
  <p><b>
  Per la fase due non fermarti,<br>
prendi la prima sillaba, non sbagliarti,<br>
    da ogni parola che hai risolto,<br>
      la chiave troverai, se l'hai colto.</b></p>`
  // Fai riapparire campo
  await sleep(500)
  title_fase2.classList.toggle("scompari-testo")
  descr_fase2.classList.toggle("scompari-testo")

  title_fase2.classList.toggle("compari")
  descr_fase2.classList.toggle("compari")

}

const gestioneTab = (e) => {
  if (e.target.value === "")
    return
  // Se il data-orientamento è Stop = pulisce MovimentazioneCorrente, non va da nessuna parte
  // Se MovimentazioneCorrente è valorizzato segue quello
  // Se MovimentazioneCorrente è vuoto e data-orientamento non è Stop, viene valorizzato dal data-orientamento
  if (e.target.dataset.orientamento === "stop") {
    movimentazioneCorrente = ""
  }
  else {
    if (movimentazioneCorrente === "")
      movimentazioneCorrente = e.target.dataset.orientamento
    // Segue lo spostamento
    if (movimentazioneCorrente === "orizzontale") {
      const next = document.querySelector(`[data-y='${+e.target.dataset.y}'][data-x='${+e.target.dataset.x + 1}']`)
      next.focus()
    }
    else if (movimentazioneCorrente === "verticale") {
      const next = document.querySelector(`[data-y='${+e.target.dataset.y + 1}'][data-x='${+e.target.dataset.x}']`)
      next.focus()
    }
  }
}

window.addEventListener("load", async () => {
  // Carica i dati e la matrice in modo sequenziale
  await caricaDatiCruciverba();
  await caricaPosizioniCruciverba();
  disegnaCruciverba();
  caricaMatrice(jsonSoluzione);
});
