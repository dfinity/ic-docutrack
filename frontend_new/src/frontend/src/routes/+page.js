import { error } from '@sveltejs/kit';
import { actor } from '$lib/shared/stores/auth.js';

let actorValue;
actor.subscribe( value => actorValue = value);


let tableData = [];

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    // Get data from backend
    const fileData = await actorValue.get_files();
    // Prepare data for page template
    for (let idx = 0; idx < fileData.length; ++idx) {
        tableData.push({name: fileData[idx].file_name, access: "Only You", items: [{url: "/details/"+fileData[idx].file_id, text: "Open"}]});
        
    }
    return tableData;
}