const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderItems = document.querySelectorAll('.slider-item');
const leftButton = document.querySelector('.slider-btn.left');
const rightButton = document.querySelector('.slider-btn.right');

let currentIndex = 0;

function updateSliderPosition() {
    const offset = -currentIndex * 100;
    sliderWrapper.style.transform = `translateX(${offset}%)`;
}

leftButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = sliderItems.length - 1; 
    }
    updateSliderPosition();
});

rightButton.addEventListener('click', () => {
    if (currentIndex < sliderItems.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; 
    }
    updateSliderPosition();
});




document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.film-grid')) {
        handleLoadMore();
        handleFilmBoxClick();
    }
    
    if (document.querySelector('.film-details')) {
        displayFilmDetails();
    }
});

function handleLoadMore() {
    let currIndex = 0;
    const itemsPerPage = 6;

    document.querySelector('.load-more-btn').addEventListener('click', async () => {
        const url = 'https://api.tvmaze.com/shows';

        try {
            const response = await fetch(url);
            const shows = await response.json();

            const nextShows = shows.slice(currIndex, currIndex + itemsPerPage);

            nextShows.forEach((show, index) => {
                const filmBoxHTML = `
                    <div class="film-box" data-id="${show.id}">
                        <img src="${show.image.medium}" alt="${show.name}">
                        <h3>${show.name}</h3>
                        <p>${show.language}</p>
                        <p><i class="fas fa-star"></i> ${show.rating.average}</p>
                        <span class="genre">${show.genres.join(', ')}</span>
                    </div>
                `;
                setTimeout(() => {
                    document.querySelector('.film-grid').insertAdjacentHTML('beforeend', filmBoxHTML);
                }, index * 200);  
            });

            currIndex += itemsPerPage;

            if (currIndex >= shows.length) {
                document.querySelector('.load-more-btn').style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
        }
    });
}

function handleFilmBoxClick() {
    document.addEventListener('click', (event) => {
        const filmBox = event.target.closest('.film-box');
        if (filmBox) {
            const filmId = filmBox.getAttribute('data-id');
            localStorage.setItem('selectedFilmId', filmId);
            window.location.href = 'detail.html'; 
        }
    });
}

async function displayFilmDetails() {
    const filmId = localStorage.getItem('selectedFilmId');
    if (filmId) {
        const url = `https://api.tvmaze.com/shows/${filmId}`;
        try {
            const response = await fetch(url);
            const film = await response.json();

            const imgElement = document.getElementById('film-img');
            const titleElement = document.getElementById('film-title');
            const ratingElement = document.getElementById('film-rating');
            const genresElement = document.getElementById('film-genres');
            const summaryElement = document.getElementById('film-summary');

            if (imgElement && titleElement && ratingElement && genresElement && summaryElement) {
                imgElement.src = film.image.original;
                titleElement.textContent = film.name;
                ratingElement.textContent = film.rating.average;
                genresElement.textContent = film.genres.join(', ');
                summaryElement.innerHTML = film.summary;
            } else {
                console.error('Detail page elements not found.');
            }

            
        } 
        catch (error) {
            console.error('Error fetching film details:', error);
        }
    } 
    else {
        console.error('No film ID found in localStorage.');
    }
}








const searchInput = document.querySelector('.search-container input');
let allShows = []; 

async function fetchShows() {
    const url = 'https://api.tvmaze.com/shows';
    
    try {
        const response = await fetch(url);
        allShows = await response.json();
        displayShows(allShows); 
    } catch (error) {
        console.error('Error fetching shows:', error);
    }
}

function displayShows(shows) {
    const filmGrid = document.querySelector('.film-grid');
    filmGrid.innerHTML = ''; 

    shows.forEach((show) => {
        const filmBoxHTML = `
            <div class="film-box">
                <img src="${show.image.medium}" alt="${show.name}">
                <h3>${show.name}</h3>
                <p>${show.language}</p>
                <p><i class="fas fa-star"></i> ${show.rating.average}</p>
                <span class="genre">${show.genres.join(', ')}</span>
            </div>
        `;
        filmGrid.insertAdjacentHTML('beforeend', filmBoxHTML);
    });
}

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();

    const filteredShows = allShows.filter(show => 
        show.name.toLowerCase().includes(searchValue)
    );

    const sortedShows = filteredShows.concat(allShows.filter(show => 
        !show.name.toLowerCase().includes(searchValue)
    ));

    displayShows(sortedShows);
});

fetchShows();



