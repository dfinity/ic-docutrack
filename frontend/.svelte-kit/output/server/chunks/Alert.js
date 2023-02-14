import { c as create_ssr_component, b as compute_rest_props, e as spread, g as escape_object, f as escape_attribute_value, h as escape, i as add_attribute, p as compute_slots } from "./index.js";
import { c as classnames } from "./auth.js";
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showClose;
  let classes;
  let closeClassNames;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "children",
    "color",
    "closeClassName",
    "closeAriaLabel",
    "dismissible",
    "heading",
    "isOpen",
    "toggle",
    "fade",
    "transition"
  ]);
  let $$slots = compute_slots(slots);
  let { class: className = "" } = $$props;
  let { children = void 0 } = $$props;
  let { color = "success" } = $$props;
  let { closeClassName = "" } = $$props;
  let { closeAriaLabel = "Close" } = $$props;
  let { dismissible = false } = $$props;
  let { heading = void 0 } = $$props;
  let { isOpen = true } = $$props;
  let { toggle = void 0 } = $$props;
  let { fade = true } = $$props;
  let { transition = { duration: fade ? 400 : 0 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.closeClassName === void 0 && $$bindings.closeClassName && closeClassName !== void 0)
    $$bindings.closeClassName(closeClassName);
  if ($$props.closeAriaLabel === void 0 && $$bindings.closeAriaLabel && closeAriaLabel !== void 0)
    $$bindings.closeAriaLabel(closeAriaLabel);
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0)
    $$bindings.dismissible(dismissible);
  if ($$props.heading === void 0 && $$bindings.heading && heading !== void 0)
    $$bindings.heading(heading);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  showClose = dismissible || toggle;
  classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": showClose });
  closeClassNames = classnames("btn-close", closeClassName);
  return `${isOpen ? `<div${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { role: "alert" }
    ],
    {}
  )}>${heading || $$slots.heading ? `<h4 class="${"alert-heading"}">${escape(heading)}${slots.heading ? slots.heading({}) : ``}</h4>` : ``}
    ${showClose ? `<button type="${"button"}"${add_attribute("class", closeClassNames, 0)}${add_attribute("aria-label", closeAriaLabel, 0)}></button>` : ``}
    ${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</div>` : ``}`;
});
export {
  Alert as A
};
