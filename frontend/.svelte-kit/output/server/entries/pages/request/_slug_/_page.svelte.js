import { c as create_ssr_component, h as escape } from "../../../../chunks/index.js";
/* empty css                                                          */const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-lqpm3s_START -->${$$result.title = `<title>DokuTrack: Request</title>`, ""}<meta name="${"description"}" content="${"DokuTrack: Requests"}"><!-- HEAD_svelte-lqpm3s_END -->`, ""}

<section><h1>File Upload</h1>
	<h3 class="${"mt-4"}">${escape(data.fileName)}</h3>
	${`<div class="${"my-3"}"><label for="${"formFile"}" class="${"form-label"}">Upload your file</label>
			<input class="${"form-control"}" type="${"file"}" id="${"formFile"}"></div>
		<div class="${"mb-3"}"><button class="${"btn btn-primary"}">Submit</button></div>

		${``}`}</section>`;
});
export {
  Page as default
};
