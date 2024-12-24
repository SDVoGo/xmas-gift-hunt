let jsonSoluzione
let soluzione = Array.from({ length: 7 }, () => Array(11).fill(''));

const caricaDatiCruciverba = () => {
  // fetch('https://biglieto-natale.netlify.app/parole.json')
  return fetch('./parole.json')
    .then((response) => response.json())
    .then((json) => jsonSoluzione = json);
}

const caricaMatrice = (jsonSoluzione) => {
  jsonSoluzione.forEach(element => {
    if (element.orientamento == "orizzontale") {
      for (let i = 0; i < element.parola.length; i++)
        soluzione[element.posizione.y][element.posizione.x + i] = element.parola[i]
    }
    else {
      for (let i = 0; i < element.parola.length; i++)
        soluzione[element.posizione.y + i][element.posizione.x] = element.parola[i]
    }
  });
}

const disegnaCruciverba = () => {
  // < input class="editable-tile" type = "text" maxlength = "1" size = "1" disabled >
  for (let i = 0; i < 77; i++) {
    // Crea l'elemento input
    const input = document.createElement("input");
    // Imposta gli attributi corretti
    input.classList.add("editable-tile");
    input.id = i
    input.type = "text";
    input.maxLength = 1;
    input.size = 1;
    const y = Math.floor(i / 11)
    const x = i % 11
    input.setAttribute("data-y", y)
    input.setAttribute("data-x", x)
    console.log(soluzione);
    input.disabled = soluzione[y][x] === '';
    document.getElementById("cruciverba-container").appendChild(input)
  }
}

window.addEventListener("load", () => {

// Legge il file
caricaDatiCruciverba()
  .then((jsonSoluzione) => caricaMatrice(jsonSoluzione))
  .then(disegnaCruciverba())

})
