import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

import { fetchImages } from './fetchImages';

const searchQuery = document.querySelector('input[name="searchQuery"]');
const closeBtn = document.querySelector('.close-btn');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let perPage = 40;
let page = 0;
let name = searchQuery.value;

loadBtn.style.display = 'none';
closeBtn.style.display = 'none';

function onSearch(e) {
	e.preventDefault();
	gallery.innerHTML = '';
	loadBtn.style.display = 'none';

	page = 1;
	name = searchQuery.value;

if (name === '') {
	Notiflix.Notify.failure(
      'Please specify your search query.',
    );
    return;
};


fetchImages(name, page, perPage)
.then(name => {
  let totalPages = name.totalHits / perPage;

  if (name.hits.length > 0) {
	 Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
	 renderGallery(name);
	 new SimpleLightbox('.gallery a').refresh();
	 closeBtn.style.display = 'block';
	 closeBtn.addEventListener('click', () => {
		gallery.innerHTML = '';
		closeBtn.style.display = 'none';
	 });

	 if (page < totalPages) {
		loadBtn.style.display = 'block';
	 } else {
		loadBtn.style.display = 'none';
		Notiflix.Notify.info(
		  "We're sorry, but you've reached the end of search results."
		);
	 }
  } else {
	 Notiflix.Notify.failure(
		'Sorry, there are no images matching your search query. Please try again.'
	 );
	 gallery.innerHTML = '';
  }
})
.catch(error => console.log(error));
}

searchForm.addEventListener('submit', onSearch);


function renderGallery(name) {
	const markup = name.hits
	  .map(hit => {
		 return `<div class="photo-card">
			<a class="gallery-item" href="${hit.largeImageURL}">
			  <img
				 class="gallery__image"
				 src="${hit.webformatURL}"
				 alt="${hit.tags}"
				 loading="lazy"
			/></a>
			<div class="info">
			  <div class="info__box">
				 <p class="info-item">
					<b class="material-symbols-outlined">Likes</b>
				 </p>
				 <p class="info-counter">${hit.likes.toLocaleString()}</p>
			  </div>
			  <div class="info__box">
				 <p class="info-item">
					<b class="material-symbols-outlined">Views</b>
				 </p>
				 <p class="info-counter">${hit.views.toLocaleString()}</p>
			  </div>
			  <div class="info__box">
				 <p class="info-item">
					<b class="material-symbols-outlined">Comments</b>
				 </p>
				 <p class="info-counter">${hit.comments.toLocaleString()}</p>
			  </div>
			  <div class="info__box">
				 <p class="info-item">
					<b class="material-symbols-outlined">Downloads</b>
				 </p>
				 <p class="info-counter">${hit.downloads.toLocaleString()}</p>
			  </div>
			</div>
		 </div>`;
	  })
	  .join('');
	gallery.insertAdjacentHTML('beforeend', markup);

	const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
 };
 
 loadBtn.addEventListener(
	'click',
	() => {
	  name = searchQuery.value;
	  page += 1;
	  fetchImages(name, page, perPage).then(name => {
		 let totalPages = name.totalHits / perPage;
		 renderGallery(name);
		 new SimpleLightbox('.gallery a').refresh();
		 if (page >= totalPages) {
			loadBtn.style.display = 'none';
			Notiflix.Notify.info(
			  "We're sorry, but you've reached the end of search results."
			);
		 }
	  });
	},
	true
 );