import { c as create_ssr_component, v as validate_component } from "../../../chunks/index.js";
import { A as Alert } from "../../../chunks/Alert.js";
/* empty css                                                       */import { p as principal } from "../../../chunks/auth.js";
import { C as ContentTable } from "../../../chunks/ContentTable.js";
import { R as RequestModal } from "../../../chunks/RequestModal.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableColumns;
  let tableData;
  let principalValue;
  let poller;
  principal.subscribe((value) => principalValue = value);
  function formatTableData(requestedFiles) {
    let row;
    tableData.push(row);
    return tableColumns;
  }
  const setupPoller = () => {
    if (poller) {
      clearInterval(poller);
    }
    poller = setInterval(doPoll(), 2e3);
  };
  const doPoll = () => async () => {
    tableData = await new Promise((resolve) => setTimeout(
      () => {
        resolve(formatTableData());
      },
      500
    ));
  };
  tableColumns = [];
  tableData = [];
  {
    setupPoller();
  }
  return `${validate_component(RequestModal, "RequestModal").$$render($$result, { isOpen: false }, {}, {})}

${principalValue ? `${validate_component(ContentTable, "ContentTable").$$render($$result, { columns: tableColumns, data: tableData }, {}, {})}` : `${validate_component(Alert, "Alert").$$render($$result, { color: "warning" }, {}, {
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
