// variables et constantes
let base_url = "http://localhost:8000/api/v1/titles/";
let liste_genres = [];
const genres_fixes = ["Mystery", "Drama"];
const boutons_plus_ids = ["plus_best", "plus_genre1", "plus_genre2", "plus_choix"];
const divs_ids = ["meilleurs-films", "genre1", "genre2", "genre_choisi"];


async function getMeilleursFilms() {
  let url_best_imdb_scores = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
  let liste_meilleurs_films = []
  next =""

  // récupération des films par scores décroissants
  try {
    // les 5 premiers
    response = await fetch(url_best_imdb_scores);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    json_scores = await response.json();
    for (let i=1; i<5; i++) {
      liste_meilleurs_films.push(json_scores.results[i])
    }
    // les 5 suivants
    next_url = json_scores.next
    response = await fetch(next_url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    json_scores_next = await response.json();
    for (let i=0; i<2; i++) {
      liste_meilleurs_films.push(json_scores_next.results[i])
    }

  } catch (error) {
    console.error(error.message);
  }

  // on sélectionne le premier de la liste
  try {
      response = await fetch(base_url + json_scores.results[0].id);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_best = await response.json();
      //console.log(json_best);
    } catch (error) {
      console.error(error.message);
    }
  
  imageUrl = json_best.image_url;
  img = document.createElement('img');
  img.src = imageUrl;
  img.alt = json_best.title;
  const titre = document.createElement('p')
  titre.textContent = json_best.title;
  titre.classList.add("titre");
  const desc = document.createElement('p');
  desc.textContent = json_best.description;
  let button = document.createElement('button');
  button.textContent = "Détails";
  button.id = json_best.id;
  button.addEventListener("click", function (e) {});

  let modal = document.getElementById("fiche_film");
  let span = document.getElementsByClassName("close")[0];
  // cliquer sur le bouton affiche la fenetre
  button.onclick = function() {
    modal.style.display = "block";
    getFilmInfos(button.id);
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // Ajout des éléments
  const img_container = document.getElementById('meilleur-film');
  img_container.innerHTML = ''; // vide le conteneur
  img_container.appendChild(img);
  let div = document.createElement('div');
  div.appendChild(titre);
  div.appendChild(desc);
  div.appendChild(button);
  img_container.appendChild(div);
  img_container.classList.add("cadre-noir");
  
  // on sélectionne les 6 suivants
  const img_containers = document.getElementById('meilleurs-films');
  for (let i=0; i<6; i++){
    try {
      response = await fetch(base_url + liste_meilleurs_films[i].id);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json = await response.json();
      // Ajout des éléments
      imageUrl = json.image_url;
      img = document.createElement('img');
      img.src = imageUrl;
      img.alt = json.title;
      let text = document.createElement('p');
      text.textContent = json.title;
      let button = document.createElement('button')
      button.textContent = "Détails";
      button.id = json.id;
      button.addEventListener("click", function (e) {});

      let modal = document.getElementById("fiche_film");
      let span = document.getElementsByClassName("close")[0];
      // cliquer sur le bouton affiche la fenetre
      button.onclick = function() {
        modal.style.display = "block";
        getFilmInfos(button.id);
      }
      // un click sur le <span> (x) la cache
      span.onclick = function() {
        modal.style.display = "none";
      }

      let div = document.createElement('div');
      div.appendChild(img);
      div.appendChild(text);
      div.appendChild(button);
      if (i<2) {
        div.classList.add("display-1-2");
      }
      if (i>1 && i<4) {
        div.classList.add("display-3-4");
      }
      if(i>3) {
        div.classList.add("display-5-6");
      }
      img_containers.appendChild(div);
    } catch (error) {
      console.error(error.message);
    }
  }
  manage_plus_buttons();
}


function manage_plus_buttons() {
  for (let i=0; i<4; i++) {
    let button_plus = document.getElementById(boutons_plus_ids[i]);
    button_plus.addEventListener("click", function (e) {});
    button_plus.onclick = function() {
      let meilleurs_films = document.getElementById(divs_ids[i]);
      if (button_plus.textContent == "Voir plus") {
        let divs34 = meilleurs_films.getElementsByClassName("display-3-4");
        if (divs34.length > 0) {
          divs34.item(0).classList.add("display-1-2");
          divs34.item(1).classList.add("display-1-2");  
          divs34.item(0).classList.remove("display-3-4");
          divs34.item(0).classList.remove("display-3-4");
        }
        let divs56 = meilleurs_films.getElementsByClassName("display-5-6");
        if (divs56.length > 0) {
          divs56.item(0).classList.add("display-1-2");
          divs56.item(1).classList.add("display-1-2");  
          divs56.item(0).classList.remove("display-5-6");
          divs56.item(0).classList.remove("display-5-6");
        }
        button_plus.textContent = "Voir moins";
      }
    }
  }
}

async function getFilmsGenre(genre_choisi) {
  let genres = [genres_fixes[0], genres_fixes[1], genre_choisi];
  let ids = ["genre1", "genre2", "genre_choisi"]
  let url_genre = ""; 
  let liste_films = []

  for (let boucle=0; boucle<3; boucle++) {
    liste_films = []
    url_genre = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre="+genres[boucle]+"&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
    
    // récupération des films par scores décroissants
    try {
      // les 5 premiers
      response = await fetch(url_genre);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_genre = await response.json();
      for (let i=0; i<5; i++) {
        liste_films.push(json_genre.results[i])
      }
      // le 6eme
      next_url = json_genre.next
      response = await fetch(next_url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_genre_next = await response.json();
      liste_films.push(json_genre_next.results[0]);

    } catch (error) {
      console.error(error.message);
    }

    // on affiche les films
    const img_containers = document.getElementById(ids[boucle]);
    // si genre présélectionné : mise à jour du label du genre
    if (boucle < 2) {
      const texte_genre = document.getElementById("texte_genre"+(boucle+1));
      texte_genre.innerHTML =''
      texte_genre.classList.add("h2")
      texte_genre.textContent = genres[boucle]
    }
    
    for (let i=0; i<6; i++){
      try {
        response = await fetch(base_url + liste_films[i].id);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        json_genre = await response.json();

        // Ajout des éléments
        const imageUrl = json_genre.image_url;
        let img = document.createElement('img');
        img.src = imageUrl;
        img.alt = json_genre.title
        let text = document.createElement('p');
        let button = document.createElement('button')
        button.textContent = "Détails";
        button.id = json_genre.id;
        button.addEventListener("click", function (e) {});

        let modal = document.getElementById("fiche_film");
        let span = document.getElementsByClassName("close")[0];
        // cliquer sur le bouton affiche la fenetre modale
        button.onclick = function() {
          modal.style.display = "block";
          getFilmInfos(button.id);
        }
        // un click sur le <span> (x) ferme la cache
        span.onclick = function() {
          modal.style.display = "none";
        }
          
        text.textContent = json_genre.title;
        let div = document.createElement('div');
        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(button);
        // cache les films selon l'affichage
        if (i<2) {
          div.classList.add("display-1-2");
        }
        if (i>1 && i<4) {
          div.classList.add("display-3-4");
        }
        if(i>3) {
          div.classList.add("display-5-6");
        }
        img_containers.appendChild(div);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  // menu déroulant
  let menu = document.getElementById('menu-choix-genre');
  for (let g=0; g<liste_genres.length; g++){
    let item = document.createElement('option');
    item.value = liste_genres[g];
    item.textContent = liste_genres[g];
    menu.appendChild(item);
  }
  document.getElementById('menu-choix-genre').addEventListener('change', function() {
    console.log('Genre: ', this.value);
    getFilmsGenreChoisi(this.value);
  });
}


async function getFilmsGenreChoisi(genre_choisi) {
  let base_url = "http://localhost:8000/api/v1/titles/";
  liste_films = []
  url_genre = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre="+genre_choisi+"&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
  // récupération des films par scores décroissants
  try {
    // les 5 premiers
    response = await fetch(url_genre);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    json_genre = await response.json();
    for (let i=0; i<5; i++) {
      liste_films.push(json_genre.results[i])
    }
    // le 6eme
    next_url = json_genre.next
    response = await fetch(next_url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    json_genre_next = await response.json();
    liste_films.push(json_genre_next.results[0])
  } catch (error) {
    console.error(error.message);
  }

  // on affiche les films
  const img_containers = document.getElementById("genre_choisi");
  img_containers.innerHTML=''
  for (let i=0; i<6; i++){
    try {
      response = await fetch(base_url + liste_films[i].id);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_genre = await response.json();
      // Ajout des éléments
      const imageUrl = json_genre.image_url;
      let img = document.createElement('img');
      img.src = imageUrl;
      img.alt = json_genre.title
      let text = document.createElement('p');
      let button = document.createElement('button')
      button.textContent = "Détails";
      button.id = json_genre.id;
      button.addEventListener("click", function (e) {});

      let modal = document.getElementById("fiche_film");
      let span = document.getElementsByClassName("close")[0];
      // cliquer sur le bouton affiche la fenetre modale
      button.onclick = function() {
        modal.style.display = "block";
        getFilmInfos(button.id);
      }
      // un click sur le <span> (x) ferme la modale
      span.onclick = function() {
        modal.style.display = "none";
      }

      text.textContent = json_genre.title;
      let div = document.createElement('div');
      div.appendChild(img)
      div.appendChild(text);
      div.appendChild(button);
      img_containers.appendChild(div);
    } catch (error) {
      console.error(error.message);
    }
  }
}


async function getFilmInfos(id) {
  let url = "http://localhost:8000/api/v1/titles/"+id;
  response = await fetch(url);
  try {
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    json_film = await response.json();
    let img = document.getElementById('img_modale');
    img.src = json_film.image_url;
    let titre = document.getElementById("titre_modale");
    titre.textContent = json_film.title;
    let annee_genres = document.getElementById("date_genres_modale");
    annee_genres.textContent = json_film.year + " - " + json_film.genres;
    let classification_duree = document.getElementById("classification_duree_pays");
    classification_duree.textContent = json_film.rated + " - " + json_film.duration + " minutes" + " (" + json_film.countries + ")";
    let imdb_score = document.getElementById("score_imdb_recettes");
    imdb_score.textContent = "Score imdb: " + json_film.imdb_score + "/10 - " + "Recettes mondiales: " + json_film.worldwide_gross_income + "$";
    let realisateur = document.getElementById("realisateur");
    realisateur.textContent = "Réalisé par : " + json_film.directors;
    let desc = document.getElementById("desc_modale");
    desc.textContent = json_film.description;
    let acteurs = document.getElementById("acteurs");
    acteurs.textContent = "Avec : " + json_film.actors;
  } catch (error) {
    console.error(error.message);
  }
}


async function getListeGenres() {
  let urls = ["http://localhost:8000/api/v1/genres", "http://localhost:8000/api/v1/genres/?page=2",
    "http://localhost:8000/api/v1/genres/?page=3", "http://localhost:8000/api/v1/genres/?page=4",
    "http://localhost:8000/api/v1/genres/?page=5"
  ];
  
  for (let i=0; i<urls.length; i++){
    response = await fetch(urls[i]);
    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_genres = await response.json();
      for (let j=0; j<5; j++){
        if (json_genres.results[j].name != genres_fixes[0] && json_genres.results[j].name != genres_fixes[1])
        liste_genres.push(json_genres.results[j].name);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
}


getListeGenres();
getMeilleursFilms();
getFilmsGenre("Horror");


