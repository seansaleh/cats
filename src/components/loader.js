import { Component } from 'preact';

export default class Loader extends Component {
    // From https://codepen.io/touneko/pen/ygOgWj
    // and https://codepen.io/Rplus/pen/oBxLQK
    // Also consider an animated svg, like https://github.com/Gowee/nyancat-svg
    render() {
        return (

            <div class="box">
                <div class="cat-box">
                    <div class="cat">
                        <div class="helf-box helf-box--ass">
                            <div class="helf-box clip">
                                <div class="cat__body"></div>
                            </div>
                            <div class="cat__ass">
                                <div class="cat__body--fake"></div>
                                <div class="cat__foots"></div>
                                <div class="cat__tail"></div>
                            </div>
                        </div>
                        <div class="helf-box helf-box--head">
                            <div class="cat__head">
                                <div class="cat__face">
                                    <div class="cat__ears"></div>
                                    <div class="cat__eyes"></div>
                                    <div class="cat__mouth"></div>
                                    <div class="cat__mustache"></div>
                                </div>
                                <div class="cat__foots"></div>
                            </div>
                            <div class="helf-box clip">
                                <div class="cat__body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
