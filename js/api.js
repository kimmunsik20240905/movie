//영화 데이터 가져오기
const apiKey = 'ea87e661ad52a6a306bf5ad20bda2711'; 

const fetchData = async () => {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko&page=1&region=KR`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        const data = await response.json();
        displayMovies(data.results); 
    } catch (error) {
        console.error('오류 메세지: ', error);
    }
};
fetchData();

//영화 상세정보 가져오기
const fetchMovieDetails = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('오류 메세지: ', error);
    }
};

//영화 감독정보 가져오기
const fetchMovieCredits = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('오류 메세지: ', error);
    }
};

//영화 검색정보 가져오기 
async function movieSearch(term) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ko&query=${encodeURIComponent(term)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('오류 메세지: ', error);
    }
}

