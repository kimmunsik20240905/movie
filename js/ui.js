//영화 카드 디폴트 생성하기
const moviesContainer = document.getElementById('movieContainer');

const displayMovies = (movies) => {
    moviesContainer.innerHTML = ''; 
    if(movies.length === 0){
        const movieElement = document.createElement('div'); 
        movieElement.classList.add('movie'); 
        movieElement.textContent = '데이터가 존재하지 않습니다.';
        moviesContainer.appendChild(movieElement); 
    }else{
        movies.forEach(movie => {
            const movieElement = document.createElement('div'); 
            movieElement.classList.add('movie'); 

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('movieimg');
            imageDiv.style.backgroundImage = movie.poster_path === null ? `url('../images/image_sample.png')` : `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
            movieElement.appendChild(imageDiv);
            
            const titleElement = document.createElement('h4');
            titleElement.classList.add('movieTitle');
            titleElement.setAttribute('data-id', movie.id);
            titleElement.textContent = movie.title;

            const overviewElement = document.createElement('p');
            overviewElement.classList.add('overview');
            let overview = movie.overview;
            let updateOverview ='';
            overview === '' ? updateOverview = 'No Information' : updateOverview = movie.overview;
            overviewElement.textContent = updateOverview;

            const voteAverageElement = document.createElement('p');
            voteAverageElement.classList.add('voteAverage');
            voteAverageElement.textContent = `★ ${movie.vote_average.toFixed(1)}`;

            movieElement.appendChild(titleElement);
            movieElement.appendChild(overviewElement);
            movieElement.appendChild(voteAverageElement);

            moviesContainer.appendChild(movieElement); 
        });
    }
};

//영화 상세정보 모달 띄우기
document.addEventListener('DOMContentLoaded', () => {
    moviesContainer.addEventListener('click', async (event) => {
        const movieElement = event.target.closest('.movie'); 
        const movieTitleElement = movieElement.querySelector('.movieTitle');
        
        if (movieTitleElement) {
            const movieId = movieTitleElement.getAttribute('data-id');
            
            const movieDetails = await fetchMovieDetails(movieId);
            
            const movieCredits = await fetchMovieCredits(movieId);
            const director = movieCredits.crew.find(person => person.job === 'Director');
            
            const popElement = document.createElement('div');
            popElement.classList.add('popup');
            popElement.style.display = 'block';

            const popWindowElment = document.createElement('div');
            popWindowElment.classList.add('popup_window');
            popWindowElment.innerHTML = `
                <p class="closeBtn">X</p>
                <div class="popDetailWrap" data-id="${movieId}">
                    <img src="${!movieDetails.poster_path ? '../images/image_sample.png': 'https://image.tmdb.org/t/p/w500'+movieDetails.poster_path}" alt="${movieDetails.title}">
                    <div class="detailTxtWrap">
                        <h1>
                            ${movieDetails.title}
                            <i class="fa-regular fa-bookmark bookmarkOff" alt="북마크 전"></i>
                            <i class="fa-solid fa-bookmark bookmarkOn" alt="북마크 후"></i>
                        </h1>
                        <p><b>감독</b> : ${director ? director.name : 'No Information'}</p>
                        <p><b>개봉일</b> : ${movieDetails.release_date ? movieDetails.release_date : 'No Information'}</p>
                        <p><b>줄거리</b> : ${movieDetails.overview ? movieDetails.overview : 'No Information'}</p>
                    </div>
                </div>
            `;

            popElement.appendChild(popWindowElment);
            document.body.appendChild(popElement);
            document.body.style.overflow = 'hidden';

            const closeBtn = popWindowElment.querySelector('.closeBtn');
            closeBtn.addEventListener('click', ()=>{
                popElement.style.display = 'none';
                document.body.removeChild(popElement);
                document.body.style.overflow = 'auto';
            });

            //영화 북마크 설정 온/오프하기 
            const bookmarkOn = popWindowElment.querySelector('.bookmarkOn');
            const bookmarkOff = popWindowElment.querySelector('.bookmarkOff');
            
            const storedMovies = localStorage.getItem('bookmarkMovies');
            let bookmarkMovies
                if(!storedMovies){
                    bookmarkMovies = [];
                }else{
                    bookmarkMovies = JSON.parse(storedMovies);
                }

                if(bookmarkMovies.includes(movieId)){
                    bookmarkOn.style.display = 'inline';
                    bookmarkOff.style.display = 'none';
                }else{
                    bookmarkOn.style.display = 'none';
                    bookmarkOff.style.display = 'inline';
                }

            //영화 북마크 설정 온하기
            bookmarkOff.addEventListener('click', () => {
                function bookmarkOnMovie(movieId) {
                    if (!bookmarkMovies.includes(movieId)) {
                        bookmarkMovies.push(movieId);
                        localStorage.setItem('bookmarkMovies', JSON.stringify(bookmarkMovies));
                    }
                }
                bookmarkOnMovie(movieId);   
                bookmarkOn.style.display = 'inline';
                bookmarkOff.style.display = 'none';
            });

            //영화 북마크 설정 오프하기
            bookmarkOn.addEventListener('click', () => {
                function bookmarkOffMovie(movieId) {
                    if (bookmarkMovies.includes(movieId)) {
                        const updatedMovies = bookmarkMovies.filter(id => id !== movieId);
                        localStorage.setItem('bookmarkMovies', JSON.stringify(updatedMovies));
                    }
                }
                bookmarkOffMovie(movieId);   
                bookmarkOn.style.display = 'none';
                bookmarkOff.style.display = 'inline';
            });
        }
    });
});

//영화 검색정보 입력하기 
const inputField = document.getElementById('searchMoive');
let debounceTime;

inputField.addEventListener('input', async (event) => {
    const searchTxt = event.target.value;
    clearTimeout(debounceTime);

    debounceTime = setTimeout(async() => {
        if (searchTxt) {
            const data = await movieSearch(searchTxt);
            const matchingMovies = data.results.filter(movie =>
                movie.title.toLowerCase().includes(searchTxt.toLowerCase())
            );
            displayMovies(matchingMovies);  
        }else{
            fetchData();
        }
    }, 700);
});

//북마크 리스트 가져오기
const bookmark = document.querySelector('.bookmark');
bookmark.addEventListener('click', async() =>{
    document.getElementById('searchMoive').value = '';
    const storedMovies = JSON.parse(localStorage.getItem('bookmarkMovies'));
    let moviesArr = [];
    for (const movieId of storedMovies) {
        let movies = await fetchMovieDetails(movieId);
        moviesArr.push(movies);
    }
    displayMovies(moviesArr);
})

//로고 클릭시 데이터 가져오기
const home = document.querySelector('.home');
home.addEventListener('click', async() =>{
    document.getElementById('searchMoive').value = '';
    fetchData();
})
