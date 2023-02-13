// @ts-nocheck
import { error } from "@sveltejs/kit";

/** @param {Parameters<import('./$types').PageLoad>[0]} event */
export function load({ params }) {
  // Call backend to get file info and blob
  // ...
  return {
    alias: params.slug,
    id: 1,
    name: "Some File",
    dataType: "image/png",
    data: "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
  };
  // If the resource is not available, show 404
  throw error(404, "Not found");
}
