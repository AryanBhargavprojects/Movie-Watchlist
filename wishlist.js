const movieListContainer = document.querySelector('.movie-list');
const stateEmpty = document.querySelector('.state-empty-watchlist');
const statePopulated = document.querySelector('.state-populated-watchlist');

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];

    if (watchlist.length === 0) {
        stateEmpty.classList.add('active');
        statePopulated.classList.remove('active');
    } else {
        stateEmpty.classList.remove('active');
        statePopulated.classList.add('active');

        movieListContainer.innerHTML = '';

        watchlist.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            movieCard.innerHTML = `
                <div class="movie-poster">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                </div>
                <div class="movie-info">
                    <div class="movie-header">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <span class="movie-rating">
                            <svg xmlns="http://www.w3.org/2000/svg" class="star-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            ${movie.imdbRating}
                        </span>
                    </div>
                    <div class="movie-meta">
                        <span class="movie-runtime">${movie.Runtime}</span>
                        <span class="movie-genre">${movie.Genre}</span>
                        <button class="remove-btn" onclick="removeFromWatchlist('${movie.imdbID}')">
                            <svg xmlns="http://www.w3.org/2000/svg" class="minus-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                            Remove
                        </button>
                    </div>
                    <p class="movie-plot">
                        ${movie.Plot}
                    </p>
                </div>
            `;
            movieListContainer.appendChild(movieCard);
        });
    }
}

function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
    renderWatchlist();
}

// Initial Render
renderWatchlist();
