import '../style';
import { store } from './util';
import Loader from './loader';
import { Component } from 'preact';
// const url = "https://picsum.photos/400/601?";
const url = "https://source.unsplash.com/collection/139386?"
// const url = "https://thecatapi.com/api/images/get?format=src";

const curentIndexStorageKey = 'current-index';
const imagesListStorageKey = 'image-urls';
const imageCacheName = "image-cache";
const maxImagesToPreloadAtOnce = 6;
const timeToShowLoaderMs = 2790;

// TODO: if you want to try to do move MVC https://github.dev/developit/preact-todomvc/tree/master/src/app

async function getCachedUrls(cacheName, cb) {
    const urls = (await (await caches.open(cacheName)).keys()).map(i => i.url)
    return (cb) ? cb(urls) : urls
}

async function doesUrlExistInCache(cacheName, url) {
    const foundInCache = await (await caches.open(cacheName)).match(new Request(url), { ignoreVary: true, ignoreMethod: true, ignoreSearch: true });
    return foundInCache != undefined;
}

function getImagesListFromStorage() {
    return store(imagesListStorageKey) || [];
}
function setImagesListToStorage(imagesList) {
    return store(imagesListStorageKey, imagesList);
}

function getCurrentIndexFromStorage() {
    var result = parseInt(store(curentIndexStorageKey)) || -1;
    console.log("get index: ", result)
    return result;
}
function setCurrentIndexToStorage(index) {
    store(curentIndexStorageKey, index);
}

//TODO: useFallbackUrl
function getImageUrlToLoad(useFallbackUrl) {
    return url + Math.random();
}

async function preloadImage(useFallbackUrl, specificUrl) {
    var urlToLoad = specificUrl ?? getImageUrlToLoad(useFallbackUrl);
    var result = await fetch(urlToLoad, { referrer: "" });
    var cache = await caches.open(imageCacheName)

    if (await doesUrlExistInCache(imageCacheName, result.url)) {
        console.warn("We already have this URL in our cache, thus we are not adding it anywhere.", result.url)
        return null;
    } else {
        var myResponse = new Response(result.body, {
            "status": 200,
            "statusText": "OK",
            "cache-control": "public, max-age=315360000",
            "content-length": result.headers["content-length"],
            "content-type": result.headers["content-type"],
        });
        await cache.put(result.url, myResponse);

        return result.url;
    }
}

export default class Photos extends Component {
    constructor() {
        super()
        this.images = getImagesListFromStorage();
        this.state = {
            showingLoader: false,
            currentImage: "",
        }
        this.currentIndex = getCurrentIndexFromStorage();

        if (this.currentIndex > -1) {
            this.state.currentImage = this.images[this.currentIndex];
        }

        this.countOfImagesPreloading = 0;
        this.useFallbackUrl = false;
        this.currentMaxNumberOfImagesToPreload = 2;

        this.reconcileCachedImagesWithList = this.reconcileCachedImagesWithList.bind(this);
        this.preloadImages = this.preloadImages.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.goToPrevPhoto = this.goToPrevPhoto.bind(this);
        this.goToNextPhoto = this.goToNextPhoto.bind(this);
        this.pushToImagesList = this.pushToImagesList.bind(this);
        this.updatePointer = this.updateCurrentPhoto.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.endShowingLoader = this.endShowingLoader.bind(this);
        this.calculateNumberOfImagesToPreloadAtOnce = this.calculateNumberOfImagesToPreloadAtOnce.bind(this);

        this.preloadImages();
    }
    // https://stackoverflow.com/questions/53368714/reactjs-change-current-image-being-displayed-using-prev-and-next-buttons

    reconcileCachedImagesWithList() {
        getCachedUrls("image-cache").then((imagesInCache) => {
            if (imagesInCache.length === 0) {
                console.warn("No items found in cache! Therefore we are not trimming the images to browse list.");
                return;
            }
            var itemsStillCached = this.images.filter(x => {
                return imagesInCache.indexOf(x) > -1;
            })

            if (itemsStillCached.length != this.images.length) {
                console.log("Items were missing from the cache, thus we need to cleanup our stack of images to look over.", { "imagesInCache": imagesInCache, "this.images": this.images, "itemsStillCached": itemsStillCached });
                this.images = itemsStillCached;
                setImagesListToStorage(this.images);

                let currentImageIndexInNewList = this.images.indexOf(this.currentImage);

                if (currentImageIndexInNewList > -1) {
                    this.updateCurrentPhoto(currentImageIndexInNewList);
                }
                else if (this.currentIndex >= this.images.length) {
                    console.warn("We were browsing past the end of the newly cleaned up stack of images, thus we need to reset our index.");
                    this.updateCurrentPhoto(this.images.length - 1);
                }
            }
        })
    }

