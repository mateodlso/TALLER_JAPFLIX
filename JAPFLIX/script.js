const url = 'https://japceibal.github.io/japflix_api/movies-data.json';
let movies = [];

// para obtener las películas del servidor cuando la página cargue
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(url);
    movies = await response.json();
  } catch (error) {
    console.error("Error al cargar las películas", error);
  }
});

//para filtrar las pelis segun la busqueda
document.getElementById('btnBuscar').addEventListener('click', () => {
    const searchTerm = document.getElementById('inputBuscar').value.toLowerCase();
    const filteredMovies = movies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genres.join(', ').toLowerCase().includes(searchTerm) ||
      (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
      (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
    );
    
    displayMovies(filteredMovies);
  });

  //para crear las listas de las pelis dinamicamente
  function displayMovies(movies) {
    const movieList = document.getElementById('lista');
    movieList.innerHTML = '';  // Limpiar la lista anterior
    
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'bg-dark', 'text-white');
      
      // Título de la película
      const title = document.createElement('h5');
      title.textContent = movie.title;
      
      // Tagline de la película
      const tagline = document.createElement('p');
      tagline.textContent = movie.tagline;
      
      // Crear las estrellas de 'vote_average'
      const stars = createStars(movie.vote_average);
      
      // Botón para desplegar más información
      listItem.appendChild(title);
      listItem.appendChild(tagline);
      listItem.appendChild(stars);
      
      // Evento para cuando se selecciona una película
      listItem.addEventListener('click', () => displayMovieDetails(movie));
      
      movieList.appendChild(listItem);
    });
  }
  
  function createStars(vote_average) {
    const stars = document.createElement('div');
    const fullStars = Math.floor(vote_average / 2);
    
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = 'fa fa-star';
      if (i < fullStars) {
        star.classList.add('checked');
      }
      stars.appendChild(star);
    }
    
    return stars;
  }
  
//mostrar los detalles de la peli seleccionada
function displayMovieDetails(movie) {
    const offcanvasElement = document.getElementById('movieDetailsCanvas');
    const movieDetailsContent = document.getElementById('movieDetailsContent');

    // Título
    const title = `<h2>${movie.title}</h2>`;
    
    // Descripción
    const overview = `<p>${movie.overview}</p>`;
    
    // Géneros
    const genres = `<p>Géneros: ${movie.genres.join(', ')}</p>`;
    
    // Dropdown con más información
    const moreDetails = `
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        Más detalles
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>Año: ${movie.release_date.split('-')[0]}</li>
        <li>Duración: ${movie.runtime} minutos</li>
        <li>Presupuesto: $${movie.budget}</li>
        <li>Ganancias: $${movie.revenue}</li>
      </ul>
    `;

    // Insertar el contenido en el contenedor del `offcanvas`
    movieDetailsContent.innerHTML = title + overview + genres + moreDetails;
    
    // Mostrar el `offcanvas`
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
    bsOffcanvas.show();
}
  