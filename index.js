const API_KEY = 'e72853f';
const BASE_URL = 'http://www.omdbapi.com/';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieListContainer = document.querySelector('.movie-list');

const stateInitial = document.querySelector('.state-initial');
const statePopulated = document.querySelector('.state-populated');
const stateNoData = document.querySelector('.state-no-data');

function showState(state) {
    // Hide all states
    stateInitial.classList.remove('active');
    statePopulated.classList.remove('active');
    stateNoData.classList.remove('active');

    // Show requested state
    if (state === 'initial') stateInitial.classList.add('active');
    if (state === 'populated') statePopulated.classList.add('active');
    if (state === 'no-data') stateNoData.classList.add('active');
}

let currentMovies = [];

async function fetchMovieData(query) {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
        const data = await response.json();

        if (data.Response === 'False') {
            showState('no-data');
            return;
        }

        // Get top 3 results to avoid hitting rate limits too hard and keep UI clean
        const movies = data.Search.slice(0, 5);
        const detailedMovies = [];

        for (const movie of movies) {
            const detailResponse = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`);
            const detailData = await detailResponse.json();
            detailedMovies.push(detailData);
        }

        currentMovies = detailedMovies; // Store for watchlist functionality
        renderMovies(detailedMovies);
        showState('populated');

    } catch (error) {
        console.error('Error fetching data:', error);
        showState('no-data');
    }
}

function renderMovies(movies) {
    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
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
                    <button class="watchlist-btn" onclick="addToWatchlist('${movie.imdbID}')" id="btn-${movie.imdbID}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Watchlist
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

function addToWatchlist(imdbID) {
    const movieToAdd = currentMovies.find(movie => movie.imdbID === imdbID);

    if (movieToAdd) {
        let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];

        // Check if already in watchlist
        if (!watchlist.some(movie => movie.imdbID === imdbID)) {
            watchlist.push(movieToAdd);
            localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
            console.log(`Added ${movieToAdd.Title} to watchlist`);

            // Visual feedback
            const btn = document.getElementById(`btn-${imdbID}`);
            if (btn) {
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="plus-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Added
                `;
                btn.disabled = true;
                btn.style.opacity = '0.7';
            }
        } else {
            console.log('Movie already in watchlist');
        }
    }
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovieData(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovieData(query);
        }
    }
});

// Random Search on Load
const RANDOM_SEARCH_TERMS = [
    "Space", "Ocean", "Future", "Magic", "Hero",
    "Dream", "Love", "Time", "Robot", "Forest",
    "Adventure", "Mystery", "Legend", "King", "Queen",
    "Star", "Moon", "Sun", "Dark", "Light"
];

function loadRandomMovies() {
    const randomIndex = Math.floor(Math.random() * RANDOM_SEARCH_TERMS.length);
    const randomTerm = RANDOM_SEARCH_TERMS[randomIndex];
    console.log(`Loading random movies for: ${randomTerm}`);
    fetchMovieData(randomTerm);
}

// Initialize
loadRandomMovies();
