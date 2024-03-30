import { renderPictures, setImgFilter } from './thumbnails.js';
import { openPictureModal } from './big-picture.js';
import { openForm } from './upload-form/form.js';
import { getData } from './api.js';
import { debounce, showAlert } from './util.js';

const pictureList = document.querySelector('.pictures');
const uploadInput = document.querySelector('.img-upload__input');
const filtersElement = document.querySelector('.img-filters');

let photos = [];

const onFilterClick = (evt) => {
  if (evt.target.matches('button')){
    filtersElement.querySelectorAll('button').forEach((element) => {
      element.classList.remove('img-filters__button--active');
    });
    // eslint-disable-next-line no-console
    debounce(() => console.log('debounce'));
    setImgFilter(evt.target, photos);
  }
};

// Отрисовка миниатюр
getData()
  .then((elements) => {
    photos = elements;
    renderPictures(photos);
    filtersElement.classList.remove('img-filters--inactive');
    filtersElement.addEventListener('click', onFilterClick);
  })
  .catch(
    () => showAlert()
  );

const onPictureClick = (evt) => {
  const selectedPicture = evt.target.closest('a');
  if (selectedPicture){
    const currentElement = photos.find((photo) => (photo.id === +selectedPicture.dataset.id));
    openPictureModal(currentElement);
  }
};

pictureList.addEventListener('click', onPictureClick);

const onUploadImage = () => {
  openForm();
};

uploadInput.addEventListener('change', onUploadImage);
