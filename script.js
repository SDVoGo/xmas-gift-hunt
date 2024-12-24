const caricaDatiCruciverba = () => {
  // fetch('https://biglieto-natale.netlify.app/parole.json')
  fetch('./parole.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
}

caricaDatiCruciverba()