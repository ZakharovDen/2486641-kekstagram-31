import { isEscapeKey } from './util.js';
import { ValidationErrors, validateDescription, validateHashtagsCount, validateHashtagsFormat, validateHashtagsUnique } from './validation.js';

const Scale = {
  DEFAULT: 100,
  MIN: 25,
  MAX: 100,
  STEP: 25
};
const Effects = {
  none: 'effects__preview--none',
  chrome: 'effects__preview--chrome',
  sepia: 'effects__preview--sepia',
  marvin: 'effects__preview--marvin',
  phobos: 'effects__preview--phobos',
  heat: 'effects__preview--heat',
};
const form = document.querySelector('.img-upload__form');
const hashtags = form.querySelector('.text__hashtags');
const description = form.querySelector('.text__description');
const buttonScaleSmaller = form.querySelector('.scale__control--smaller');
const buttonScaleBigger = form.querySelector('.scale__control--bigger');
const scaleValue = form.querySelector('.scale__control--value');
const imagePreview = form.querySelector('.img-upload__preview img');
const effectList = form.querySelector('.effects__list');

//---------------------------------- Блок валидации ----------------------------------//
const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

pristine.addValidator(hashtags, validateHashtagsFormat, ValidationErrors.HASHTAG_FORMAT);
pristine.addValidator(hashtags, validateHashtagsUnique, ValidationErrors.HASHTAG_UNIQUE);
pristine.addValidator(hashtags, validateHashtagsCount, ValidationErrors.HASHTAG_COUNT);
pristine.addValidator(description, validateDescription, ValidationErrors.COMMENT_LENGTH);
//-------------------------------------------------------------------------------------//

const setPhotoScale = (scale) => {
  imagePreview.style.transform = `scale(${scale / 100})`;
};

const onZoomIn = () => {
  const scale = parseInt(scaleValue.value, 10) + Scale.STEP;
  if (scale <= Scale.MAX){
    scaleValue.value = `${scale}%`;
    setPhotoScale(scale);
  }
};

const onZoomOut = () => {
  const scale = parseInt(scaleValue.value, 10) - Scale.STEP;
  if (scale >= Scale.MIN){
    scaleValue.value = `${scale}%`;
    setPhotoScale(scale);
  }
};


const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if (!evt.target.matches('.text__hashtags') && !evt.target.matches('.text__description')) {
      onCloseForm();
    }
  }
};

const setEffect = (effect) => {
  imagePreview.className = '';
  imagePreview.classList.add(Effects[effect]);
};

const onChangeEffect = (evt) => {
  if (evt.target.matches('input')){
    setEffect(evt.target.value);
  }
};

function onCloseForm() {
  document.removeEventListener('keydown', onDocumentKeydown);
  form.querySelector('.img-upload__overlay').classList.add('hidden');
  document.body.classList.remove('modal-open');
  setPhotoScale(Scale.DEFAULT);
  setEffect('none');
}

const openForm = () => {
  form.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  form.querySelector('.img-upload__cancel').addEventListener('click', onCloseForm);
  form.addEventListener('submit', (evt) => {
    const isValid = pristine.validate();
    if (!isValid) {
      evt.preventDefault();
    }
  });
  buttonScaleSmaller.addEventListener('click', onZoomOut);
  buttonScaleBigger.addEventListener('click', onZoomIn);
  effectList.addEventListener('click', (evt) => onChangeEffect(evt));
};

export {openForm};