    componentDidUpdate() {
        setCurrentIndexToStorage(this.currentIndex);
    }
    componentDidMount() {
        addEventListener('keydown', this.onKeyDown);
    }
    componentWillUnmount() {
        this.endShowingLoader();
        removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown(event) {
        // Left Arrow
        if (event.keyCode === 37) {
            this.goToPrevPhoto();
        }
        // Right Arrow
        if (event.keyCode === 39) {
            this.goToNextPhoto();
        }
        if (event.key === "s") {
            this.showLoader();
        }
    }

    goToPrevPhoto() {
        const newPointer = this.currentIndex === -1 ? -1 : this.currentIndex - 1;
        if (this.currentIndex === -1) {
            // As an easter egg show the loader when you try to go back.
            // No callback means that it will just do one loop!
            this.showLoader();
        }
        else {
            this.endShowingLoader()
        }
        this.updateCurrentPhoto(newPointer);
    }

    // Can be called as much as you want.
    // Will call itself and wait with the loader for new images
    // If you call lots of times while waiting for loading it will look for a new photo and try to get it!
    goToNextPhoto() {
        var newPointer;
        // Run this with our old state to properly cleanup the list and our position in it
        this.reconcileCachedImagesWithList();

        // This command won't kick off more work unless there's space in the queue
        // Preload images here will have the "old" pointer
        this.preloadImages();

        if (this.currentIndex === this.images.length - 1) {
            // Show loader and after a timeout try again to go to the next photo
            this.showLoader(this.goToNextPhoto);
            newPointer = this.currentIndex;
        } else {
            this.endShowingLoader();
            newPointer = this.currentIndex + 1;
        }

        this.updateCurrentPhoto(newPointer);
    }

    updateCurrentPhoto(newPointer) {
        this.currentIndex = newPointer;
        this.setState((state) => {
            if (this.currentIndex === -1) {
                state.currentImage = ""
            } else {
                state.currentImage = this.images[newPointer];
            }
            return state;
        });
    }

    showLoader(cb) {
        this.setState((state) => {
            state.showingLoader = true;
            return state;
        });
        let loaderStartedCurrentImage = this.state.currentImage;

        if (!this.timeout) {
            console.log("Showing Loader & Setting timeout to retry next photo");
            this.timeout = setTimeout(function () {
                // After x time stop showing the loader.
                // If the callback still wants the loader we can call showLoader again and no state will change because react.
                this.endShowingLoader();
                if (this.state.currentImage == loaderStartedCurrentImage) {

                    cb ? cb() : null;
                }
                else {
                    console.log("Not running loader callback because state has changed")
                }
            }.bind(this), timeToShowLoaderMs);
        }
    }

    endShowingLoader() {
        this.setState((state) => {
            state.showingLoader = false;
            return state;
        });

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    pushToImagesList(newImageUrl) {
        this.images.push(newImageUrl);
        setImagesListToStorage(this.images);
    }

    calculateNumberOfImagesToPreloadAtOnce() {
        //TODO: Fix this logic to decouple number of requests at once vs number of images to have preloaded
        var imagesLeftInQueue = this.images.length - (this.currentIndex + 1);
        return Math.max(0, this.currentMaxNumberOfImagesToPreload - imagesLeftInQueue - this.countOfImagesPreloading);
    }

    preloadImages() {
        let count = this.calculateNumberOfImagesToPreloadAtOnce();
        if (count <= 0) return;
        console.log("Preloading images %d", count, { "this.images.length": this.images.length, "this.currentIndex": this.currentIndex, "this.countOfImagesPreloading": this.countOfImagesPreloading, "this.currentMaxNumberOfImagesToPreload": this.currentMaxNumberOfImagesToPreload })

        this.countOfImagesPreloading += count;

        if (typeof window !== "undefined") {
            for (var i = 0; i < count; i++) {
                preloadImage(this.useFallbackUrl).then(url => {
                    if (url != null) {
                        this.pushToImagesList(url);
                        this.currentMaxNumberOfImagesToPreload = Math.min(maxImagesToPreloadAtOnce, this.currentMaxNumberOfImagesToPreload + 1);
                        // If we've succeeded then try to preload more images. This function will early return if its doing too much work!
                        this.preloadImages();
                    }
                }).finally(() => {
                    this.countOfImagesPreloading--;
                })
            }
        }
    }

    render() {
        return (
            // https://grid.layoutit.com/?id=bCPxgJi
            <div class="PageGrid">
                <div class="PhotoWrapper">
                    <div class="PhotoFrame">
                        <img class={this.currentIndex === -1 ? "PhotoDisplay PhotoPreload" : "PhotoDisplay"} src={this.state.currentImage} alt="" onerror={this.handleImageError} onClick={this.goToNextPhoto} crossorigin="anonymous">
                        </img>
                        {this.state.showingLoader ? <Loader /> : null}
                    </div>
                </div>

                <div class="PhotoButtons">
                    <button class="prev" onClick={this.goToPrevPhoto}>&#10094;</button>
                    <button class="next" onClick={this.goToNextPhoto}>&#10095;</button>
                </div>
            </div>
        );
    }
}
