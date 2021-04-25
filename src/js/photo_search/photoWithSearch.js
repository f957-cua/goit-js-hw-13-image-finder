import '../../css/photoGallery.css';
import preloaderFactory from '../preloader';
import photoService from '../services/apiService';
import photoGalleryTemplate from '../templates/photoGallery.hbs';
import debounce from 'lodash.debounce';

import * as basicLightbox from 'basiclightbox';
import '../../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import '../../../node_modules/basiclightbox/src/styles/main.scss';
import '../../../node_modules/basiclightbox/src/scripts/main.js';


import '@pnotify/core/dist/PNotify.css'

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css'
import { alert, error, success, defaultModules } from '@pnotify/core/dist/PNotify.js';

const preloader = preloaderFactory('.preloader');
const searchForm = document.querySelector('.search-form')

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const submit = e.target.elements.query.value;

    gallery.filterByName(submit)
})


class Photos {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.galleryView = [];
        this.page = 0;
        this.currentPhotoList = [];
        this.searchQuery = '';
        this.scrollHeight = '';

    }

    filterByName(name) {

        this.element.innerHTML = '';
        this.page = 1;
        this.searchQuery = name;
        
        this.fetchPhotos(this.page, this.searchQuery);

    }

    addObserver() {
        const observerOptions = {
            rootMargin: '100px'
        }

        const observerHandler = debounce(entries => {
            if (entries[0].isIntersecting) {
                this.page += 1;
                this.scrollHeight = document.body.clientHeight;
                this.fetchPhotos(this.page, this.searchQuery);

            }

            window.scrollTo({
                top: this.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        }, 200);

        const observer = new IntersectionObserver(observerHandler, observerOptions);
        const observerElement = document.createElement('div');

        this.element.insertAdjacentElement('afterend', observerElement);
        observer.observe(observerElement);
    }

    renderPhotos(hits) {
        const renderNewGallery = hits.map(hit => {
            return {
                likes: hit.likes,
                views: hit.views,
                comments: hit.comments,
                downloads: hit.downloads,
                modal_img: hit.largeImageURL,
                img: hit.webformatURL,
        }
        });

        this.currentPhotoList = [...this.currentPhotoList, ...renderNewGallery]
        const photoGallery = photoGalleryTemplate(renderNewGallery);

        this.element.insertAdjacentHTML('beforeend', photoGallery);
    }

    async fetchPhotos(page, query) {
        try {
            const { hits } = await photoService.fetchPhoto(page, query);
            this.galleryView = [...this.galleryView, ...hits]
            this.renderPhotos(hits);
            alert({
                text: `images ${query.toUpperCase()} have find`
            })

        } catch (error) {
            alert({
                text: 'Sorry, error by fetch from API'
            })
            console.log(error);
        } finally {
            preloader.hide();
        }
    }

    init() {
        this.addObserver();
    }

}

const gallery = new Photos('.photo-gallery');
gallery.init();

gallery.element.addEventListener('click', (e) => {
    
    const accurateClick = e.target.classList.contains('img-card');

    if (!accurateClick) {
        console.log('false');
        return;
    }
    const currentImg = e.target.attributes.src.nodeValue;

    gallery.galleryView.find(arr => {
        if (arr.webformatURL === currentImg) {
            const image = arr.largeImageURL;
            openLargeImg(image)
        }
    })
});

function openLargeImg(image) {
    const instance = basicLightbox.create(`<img src="${image}" width="800" height="600">`);

    instance.show();
}