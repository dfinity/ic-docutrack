import { c as create_ssr_component, b as compute_rest_props, e as spread, g as escape_object, f as escape_attribute_value, i as add_attribute, v as validate_component, h as escape } from "../../../../chunks/index.js";
import { i as isObject, g as getColumnSizeClass, c as classnames, p as principal } from "../../../../chunks/auth.js";
/* empty css                                                          */import { T as Table } from "../../../../chunks/Table.js";
const Col = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "xs", "sm", "md", "lg", "xl", "xxl"]);
  let { class: className = "" } = $$props;
  let { xs = void 0 } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  const colClasses = [];
  const lookup = { xs, sm, md, lg, xl, xxl };
  Object.keys(lookup).forEach((colWidth) => {
    const columnProp = lookup[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      if (columnProp.size || columnProp.size === "") {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
      if (columnProp.order) {
        colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  if (!colClasses.length) {
    colClasses.push("col");
  }
  if (className) {
    colClasses.push(className);
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  return `<div${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(colClasses.join(" "))
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
function getCols(cols) {
  const colsValue = parseInt(cols);
  if (!isNaN(colsValue)) {
    if (colsValue > 0) {
      return [`row-cols-${colsValue}`];
    }
  } else if (typeof cols === "object") {
    return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
      const isXs = colWidth === "xs";
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const value = cols[colWidth];
      if (typeof value === "number" && value > 0) {
        return `row-cols${colSizeInterfix}${value}`;
      }
      return null;
    }).filter((value) => !!value);
  }
  return [];
}
const Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "noGutters", "form", "cols", "inner"]);
  let { class: className = "" } = $$props;
  let { noGutters = false } = $$props;
  let { form = false } = $$props;
  let { cols = 0 } = $$props;
  let { inner = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0)
    $$bindings.noGutters(noGutters);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols));
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Details = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  principal.subscribe((value) => value);
  let { file = {} } = $$props;
  if ($$props.file === void 0 && $$bindings.file && file !== void 0)
    $$bindings.file(file);
  return `${validate_component(Row, "Row").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Col, "Col").$$render($$result, { class: "col-md-6" }, {}, {
        default: () => {
          return `${validate_component(Table, "Table").$$render($$result, { borderless: true }, {}, {
            default: () => {
              return `<tbody><tr><th scope="${"row"}">File Name</th>
					<td>${escape(file.name)}</td></tr>
				<tr><th scope="${"row"}">Owner</th>
					<td>You </td></tr></tbody>`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
const FilePreview = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { file } = $$props;
  let previewStyle;
  let previewClass;
  const supportedDataTypes = ["application/pdf", "image/jpg", "image/jpeg", "image/png"];
  if ($$props.file === void 0 && $$bindings.file && file !== void 0)
    $$bindings.file(file);
  previewStyle = file.dataType === "application/pdf" ? "--bs-aspect-ratio: 141%" : "";
  previewClass = file.dataType === "application/pdf" ? "ratio" : "";
  return `<div class="${"d-flex justify-content-center mb-3 " + escape(previewClass, true)}"${add_attribute("style", previewStyle, 0)}>${supportedDataTypes.includes(file.dataType) ? `<embed width="${"100%"}" height="${"100%"}" name="${"plugin"}" src="${"data:" + escape(file.dataType, true) + ";base64," + escape(file.data, true)}">` : `<p>No preview available.</p>`}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-tqm59z_START -->${$$result.title = `<title>DokuTrack: Details</title>`, ""}<meta name="${"description"}" content="${"DokuTrack"}"><!-- HEAD_svelte-tqm59z_END -->`, ""}
<section><h1>Details</h1>
	${validate_component(Details, "Details").$$render($$result, { file: data }, {}, {})}
	${validate_component(FilePreview, "FilePreview").$$render($$result, { file: data }, {}, {})}</section>`;
});
export {
  Page as default
};
