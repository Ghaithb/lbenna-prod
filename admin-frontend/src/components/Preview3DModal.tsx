// Thin shim to preserve compatibility after renaming to PreviewModal
// Deprecated: 3D preview removed. Do not import this.
// Kept temporarily to avoid breaking builds; using it will throw.
export function Preview3DModal() {
	throw new Error('Preview3DModal has been removed. Use PreviewModal instead.');
}
export type Preview3DModalProps = never;
export { default } from './PreviewModal';
