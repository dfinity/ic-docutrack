export { matchers } from './matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7')];

export const server_loads = [];

export const dictionary = {
	"/": [2],
	"/details/[slug]": [3],
	"/files-overview": [4],
	"/requestFile": [6],
	"/requests": [7],
	"/request/[slug]": [5]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};