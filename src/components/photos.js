import '../style';
import { Component } from 'preact';
const url = "https://picsum.photos/400/601?";
// const url = "https://thecatapi.com/api/images/get?format=src";
export default class Photos extends Component {
    constructor() {
        super()
        this.images = [
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
    }

    goToNextPhoto() {
        const { currentIndex } = this.state;
        const newPointer = currentIndex === this.images.length - 1 ? 0 : currentIndex + 1;
        this.setState({ currentIndex: newPointer });
        this.loadPhotos(1, this.images);
    }
    loadPhotos(count, imagesList) {
        // https://stackoverflow.com/questions/10240110/how-do-you-cache-an-image-in-javascript

        var list = []
        for (var i = 0; i < count; i++) {
            var img = new Image();
            img.src = url + Math.random();
            img.onload = function() {
                imagesList.push(img.src);
            }
        }
    }

    render() {
        return (
            <div class="wrapperDiv">
                <img id="photo" src={this.images[this.state.currentIndex]} alt="" onClick={this.goToNextPhoto} />
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
