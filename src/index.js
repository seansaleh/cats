import './style';
import trianglify from 'trianglify';
import { Component } from 'preact';

export default class Index extends Component {
	componentDidMount() {
		if (typeof window !== "undefined") {
			var aspectRatio = window.innerHeight/window.innerWidth;
			var backgroundHeight = Math.ceil(50*aspectRatio);
			var backgroundWidth = 50;
			
			var pattern = trianglify({
				height: backgroundHeight,
				width: backgroundWidth,
				xColors: 'random',
				yColors: 'match',
				cellSize: 5
			})
		
			// Switch these lines to switch between canvas or SVG. SVG doesn't rescale with page, canvas does
			pattern.toSVG(document.getElementById('svg-top-bg'),{
				// Controls how many decimals to round coordinate values to.
				// We set this to reduce the size of the SVG
				coordinateDecimals: 0
			  });
			document.getElementById('svg-top-bg').setAttribute('viewBox', '0 0 '+ backgroundWidth + ' ' + backgroundHeight);
			document.getElementById('svg-top-bg').setAttribute('preserveAspectRatio', 'xMidYMid slice');

			// After timeout set fade, otherwise it instant fades
			setTimeout(function(){
				document.getElementById('svg-top-bg').setAttribute('class', 'fade');
			}, 50); 
			
		}
	}
	render() {
		// Set a grey background as SVG so that it gets pre-rendered, to avoid a white page load flash in
		var backgroundHeight = 100;
		var backgroundWidth = 50
		const pattern_base_bg = trianglify({
			height: backgroundHeight,
			width: backgroundWidth,
			xColors: 'Greys',
			yColors: 'match',
			cellSize: 5,
		})
		const pattern_base_bg_svg = pattern_base_bg.toSVGTree({
			// Controls how many decimals to round coordinate values to.
			// We set this to reduce the size of the SVG
			coordinateDecimals: 0
		  });

// We must set the viewBox and the setting preserveAspectRatio to get SVG's to scale
// https://stackoverflow.com/questions/42540405/how-can-i-make-an-inline-svg-always-fill-out-the-screen

		return (
			<div>
			<svg id="svg-base-bg" xmlns="http://www.w3.org/2000/svg" viewBox={'0 0 '+ backgroundWidth + ' ' + backgroundHeight} preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{__html: pattern_base_bg_svg.children.toString()}}/>
			<svg id="svg-top-bg"/>
			<div class="wrapperDiv">
				<img id="photo" src="https://thecatapi.com/api/images/get?format=src" alt="" />
				{/* Alternate picture source for testing */}
				{/* <img id="photo" src="https://picsum.photos/400/600" alt="" /> */}
			</div>
			</div>
		);
	}
}