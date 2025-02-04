
async function getMeilleursFilms() {
    let base_url = "http://localhost:8000/api/v1/titles/"
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
      console.log(liste_meilleurs_films)

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
        console.log(json_best);
      } catch (error) {
        console.error(error.message);
      }
    
    imageUrl = json_best.image_url;
    img = document.createElement('img');
    img.src = imageUrl;
    img.alt = json_best.title;
    const titre = document.createElement('p')
    titre.textContent = json_best.title;
    const desc = document.createElement('p');
    desc.textContent = json_best.description;
    let button = document.createElement('button')
    button.textContent = "Détails";
    button.id = json_best.id;
    button.addEventListener("click", function (e) {
      let base_url = "http://localhost:8000/api/v1/titles/";
      let url = base_url + button.id;
      console.log(url);
    });

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
        console.log(json);
        // Ajout des éléments
        imageUrl = json.image_url;
        img = document.createElement('img');
        img.src = imageUrl;
        img.alt = json.title;
        let text = document.createElement('p');
        text.textContent = json_genre.title;
        let button = document.createElement('button')
        button.textContent = "Détails";
        button.id = json.id;
        button.addEventListener("click", function (e) {
          let base_url = "http://localhost:8000/api/v1/titles/";
          let url = base_url + button.id;
          console.log(url);
        });

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

        let div = document.createElement('div');
        div.appendChild(img);
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
    let titre = document.getElementById("titre_modale");
    titre.textContent = json_film.title;
    let desc = document.getElementById("desc_modale");
    desc.textContent = json_film.description;
    let img = document.getElementById('img_modale');
    img.src = json_film.image_url;
  } catch (error) {
    console.error(error.message);
  }
}

getMeilleursFilms();