import { dev } from "$app/environment";
import { actor } from "$lib/shared/stores/auth.js";

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

let actorValue;
let tableData;
actor.subscribe((value) => (actorValue = value));

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  // Get data from backend
  if (actorValue) {
    const fileData = await actorValue.get_files();
    // Prepare data for page template
    for (let idx = 0; idx < fileData.length; ++idx) {
      tableData.push({
        name: fileData[idx].file_name,
        access: "Only You",
        items: [{ url: "/details/" + fileData[idx].file_id, text: "Open" }],
      });
    }
  }
  return { actor: actorValue, tableData: tableData };
}
