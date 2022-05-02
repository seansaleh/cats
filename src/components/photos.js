import '../style';
import { Component } from 'preact';

export default class Photos extends Component {
    render() {
        return (
            <div class="wrapperDiv">
                <img id="photo" src="https://thecatapi.com/api/images/get?format=src" alt="" />
                {/* Alternate picture source for testing */}
                {/* <img id="photo" src="https://picsum.photos/400/600" alt="" /> */}
            </div>
        );
    }
}
