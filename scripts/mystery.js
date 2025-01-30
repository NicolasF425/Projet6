
async function getData() {
    let base_url = "http://localhost:8000/api/v1/titles/"
    let genre = "Mystery"
    let url = base_url + "?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre="+genre+"&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
    let next = "";
    let liste_id = []
    let liste_films = []

    // récupération de 6 id des films du genre Mystery
    try {
      response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      json = await response.json();
      console.log(json);

      for (let i=0; i<5; i++) {
        liste_id.push(json.results[i].id)
      }

      next = json.next;
      next_response = await fetch(next);
      if (!next_response.ok) {
        throw new Error(`Response status: ${next_response.status}`);
      }
  
      next_json = await next_response.json();
      console.log(json);

      liste_id.push(json.results[0].id)
      console.log(liste_id)

    } catch (error) {
      console.error(error.message);
    }

    // recupération des détails des films
    for (let i=0; i< liste_id.length; i++) {
      url = base_url + liste_id[i]
      try {
        response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        json_film = await response.json();
        liste_films.push(json_film)
      } catch (error) {
        console.error(error.message);
      }
    }
    console.log(liste_films)
}

getData();

