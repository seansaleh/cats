import '../style';
import { Component } from 'preact';
const url = "https://picsum.photos/400/601?";
// const url = "https://source.unsplash.com/collection/139386"
// const url = "https://thecatapi.com/api/images/get?format=src";




export default class Photos extends Component {
    // TODO: keep track of images: https://felixgerschau.com/react-localstorage/
    constructor() {
        super()
        this.images = [
            // "https://source.unsplash.com/collection/139386/400x400",
            url,
        ]
        this.state = {
            currentIndex: 0,
        }
        this.loadPhotos = this.loadPhotos.bind(this);
        this.loadPhotos(1, this.images);
        this.goToPrevPhoto = this.goToPrevPhoto.bind(this);
        this.goToNextPhoto = this.goToNextPhoto.bind(this);
    }
    // https://stackoverflow.com/questions/53368714/reactjs-change-current-image-being-displayed-using-prev-and-next-buttons

    goToPrevPhoto() {
        const { currentIndex } = this.state;
        const newPointer = currentIndex === 0 ? this.images.length - 1 : currentIndex - 1;
        this.setState({ currentIndex: newPointer });

        var response;
        fetch("https://source.unsplash.com/collection/139386").then((r) => {
            response = r;
            caches.open("precached-image").then((cache) => {
                var myResponse = new Response(response.Blob, { "status": 200, "statusText": "OK" });
                cache.put('/assets/precached-image.jpg', myResponse);
            })
        })
    }

    goToNextPhoto() {
        const { currentIndex } = this.state;
        const newPointer = currentIndex === this.images.length - 1 ? 0 : currentIndex + 1;
        this.setState({ currentIndex: newPointer });
        this.loadPhotos(1, this.images);
    }
    loadPhotos(count, imagesList) {
        if (typeof window !== "undefined") { 
        // https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript

        var list = []
        for (var i = 0; i < count; i++) {
            var img = new Image();
            img.src = "/assets/precached-image.jpg"
            //img.src = url + Math.random();
            img.onload = function () {
                imagesList.push(img.src);
            }
        }
    }
    }

    render() {
        return (
            <div class="wrapperDiv">
                {/* <object data="/assets/precached-image.jpg" type="image"> */}
                {/* TODO: Use a fixed blurhash from unsplash for 400x400 https://blurha.sh/ */}
                    <img id="photo" src={url} alt="" onerror={this.goToNextPhoto} onClick={this.goToNextPhoto} />
                {/* </object> */}
                {/* Alternate picture source for testing */}
                {/* <img id="photo" src="https://picsum.photos/400/600" alt="" /> */}
                <br />
                <button class="prev" onClick={this.goToPrevPhoto}>&#10094;</button>
                <button class="next" onClick={this.goToNextPhoto}>&#10095;</button>
                <br />
            </div>
        );
    }
}
