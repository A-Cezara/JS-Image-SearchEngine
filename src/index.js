import axios from "axios";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const API_KEY = '44144688-c01866d86661ec8d15999300c';
const URL = "https://pixabay.com/api/";
const inputData = document.querySelector('input');
const searchButton = document.querySelector('button');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
let currentKeyword = '';
const perPage = 40;

// Function to fetch data from Pixabay
const fetchImages = async (keyword, page) => {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: keyword,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: perPage,
        page: page
      },
    });
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    if (page === 1) {
      gallery.innerHTML = ''; // Clear existing gallery for new search
      if (totalHits === 0) {
        Notiflix.Notify.failure('Sorry, no results found.');
        return;
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    }
    createGallery(images);
    if ((page * perPage) >= totalHits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      window.removeEventListener('scroll', handleScroll);
    }
  } catch (error) {
    console.error('Error fetching data from Pixabay API:', error);
  }
};

// Function to create gallery
function createGallery(images) {
  images.forEach(imageData => {
    const image = document.createElement('img');
    image.src = imageData.webformatURL;
    image.alt = imageData.tags;
    image.loading = "lazy";

    const link = document.createElement('a');
    link.setAttribute('href', imageData.largeImageURL);
    link.appendChild(image);

    const div = document.createElement('div');
    div.classList.add('photo-card');
    div.appendChild(link);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('description');
    descriptionP.textContent = imageData.tags;
    div.appendChild(descriptionP);

    const likesP = document.createElement('p');
    likesP.classList.add('info-item');
    likesP.innerHTML = `<b>Likes:</b> ${imageData.likes}`;
    infoDiv.appendChild(likesP);

    const viewsP = document.createElement('p');
    viewsP.classList.add('info-item');
    viewsP.innerHTML = `<b>Views:</b> ${imageData.views}`;
    infoDiv.appendChild(viewsP);

    const commentsP = document.createElement('p');
    commentsP.classList.add('info-item');
    commentsP.innerHTML = `<b>Comments:</b> ${imageData.comments}`;
    infoDiv.appendChild(commentsP);

    const downloadsP = document.createElement('p');
    downloadsP.classList.add('info-item');
    downloadsP.innerHTML = `<b>Downloads:</b> ${imageData.downloads}`;
    infoDiv.appendChild(downloadsP);

    div.appendChild(infoDiv);
    gallery.appendChild(div);
  });

  // Initialize SimpleLightbox
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  // Smooth scrolling
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

// Event listener for search button click
searchButton.addEventListener('click', event => {
  event.preventDefault();
  currentKeyword = inputData.value.trim();
  if (!currentKeyword) return;
  currentPage = 1;
  fetchImages(currentKeyword, currentPage);
  window.addEventListener('scroll', handleScroll); // Re-add scroll listener for new searches
});

// Infinite scrolling
const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    currentPage += 1;
    fetchImages(currentKeyword, currentPage);
  }
};

window.addEventListener('scroll', handleScroll);


