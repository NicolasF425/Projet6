async function getFilmsGenre(genre_choisi) {
  let base_url = "http://localhost:8000/api/v1/titles/";
  let genres = ["Mystery", "Drama", genre_choisi];
  let ids = ["genre1", "genre2", "genre_choisi"]
  let url_genre = ""; 
  let liste_films = []

  let tous_genres = await getListeGenres();

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
        // cliquer sur le bouton affiche la fenetre
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

  }

  // menu déroulant
  let menu = document.getElementById('menu-choix-genre');
  for (let g=0; g<tous_genres.length; g++){
    let item = document.createElement('option');
    item.value = tous_genres[g];
    item.textContent = tous_genres[g];
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
  url_genre = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre="+genre_choisi+"&genre_contains=&sort_by=&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
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

async function getListeGenres() {
  let urls = ["http://localhost:8000/api/v1/genres", "http://localhost:8000/api/v1/genres/?page=2",
    "http://localhost:8000/api/v1/genres/?page=3", "http://localhost:8000/api/v1/genres/?page=4",
    "http://localhost:8000/api/v1/genres/?page=5"
  ];
  let liste_genres = [];

  for (let i=0; i<urls.length; i++){
    response = await fetch(urls[i]);
    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      json_genres = await response.json();
      for (let j=0; j<5; j++){
        liste_genres.push(json_genres.results[j].name);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  return liste_genres;
}


getFilmsGenre("Horror");


