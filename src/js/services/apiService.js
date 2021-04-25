// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '21268272-c5791a68db62a23d91af73a0c';


export default {

    async fetchPhoto(page = 1, query) {
        const rawResult = await fetch(`${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&page=${page}&per_page=12`);
                
        if (!rawResult.ok) {
            throw rawResult
        }

        const result = await rawResult.json();

        return result
    }
}

