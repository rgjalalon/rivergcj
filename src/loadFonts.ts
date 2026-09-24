import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const faces = [
  {family: 'Playfair Display', file: 'playfair-display-latin-400-normal.woff2', weight: '400', style: 'normal'},
  {family: 'Playfair Display', file: 'playfair-display-latin-500-normal.woff2', weight: '500', style: 'normal'},
  {family: 'Playfair Display', file: 'playfair-display-latin-600-normal.woff2', weight: '600', style: 'normal'},
  {family: 'Playfair Display', file: 'playfair-display-latin-400-italic.woff2', weight: '400', style: 'italic'},
  {family: 'Inter', file: 'inter-latin-400-normal.woff2', weight: '400', style: 'normal'},
  {family: 'Inter', file: 'inter-latin-500-normal.woff2', weight: '500', style: 'normal'},
  {family: 'Inter', file: 'inter-latin-600-normal.woff2', weight: '600', style: 'normal'},
];

for (const face of faces) {
  loadFont({
    family: face.family,
    url: staticFile(`fonts/${face.file}`),
    weight: face.weight,
    style: face.style,
  });
}
