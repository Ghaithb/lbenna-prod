import '@testing-library/jest-dom';

// Lightweight 2D canvas context mock to silence jsdom "getContext not implemented" errors in tests.
// We only implement the subset of API actually used by TopDownPlanEditor (drawing simple shapes & gradients).
// If future code needs more APIs, extend this mock accordingly.
if (typeof HTMLCanvasElement !== 'undefined') {
	const proto = HTMLCanvasElement.prototype as any;
	// Always override jsdom's throwing implementation with a harmless stub for tests
	proto.getContext = function (_type: string) {
		const noop = () => {};
		const gradient = { addColorStop: noop };
		return {
			// state & path
			beginPath: noop,
			closePath: noop,
			// drawing primitives
			clearRect: noop,
			fillRect: noop,
			arc: noop,
			fill: noop,
			stroke: noop,
			moveTo: noop,
			lineTo: noop,
			// styles
			createLinearGradient: () => gradient,
			addColorStop: noop,
			// text
			fillText: noop,
			// properties mutated in code
			fillStyle: undefined,
			strokeStyle: undefined,
			lineWidth: 1,
			font: '12px sans-serif',
			textAlign: 'left'
		} as any;
	};
	if (!proto.toBlob) {
		proto.toBlob = function (cb: (b: Blob|null)=>void) {
			// Return empty PNG blob placeholder
			const data = '';
			const blob = new Blob([data], { type: 'image/png' });
			cb(blob);
		};
	}
}

