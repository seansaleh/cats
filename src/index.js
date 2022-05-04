import './style.css';
import { Component } from 'preact';
import Background from './components/background.js'
import Photos from './components/photos.js'

export default class Index extends Component {
    render() {
        return (
            <div>
                <Background />
                <Photos />
            </div>
        );
    }
}
