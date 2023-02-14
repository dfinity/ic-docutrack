import { c as create_ssr_component, b as compute_rest_props, e as spread, g as escape_object, f as escape_attribute_value, i as add_attribute, h as escape, o as onDestroy, d as createEventDispatcher, v as validate_component, m as missing_component } from "./index.js";
import { B as Button } from "./Button.js";
import { c as classnames, u as uuid } from "./auth.js";
/* empty css                                         */const Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "inline", "validated"]);
  let { class: className = "" } = $$props;
  let { inline = false } = $$props;
  let { validated = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.validated === void 0 && $$bindings.validated && validated !== void 0)
    $$bindings.validated(validated);
  classes = classnames(className, {
    "form-inline": inline,
    "was-validated": validated
  });
  return `<form${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</form>`;
});
const InlineContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
const ModalBackdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "isOpen", "fade"]);
  let { class: className = "" } = $$props;
  let { isOpen = false } = $$props;
  let { fade = true } = $$props;
  let loaded = false;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  classes = classnames(className, "modal-backdrop");
  return `${isOpen && loaded ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], { classes: fade ? "fade" : "" })}></div>` : ``}`;
});
const ModalBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "modal-body");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const ModalHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "toggle", "closeAriaLabel", "children", "id"]);
  let { class: className = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { closeAriaLabel = "Close" } = $$props;
  let { children = void 0 } = $$props;
  let { id = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.closeAriaLabel === void 0 && $$bindings.closeAriaLabel && closeAriaLabel !== void 0)
    $$bindings.closeAriaLabel(closeAriaLabel);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  classes = classnames(className, "modal-header");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}><h5 class="${"modal-title"}"${add_attribute("id", id, 0)}>${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</h5>
  ${slots.close ? slots.close({}) : `
    ${typeof toggle === "function" ? `<button type="${"button"}" class="${"btn-close"}"${add_attribute("aria-label", closeAriaLabel, 0)}></button>` : ``}
  `}</div>`;
});
const Portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let ref;
  let portal;
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.removeChild(portal);
    }
  });
  return `<div${spread([escape_object($$restProps)], {})}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const css = {
  code: ".modal-open{overflow:hidden;padding-right:0}",
  map: null
};
const dialogBaseClass = "modal-dialog";
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let outer;
  compute_rest_props($$props, [
    "class",
    "static",
    "isOpen",
    "autoFocus",
    "body",
    "centered",
    "container",
    "fullscreen",
    "header",
    "scrollable",
    "size",
    "toggle",
    "labelledBy",
    "backdrop",
    "wrapClassName",
    "modalClassName",
    "contentClassName",
    "fade",
    "unmountOnClose",
    "returnFocusAfterClose"
  ]);
  createEventDispatcher();
  let { class: className = "" } = $$props;
  let { static: staticModal = false } = $$props;
  let { isOpen = false } = $$props;
  let { autoFocus = true } = $$props;
  let { body = false } = $$props;
  let { centered = false } = $$props;
  let { container = void 0 } = $$props;
  let { fullscreen = false } = $$props;
  let { header = void 0 } = $$props;
  let { scrollable = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { labelledBy = header ? `modal-${uuid()}` : void 0 } = $$props;
  let { backdrop = true } = $$props;
  let { wrapClassName = "" } = $$props;
  let { modalClassName = "" } = $$props;
  let { contentClassName = "" } = $$props;
  let { fade = true } = $$props;
  let { unmountOnClose = true } = $$props;
  let { returnFocusAfterClose = true } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.static === void 0 && $$bindings.static && staticModal !== void 0)
    $$bindings.static(staticModal);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.autoFocus === void 0 && $$bindings.autoFocus && autoFocus !== void 0)
    $$bindings.autoFocus(autoFocus);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.fullscreen === void 0 && $$bindings.fullscreen && fullscreen !== void 0)
    $$bindings.fullscreen(fullscreen);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.scrollable === void 0 && $$bindings.scrollable && scrollable !== void 0)
    $$bindings.scrollable(scrollable);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.labelledBy === void 0 && $$bindings.labelledBy && labelledBy !== void 0)
    $$bindings.labelledBy(labelledBy);
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop !== void 0)
    $$bindings.backdrop(backdrop);
  if ($$props.wrapClassName === void 0 && $$bindings.wrapClassName && wrapClassName !== void 0)
    $$bindings.wrapClassName(wrapClassName);
  if ($$props.modalClassName === void 0 && $$bindings.modalClassName && modalClassName !== void 0)
    $$bindings.modalClassName(modalClassName);
  if ($$props.contentClassName === void 0 && $$bindings.contentClassName && contentClassName !== void 0)
    $$bindings.contentClassName(contentClassName);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.unmountOnClose === void 0 && $$bindings.unmountOnClose && unmountOnClose !== void 0)
    $$bindings.unmountOnClose(unmountOnClose);
  if ($$props.returnFocusAfterClose === void 0 && $$bindings.returnFocusAfterClose && returnFocusAfterClose !== void 0)
    $$bindings.returnFocusAfterClose(returnFocusAfterClose);
  $$result.css.add(css);
  classnames(dialogBaseClass, className, {
    [`modal-${size}`]: size,
    "modal-fullscreen": fullscreen === true,
    [`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === "string",
    [`${dialogBaseClass}-centered`]: centered,
    [`${dialogBaseClass}-scrollable`]: scrollable
  });
  outer = container === "inline" || staticModal ? InlineContainer : Portal;
  return `${``}
${backdrop && !staticModal ? `${validate_component(outer || missing_component, "svelte:component").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(ModalBackdrop, "ModalBackdrop").$$render($$result, { fade, isOpen }, {}, {})}`;
    }
  })}` : ``}`;
});
const ModalFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "modal-footer");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const RequestModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isOpen = false } = $$props;
  const toggle = () => isOpen = !isOpen;
  let requestName = "";
  let requestUrl = "";
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  return `<div>${validate_component(Button, "Button").$$render($$result, { color: "default" }, {}, {
    default: () => {
      return `Create new request`;
    }
  })}
	${validate_component(Modal, "Modal").$$render($$result, { isOpen, toggle }, {}, {
    default: () => {
      return `${validate_component(ModalHeader, "ModalHeader").$$render($$result, { toggle }, {}, {
        default: () => {
          return `Create Request`;
        }
      })}
		${validate_component(ModalBody, "ModalBody").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Form, "Form").$$render($$result, {}, {}, {
            default: () => {
              return `<div class="${"mb-3"}"><label for="${"requestName"}" class="${"form-label"}">Request Name</label>
					<input type="${"text"}" class="${"form-control"}" id="${"requestName"}"${add_attribute("value", requestName, 0)}></div>
				<div class="${"mb-3"}"><label for="${"requestLink"}" class="${"form-label"}">Request Link</label>
					<input class="${"form-control"}" id="${"requestLink"}" readonly${add_attribute("value", requestUrl, 0)}></div>`;
            }
          })}`;
        }
      })}
		${validate_component(ModalFooter, "ModalFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${`${validate_component(Button, "Button").$$render($$result, { color: "primary" }, {}, {
            default: () => {
              return `Create Request`;
            }
          })}`}`;
        }
      })}`;
    }
  })}</div>`;
});
export {
  RequestModal as R
};
