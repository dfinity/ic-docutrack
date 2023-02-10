import { actor } from '$lib/shared/stores/auth.js';
/**
 * @param {Number} data.fileId Unique file identifier
 * @param {String} file.fileName File name
 * @param {Object} file.userPublicKey Public Key used for the file encryption
 */
let data = {};

let actorValue;
actor.subscribe((value) => (actorValue = value));

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	if (actorValue) {
		let requestInfo = await actorValue.get_alias_info(params.slug);
		console.log('request info: ', requestInfo);

		data['fileId'] = requestInfo.file_id;
		data['fileName'] = requestInfo.file_name;
		data['userPublicKey'] = requestInfo.user_public_key;
	}
	return data;
}
