import '../style';
import { store } from './util';
import Loader from './loader';
import { Component } from 'preact';
// const url = "https://picsum.photos/400/601?";
const url = "https://source.unsplash.com/collection/139386?"
// const url = "https://thecatapi.com/api/images/get?format=src";

const curentIndexStorageKey = 'current-index'
const imagesListStorageKey = 'image-urls'

// TODO: if you want to try to do move MVC https://github.dev/developit/preact-todomvc/tree/master/src/app

async function getCachedUrls(cacheName, cb) {
    const urls = (await (await caches.open(cacheName)).keys()).map(i => i.url)
    return (cb) ? cb(urls) : urls
}

function getImagesListFromStorage() {
    return store(imagesListStorageKey) || [
        "https://source.unsplash.com/collection/139386/500x500",
    ];
}
function setImagesListToStorage(imagesList) {
    return store(imagesListStorageKey, imagesList);
}

function getCurrentIndexFromStorage() {
    var result = parseInt(store(curentIndexStorageKey)) || 0;
    console.log("get index: ", result)
    return result;
}

function setCurrentIndexToStorage(index) {
    console.log("set index: ", index)
    store(curentIndexStorageKey, index);
}

function getImageUrlToLoad() {
    return url + Math.random();
}

export default class Photos extends Component {
    constructor() {
        super()
        this.images = getImagesListFromStorage();
        this.state = {
            currentIndex: getCurrentIndexFromStorage(),
            showingLoader: true
        }
        this.reconcileCachedImagesWithList = this.reconcileCachedImagesWithList.bind(this);
        this.preloadImages = this.preloadImages.bind(this);
        this.goToPrevPhoto = this.goToPrevPhoto.bind(this);
        this.goToNextPhoto = this.goToNextPhoto.bind(this);
        this.pushToImagesList = this.pushToImagesList.bind(this);
        this.updatePointer = this.updatePointer.bind(this)
        this.showLoader = this.showLoader.bind(this)
        this.endShowingLoader = this.endShowingLoader.bind(this)

        this.preloadImages(1);
    }
    // https://stackoverflow.com/questions/53368714/reactjs-change-current-image-being-displayed-using-prev-and-next-buttons

    reconcileCachedImagesWithList() {
        getCachedUrls("image-cache").then((imagesInCache) => {
            if(imagesInCache.length === 0) {
                console.warn("No items found in cache! Therefore we are not trimming the images to browse list.");
                return;
            } 
            var itemsStillCached = this.images.filter(x => {
                return imagesInCache.indexOf(x) > -1;
            })
            
            if(itemsStillCached.length != this.images.length) {
                console.log("Items were missing from the cache, thus we need to cleanup our stack of images to look over.", {"imagesInCache": imagesInCache, "this.images": this.images, "itemsStillCached": itemsStillCached});
                this.images = itemsStillCached;
                setImagesListToStorage(this.images);

                if(this.state.currentIndex >= this.images.length) {
                    console.warn("We were browsing past the end of the newly cleaned up stack of images, thus we need to reset our index.");
                    this.updatePointer(this.images.length -1);
                }
            }
        })
    }

    onStateUpdate() {
        setCurrentIndexToStorage(this.state.currentIndex);
    }
    goToPrevPhoto() {
        const { currentIndex } = this.state;
        const newPointer = currentIndex === 0 ? 0 : currentIndex - 1;
        if(newPointer == 0) {
            this.showLoader();
        }
        this.updatePointer(newPointer);
    }

    goToNextPhoto() {
        const { currentIndex } = this.state;
        var newPointer;

        if (currentIndex === this.images.length - 1) {
            this.showLoader();
            newPointer = currentIndex;

        } else {
            this.endShowingLoader();
            newPointer = currentIndex + 1;
        }

        this.updatePointer(newPointer);
        this.preloadImages();
        this.reconcileCachedImagesWithList();
    }

    updatePointer(newPointer) {
        this.setState((state) => {
            state.currentIndex = newPointer;
            return state;
        });
    }

    showLoader() {
        console.log("Showing Loader")
        this.setState((state) => {
            state.showingLoader = true;
            return state;
        });
    }

    endShowingLoader() {
        console.log("Stopping Loader")
        this.setState((state) => {
            state.showingLoader = false;
            return state;
        });
    }
    
    pushToImagesList(newImageUrl) {
        this.images.push(newImageUrl);
        setImagesListToStorage(this.images);
    }

    preloadImages(count) {
        if (!count) {
            var imagesLeftInQueue = this.images.length - (this.state.currentIndex + 1)
            count = Math.max(0, 5 - imagesLeftInQueue)
        }
        if (count <= 0) return;

        if (typeof window !== "undefined") {
            for (var i = 0; i < count; i++) {
                let img = new Image();
                img.src = getImageUrlToLoad();
                img.onload = () => {
                    this.pushToImagesList(img.src);
                }
            }
        }
    }

    render() {
        return (
            <div class="wrapperDiv">
                {/* {this.state.showingLoader ? <Loader /> : null} */}
                {/* <Loader /> */}
                <img id="photo" src={this.images[this.state.currentIndex] || "https://source.unsplash.com/collection/139386/500x500"} alt="" onload={this.endShowingLoader} onerror={this.goToNextPhoto} onClick={this.goToNextPhoto}> 
                
                </img>
                <br />
                <button class="prev" onClick={this.goToPrevPhoto}>&#10094;</button>
                <button class="next" onClick={this.goToNextPhoto}>&#10095;</button>
                <br />
            </div>
        );
    }
}
