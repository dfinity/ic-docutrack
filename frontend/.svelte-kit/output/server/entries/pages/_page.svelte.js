import { c as create_ssr_component, v as validate_component } from "../../chunks/index.js";
import { p as principal } from "../../chunks/auth.js";
import { C as ContentTable } from "../../chunks/ContentTable.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableColumns;
  let tableData;
  principal.subscribe((value) => value);
  tableColumns = [{ key: "name", label: "Name" }, { key: "access", label: "Access" }];
  tableData = [
    {
      name: "escrow_hotel_zurich.docx",
      access: "Only you",
      items: [{ url: "#", text: "Open" }]
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-1czwpv4_START -->${$$result.title = `<title>Home</title>`, ""}<meta name="${"description"}" content="${"DokuTrack"}"><!-- HEAD_svelte-1czwpv4_END -->`, ""}

<section>${validate_component(ContentTable, "ContentTable").$$render($$result, { columns: tableColumns, data: tableData }, {}, {})}</section>`;
});
export {
  Page as default
};
