import axios from 'axios';


async function fetchImages(name, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const key = '34851950-1466f977010869c95ad46e51d';

  try {
    const response = await axios.get(
      `${BASE_URL}?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export { fetchImages };