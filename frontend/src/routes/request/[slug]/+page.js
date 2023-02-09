import { error } from '@sveltejs/kit';

/**
   * @param {Object} data File data
   * @param {Number} d  ata.fileId Unique file identifier
   * @param {String} file.fileName File name
   * @param {Object} file.userPublicKey Public Key used for the file encryption
   */
let data = {'fileName': 'Test Request Name'};

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
// TODO: add backend connection
// get_alias_info(params.slug)
// Check if request exists
// if yes, feed data into var, else
// throw error(404, 'Not found');

return data;
}
