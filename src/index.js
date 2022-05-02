import './style';
import trianglify from 'trianglify';
import { Component } from 'preact';


export default class Index extends Component {
	componentDidMount() {
		if (typeof window !== "undefined") {
			var pattern = trianglify({
				height: 2000,
				width: 2000,
				xColors: 'random',
				yColors: 'match',
				cellSize: 130,
			})

			caches.open("generated-backgrounds").then(function(cache) {
				var myString = pattern.toSVGTree().toString();
				var myBlob = new Blob([myString], {type:"image/svg+xml"});
				var myResponse = new Response(myBlob, {"status": 200, "statusText": "OK"});
				cache.put('/assets/generated-background.svg', myResponse);
			})
		
			// Switch these lines to switch between canvas or SVG. SVG doesn't rescale with page, canvas does
			// document.body.appendChild(pattern.toCanvas())
			//pattern.toSVG(document.getElementById('svg-top-bg'));
			// After timeout set fade, otherwise it instant fades
			setTimeout(function(){
				// document.getElementById('svg-top-bg').setAttribute('class', 'fade');
				// document.querySelector('canvas').setAttribute('class', 'fade');
			}, 50); 
			
		}
	}
	render() {
		// Set a grey background as SVG so that it gets pre-rendered, to avoid a white page load flash in
		const pattern_base_bg = trianglify({
			height: 3000,
			width: 3000,
			xColors: 'Greys',
			yColors: 'match',
			cellSize: 400,
		})
		const pattern_base_bg_svg = pattern_base_bg.toSVGTree();

		return (
			<div>
			{/* <svg id="svg-base-bg" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{__html: pattern_base_bg_svg.children.toString()}}/> */}
			{/* <img src="/assets/generated-background.svg" id="svg-top-bg"/> */}
			<div class="wrapperDiv">
				{/* <img id="photo" src="https://thecatapi.com/api/images/get?format=src" alt="" /> */}
				{/* Alternate picture source for testing */}
				<img id="photo" src="https://picsum.photos/400/600" alt="" />
			</div>
			</div>
		);
	}
}