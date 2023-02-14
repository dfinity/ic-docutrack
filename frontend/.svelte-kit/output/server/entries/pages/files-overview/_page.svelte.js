import { c as create_ssr_component, v as validate_component } from "../../../chunks/index.js";
import { A as Alert } from "../../../chunks/Alert.js";
/* empty css                                                       */import { p as principal } from "../../../chunks/auth.js";
import { C as ContentTable } from "../../../chunks/ContentTable.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableColumns;
  let tableData;
  let principalValue;
  principal.subscribe((value) => principalValue = value);
  tableColumns = [];
  tableData = [];
  return `${principalValue ? `${validate_component(ContentTable, "ContentTable").$$render($$result, { columns: tableColumns, data: tableData }, {}, {})}` : `${validate_component(Alert, "Alert").$$render($$result, { color: "warning" }, {}, {
    default: () => {
      return `<h4 class="${"alert-heading text-capitalize"}">warning</h4>
		User must be authenticated.
	`;
    }
  })}`}`;
});
export {
  Page as default
};
