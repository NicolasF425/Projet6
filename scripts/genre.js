async function getFilmsGenre(genre_choisi) {
  let base_url = "http://localhost:8000/api/v1/titles/";
  let genres = ["Mystery", "Drama", genre_choisi];
  const ids = ["genre1", "genre2", "genre_choisi"]
  let url_genre = ""; 
  let liste_films = []
  let next =""

  for (let boucle=0; boucle<3; boucle++) {
    liste_films = []
    url_genre = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre="+genres[boucle]+"&genre_contains=&sort_by=&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
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
      //console.log(liste_films)

    } catch (error) {
      console.error(error.message);
    }

    // on affiche les films
    const img_containers = document.getElementById(ids[boucle]);
    for (let i=0; i<6; i++){
      try {
        response = await fetch(base_url + liste_films[i].id);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        json_genre = await response.json();
        //console.log(json_genre);
        // Ajout des éléments
        const imageUrl = json_genre.image_url;
        let img = document.createElement('img');
        img.src = imageUrl;
        img.alt = json_genre.title
        let div = document.createElement('div');
        let text = document.createElement('p');
        let button = document.createElement('button')
        button.textContent = "Détails";
        button.id = json_genre.id;
        button.addEventListener("click", function (e) {
          let base_url = "http://localhost:8000/api/v1/titles/";
          let url = base_url + button.id;
          console.log(url);
        });
        text.textContent = json_genre.title;
        div.style.backgroundImage = imageUrl;
        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(button);
        img_containers.appendChild(div)
      } catch (error) {
        console.error(error.message);
      }
    }
  }
}

getFilmsGenre("Horror");


