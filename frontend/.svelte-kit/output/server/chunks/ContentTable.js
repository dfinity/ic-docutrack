import { c as create_ssr_component, b as compute_rest_props, s as setContext, j as getContext, o as onDestroy, e as spread, g as escape_object, f as escape_attribute_value, i as add_attribute, k as subscribe, h as escape, v as validate_component, l as each } from "./index.js";
/* empty css                                         */import { T as Table } from "./Table.js";
import { createPopper } from "@popperjs/core/dist/esm/popper.js";
import { c as classnames } from "./auth.js";
import { w as writable } from "./index2.js";
function createPopperActions(initOptions) {
  let contentNode;
  let options = initOptions;
  let popperInstance = null;
  let referenceNode;
  const initPopper = () => {
    if (referenceNode && contentNode) {
      popperInstance = createPopper(referenceNode, contentNode, options);
    }
  };
  const deinitPopper = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };
  const referenceAction = (node) => {
    referenceNode = node;
    initPopper();
    return {
      destroy() {
        deinitPopper();
      }
    };
  };
  const contentAction = (node, contentOptions) => {
    contentNode = node;
    options = Object.assign(Object.assign({}, initOptions), contentOptions);
    initPopper();
    return {
      update(newContentOptions) {
        options = Object.assign(
          Object.assign({}, initOptions),
          newContentOptions
        );
        if (popperInstance && options) {
          popperInstance.setOptions(options);
        }
      },
      destroy() {
        deinitPopper();
      }
    };
  };
  return [referenceAction, contentAction, () => popperInstance];
}
const createContext = () => writable({});
const Dropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let subItemIsActive;
  let classes;
  let handleToggle;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "active",
    "autoClose",
    "direction",
    "dropup",
    "group",
    "inNavbar",
    "isOpen",
    "nav",
    "setActiveFromChild",
    "size",
    "toggle"
  ]);
  const noop = () => void 0;
  let context = createContext();
  setContext("dropdownContext", context);
  const navbarContext = getContext("navbar");
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { autoClose = true } = $$props;
  let { direction = "down" } = $$props;
  let { dropup = false } = $$props;
  let { group = false } = $$props;
  let { inNavbar = navbarContext ? navbarContext.inNavbar : false } = $$props;
  let { isOpen = false } = $$props;
  let { nav = false } = $$props;
  let { setActiveFromChild = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  const [popperRef, popperContent] = createPopperActions();
  const validDirections = ["up", "down", "left", "right", "start", "end"];
  if (validDirections.indexOf(direction) === -1) {
    throw new Error(`Invalid direction sent: '${direction}' is not one of 'up', 'down', 'left', 'right', 'start', 'end'`);
  }
  let component;
  let dropdownDirection;
  function handleDocumentClick(e) {
    if (e && (e.which === 3 || e.type === "keyup" && e.which !== 9))
      return;
    if (component.contains(e.target) && component !== e.target && (e.type !== "keyup" || e.which === 9)) {
      return;
    }
    if (autoClose === true || autoClose === "inside") {
      handleToggle(e);
    }
  }
  onDestroy(() => {
    if (typeof document !== "undefined") {
      ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
    }
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.autoClose === void 0 && $$bindings.autoClose && autoClose !== void 0)
    $$bindings.autoClose(autoClose);
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.dropup === void 0 && $$bindings.dropup && dropup !== void 0)
    $$bindings.dropup(dropup);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.inNavbar === void 0 && $$bindings.inNavbar && inNavbar !== void 0)
    $$bindings.inNavbar(inNavbar);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0)
    $$bindings.nav(nav);
  if ($$props.setActiveFromChild === void 0 && $$bindings.setActiveFromChild && setActiveFromChild !== void 0)
    $$bindings.setActiveFromChild(setActiveFromChild);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  subItemIsActive = !!(setActiveFromChild && component && typeof component.querySelector === "function" && component.querySelector(".active"));
  {
    {
      if (direction === "left")
        dropdownDirection = "start";
      else if (direction === "right")
        dropdownDirection = "end";
      else
        dropdownDirection = direction;
    }
  }
  handleToggle = toggle || (() => isOpen = !isOpen);
  classes = classnames(className, direction !== "down" && `drop${dropdownDirection}`, nav && active ? "active" : false, setActiveFromChild && subItemIsActive ? "active" : false, {
    "btn-group": group,
    [`btn-group-${size}`]: !!size,
    dropdown: !group,
    show: isOpen,
    "nav-item": nav
  });
  {
    {
      if (typeof document !== "undefined") {
        if (isOpen) {
          ["click", "touchstart", "keyup"].forEach((event) => document.addEventListener(event, handleDocumentClick, true));
        } else {
          ["click", "touchstart", "keyup"].forEach((event) => document.removeEventListener(event, handleDocumentClick, true));
        }
      }
    }
  }
  {
    {
      context.update(() => {
        return {
          toggle: handleToggle,
          isOpen,
          autoClose,
          direction: direction === "down" && dropup ? "up" : direction,
          inNavbar: nav || inNavbar,
          popperRef: nav ? noop : popperRef,
          popperContent: nav ? noop : popperContent
        };
      });
    }
  }
  return `${nav ? `<li${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}${add_attribute("this", component, 0)}>${slots.default ? slots.default({}) : ``}</li>` : `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}${add_attribute("this", component, 0)}>${slots.default ? slots.default({}) : ``}</div>`}`;
});
const DropdownItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "active", "disabled", "divider", "header", "toggle", "href"]);
  let $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => value);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { disabled = false } = $$props;
  let { divider = false } = $$props;
  let { header = false } = $$props;
  let { toggle = true } = $$props;
  let { href = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.divider === void 0 && $$bindings.divider && divider !== void 0)
    $$bindings.divider(divider);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, {
    disabled,
    "dropdown-item": !divider && !header,
    active,
    "dropdown-header": header,
    "dropdown-divider": divider
  });
  $$unsubscribe_context();
  return `${header ? `<h6${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</h6>` : `${divider ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>` : `${href ? `<a${spread(
    [
      escape_object($$restProps),
      { click: true },
      { href: escape_attribute_value(href) },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</a>` : `<button${spread(
    [
      { type: "button" },
      escape_object($$restProps),
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</button>`}`}`}`;
});
const DropdownMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "dark", "end", "right"]);
  let $context, $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => $context = value);
  let { class: className = "" } = $$props;
  let { dark = false } = $$props;
  let { end = false } = $$props;
  let { right = false } = $$props;
  const popperPlacement = (direction, end2) => {
    let prefix = direction;
    if (direction === "up")
      prefix = "top";
    else if (direction === "down")
      prefix = "bottom";
    let suffix = end2 ? "end" : "start";
    return `${prefix}-${suffix}`;
  };
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0)
    $$bindings.dark(dark);
  if ($$props.end === void 0 && $$bindings.end && end !== void 0)
    $$bindings.end(end);
  if ($$props.right === void 0 && $$bindings.right && right !== void 0)
    $$bindings.right(right);
  ({
    modifiers: [
      { name: "flip" },
      {
        name: "offset",
        options: { offset: [0, 2] }
      }
    ],
    placement: popperPlacement($context.direction, end || right)
  });
  classes = classnames(className, "dropdown-menu", {
    "dropdown-menu-dark": dark,
    "dropdown-menu-end": end || right,
    show: $context.isOpen
  });
  $$unsubscribe_context();
  return `<div${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      {
        "data-bs-popper": escape_attribute_value($context.inNavbar ? "static" : void 0)
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const DropdownToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let btnClasses;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "ariaLabel",
    "active",
    "block",
    "caret",
    "color",
    "disabled",
    "inner",
    "nav",
    "outline",
    "size",
    "split",
    "tag"
  ]);
  let $context, $$unsubscribe_context;
  const context = getContext("dropdownContext");
  $$unsubscribe_context = subscribe(context, (value) => $context = value);
  let { class: className = "" } = $$props;
  let { ariaLabel = "Toggle Dropdown" } = $$props;
  let { active = false } = $$props;
  let { block = false } = $$props;
  let { caret = false } = $$props;
  let { color = "secondary" } = $$props;
  let { disabled = false } = $$props;
  let { inner = void 0 } = $$props;
  let { nav = false } = $$props;
  let { outline = false } = $$props;
  let { size = "" } = $$props;
  let { split = false } = $$props;
  let { tag = null } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  if ($$props.caret === void 0 && $$bindings.caret && caret !== void 0)
    $$bindings.caret(caret);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.nav === void 0 && $$bindings.nav && nav !== void 0)
    $$bindings.nav(nav);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.split === void 0 && $$bindings.split && split !== void 0)
    $$bindings.split(split);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classnames(className, {
    "dropdown-toggle": caret || split,
    "dropdown-toggle-split": split,
    "nav-link": nav
  });
  btnClasses = classnames(classes, "btn", `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, { active });
  $$unsubscribe_context();
  return `${nav ? `<a${spread(
    [
      escape_object($$restProps),
      { href: "#nav" },
      {
        "aria-expanded": escape_attribute_value($context.isOpen)
      },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape(ariaLabel)}</span>
    `}</a>` : `${tag === "div" ? `<div${spread(
    [
      escape_object($$restProps),
      {
        "aria-expanded": escape_attribute_value($context.isOpen)
      },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape(ariaLabel)}</span>
    `}</div>` : `${tag === "span" ? `<span${spread(
    [
      escape_object($$restProps),
      {
        "aria-expanded": escape_attribute_value($context.isOpen)
      },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape(ariaLabel)}</span>
    `}</span>` : `<button${spread(
    [
      escape_object($$restProps),
      { type: "button" },
      {
        "aria-expanded": escape_attribute_value($context.isOpen)
      },
      {
        class: escape_attribute_value(btnClasses)
      }
    ],
    {}
  )}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      <span class="${"visually-hidden"}">${escape(ariaLabel)}</span>
    `}</button>`}`}`}`;
});
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "name"]);
  let { class: className = "" } = $$props;
  let { name = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  classes = classnames(className, `bi-${name}`);
  return `<i${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}></i>`;
});
const Submenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items } = $$props;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  return `${validate_component(Dropdown, "Dropdown").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(DropdownToggle, "DropdownToggle").$$render($$result, { tag: "div", class: "d-inline-block" }, {}, {
        default: () => {
          return `${validate_component(Icon, "Icon").$$render($$result, { name: "three-dots" }, {}, {})}`;
        }
      })}
	${validate_component(DropdownMenu, "DropdownMenu").$$render($$result, {}, {}, {
        default: () => {
          return `${each(items, (item) => {
            return `${validate_component(DropdownItem, "DropdownItem").$$render($$result, { href: item.url }, {}, {
              default: () => {
                return `${escape(item.text)}`;
              }
            })}`;
          })}`;
        }
      })}`;
    }
  })}`;
});
const ContentTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { columns } = $$props;
  let { data } = $$props;
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(Table, "Table").$$render($$result, { hover: true }, {}, {
    default: () => {
      return `<thead><tr>${each(columns, (col) => {
        return `<th>${escape(col.label)}</th>`;
      })}
			${data && "items" in data[0] ? `<th></th>` : ``}</tr></thead>
	<tbody>${each(data, (row) => {
        return `<tr>${each(columns, (col) => {
          return `<td>${escape(row[col.key])}</td>`;
        })}
				<td>${"items" in row ? `${validate_component(Submenu, "Submenu").$$render($$result, { items: row.items }, {}, {})}` : ``}</td>
			</tr>`;
      })}</tbody>`;
    }
  })}`;
});
export {
  ContentTable as C
};
