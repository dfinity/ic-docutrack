import { c as create_ssr_component, b as compute_rest_props, d as createEventDispatcher, e as spread, f as escape_attribute_value, g as escape_object, s as setContext, v as validate_component, h as escape } from "../../chunks/index.js";
import { c as classnames, p as principal, f as firstName } from "../../chunks/auth.js";
/* empty css                                                    */import { B as Button } from "../../chunks/Button.js";
const Collapse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "isOpen",
    "class",
    "horizontal",
    "navbar",
    "onEntering",
    "onEntered",
    "onExiting",
    "onExited",
    "expand",
    "toggler"
  ]);
  const dispatch = createEventDispatcher();
  let { isOpen = false } = $$props;
  let { class: className = "" } = $$props;
  let { horizontal = false } = $$props;
  let { navbar = false } = $$props;
  let { onEntering = () => dispatch("opening") } = $$props;
  let { onEntered = () => dispatch("open") } = $$props;
  let { onExiting = () => dispatch("closing") } = $$props;
  let { onExited = () => dispatch("close") } = $$props;
  let { expand = false } = $$props;
  let { toggler = null } = $$props;
  let windowWidth = 0;
  let _wasMaximized = false;
  const minWidth = {};
  minWidth["xs"] = 0;
  minWidth["sm"] = 576;
  minWidth["md"] = 768;
  minWidth["lg"] = 992;
  minWidth["xl"] = 1200;
  function notify() {
    dispatch("update", isOpen);
  }
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0)
    $$bindings.horizontal(horizontal);
  if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0)
    $$bindings.navbar(navbar);
  if ($$props.onEntering === void 0 && $$bindings.onEntering && onEntering !== void 0)
    $$bindings.onEntering(onEntering);
  if ($$props.onEntered === void 0 && $$bindings.onEntered && onEntered !== void 0)
    $$bindings.onEntered(onEntered);
  if ($$props.onExiting === void 0 && $$bindings.onExiting && onExiting !== void 0)
    $$bindings.onExiting(onExiting);
  if ($$props.onExited === void 0 && $$bindings.onExited && onExited !== void 0)
    $$bindings.onExited(onExited);
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.toggler === void 0 && $$bindings.toggler && toggler !== void 0)
    $$bindings.toggler(toggler);
  classes = classnames(className, {
    "collapse-horizontal": horizontal,
    "navbar-collapse": navbar
  });
  {
    if (navbar && expand) {
      if (windowWidth >= minWidth[expand] && !isOpen) {
        isOpen = true;
        _wasMaximized = true;
        notify();
      } else if (windowWidth < minWidth[expand] && _wasMaximized) {
        isOpen = false;
        _wasMaximized = false;
        notify();
      }
    }
  }
  return `

${isOpen ? `<div${spread(
    [
      {
        style: escape_attribute_value(navbar ? void 0 : "overflow: hidden;")
      },
      escape_object($$restProps),
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>` : ``}`;
});
const Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "sm", "md", "lg", "xl", "xxl", "fluid"]);
  let { class: className = "" } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  let { fluid = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
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
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  classes = classnames(className, {
    "container-sm": sm,
    "container-md": md,
    "container-lg": lg,
    "container-xl": xl,
    "container-xxl": xxl,
    "container-fluid": fluid,
    container: !sm && !md && !lg && !xl && !xxl && !fluid
  });
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
function getVerticalClass(vertical) {
  if (vertical === false) {
    return false;
  } else if (vertical === true || vertical === "xs") {
    return "flex-column";
  }
  return `flex-${vertical}-column`;
}
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "tabs",
    "pills",
    "vertical",
    "horizontal",
    "justified",
    "fill",
    "navbar",
    "card"
  ]);
  let { class: className = "" } = $$props;
  let { tabs = false } = $$props;
  let { pills = false } = $$props;
  let { vertical = false } = $$props;
  let { horizontal = "" } = $$props;
  let { justified = false } = $$props;
  let { fill = false } = $$props;
  let { navbar = false } = $$props;
  let { card = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.tabs === void 0 && $$bindings.tabs && tabs !== void 0)
    $$bindings.tabs(tabs);
  if ($$props.pills === void 0 && $$bindings.pills && pills !== void 0)
    $$bindings.pills(pills);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.horizontal === void 0 && $$bindings.horizontal && horizontal !== void 0)
    $$bindings.horizontal(horizontal);
  if ($$props.justified === void 0 && $$bindings.justified && justified !== void 0)
    $$bindings.justified(justified);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.navbar === void 0 && $$bindings.navbar && navbar !== void 0)
    $$bindings.navbar(navbar);
  if ($$props.card === void 0 && $$bindings.card && card !== void 0)
    $$bindings.card(card);
  classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    "nav-tabs": tabs,
    "card-header-tabs": card && tabs,
    "nav-pills": pills,
    "card-header-pills": card && pills,
    "nav-justified": justified,
    "nav-fill": fill
  });
  return `<ul${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</ul>`;
});
function getExpandClass(expand) {
  if (expand === false) {
    return false;
  } else if (expand === true || expand === "xs") {
    return "navbar-expand";
  }
  return `navbar-expand-${expand}`;
}
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "container", "color", "dark", "expand", "fixed", "light", "sticky"]);
  setContext("navbar", { inNavbar: true });
  let { class: className = "" } = $$props;
  let { container = "fluid" } = $$props;
  let { color = "" } = $$props;
  let { dark = false } = $$props;
  let { expand = "" } = $$props;
  let { fixed = "" } = $$props;
  let { light = false } = $$props;
  let { sticky = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0)
    $$bindings.dark(dark);
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.fixed === void 0 && $$bindings.fixed && fixed !== void 0)
    $$bindings.fixed(fixed);
  if ($$props.light === void 0 && $$bindings.light && light !== void 0)
    $$bindings.light(light);
  if ($$props.sticky === void 0 && $$bindings.sticky && sticky !== void 0)
    $$bindings.sticky(sticky);
  classes = classnames(className, "navbar", getExpandClass(expand), {
    "navbar-light": light,
    "navbar-dark": dark,
    [`bg-${color}`]: color,
    [`fixed-${fixed}`]: fixed,
    [`sticky-${sticky}`]: sticky
  });
  return `<nav${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${container ? `${validate_component(Container, "Container").$$render($$result, { fluid: container === "fluid" }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}` : `${slots.default ? slots.default({}) : ``}`}</nav>`;
});
const NavItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "active"]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  classes = classnames(className, "nav-item", active ? "active" : false);
  return `<li${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</li>`;
});
const NavLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "disabled", "active", "href"]);
  let { class: className = "" } = $$props;
  let { disabled = false } = $$props;
  let { active = false } = $$props;
  let { href = "#" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, "nav-link", { disabled, active });
  return `<a${spread(
    [
      escape_object($$restProps),
      { href: escape_attribute_value(href) },
      { class: escape_attribute_value(classes) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</a>`;
});
const NavbarBrand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "href"]);
  let { class: className = "" } = $$props;
  let { href = "/" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  classes = classnames(className, "navbar-brand");
  return `<a${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { href: escape_attribute_value(href) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</a>`;
});
const NavbarToggler = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "navbar-toggler");
  return `${validate_component(Button, "Button").$$render($$result, Object.assign($$restProps, { class: classes }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : `
    <span class="${"navbar-toggler-icon"}"></span>
  `}`;
    }
  })}`;
});
const Navbar_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let firstNameValue;
  principal.subscribe((value) => value);
  firstName.subscribe((value) => firstNameValue = value);
  let isOpen = false;
  return `${validate_component(Navbar, "Navbar").$$render(
    $$result,
    {
      color: "light",
      light: true,
      expand: "md"
    },
    {},
    {
      default: () => {
        return `${validate_component(NavbarBrand, "NavbarBrand").$$render($$result, { href: "/" }, {}, {
          default: () => {
            return `DocuTrack`;
          }
        })}
	${validate_component(NavbarToggler, "NavbarToggler").$$render($$result, {}, {}, {})}
	${validate_component(Collapse, "Collapse").$$render($$result, { isOpen, navbar: true, expand: "md" }, {}, {
          default: () => {
            return `${firstNameValue ? `${validate_component(Nav, "Nav").$$render($$result, { class: "ms-md-3" }, {}, {
              default: () => {
                return `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `Hi, ${escape(firstNameValue)}`;
                  }
                })}`;
              }
            })}` : ``}
		${validate_component(Nav, "Nav").$$render($$result, { class: "ms-auto", navbar: true }, {}, {
              default: () => {
                return `${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/" }, {}, {
                      default: () => {
                        return `My Files`;
                      }
                    })}`;
                  }
                })}
			${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/requestFile" }, {}, {
                      default: () => {
                        return `Request File`;
                      }
                    })}`;
                  }
                })}
			${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/activity" }, {}, {
                      default: () => {
                        return `Activity`;
                      }
                    })}`;
                  }
                })}
			${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/requests" }, {}, {
                      default: () => {
                        return `Requests`;
                      }
                    })}`;
                  }
                })}
			${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(NavLink, "NavLink").$$render($$result, { href: "/upload" }, {}, {
                      default: () => {
                        return `Upload File`;
                      }
                    })}`;
                  }
                })}
			${validate_component(NavItem, "NavItem").$$render($$result, {}, {}, {
                  default: () => {
                    return `${principal ? `
					${validate_component(NavLink, "NavLink").$$render($$result, { href: "#" }, {}, {
                      default: () => {
                        return `Login`;
                      }
                    })}` : `${validate_component(NavLink, "NavLink").$$render($$result, { href: "#" }, {}, {
                      default: () => {
                        return `Logout`;
                      }
                    })}`}`;
                  }
                })}`;
              }
            })}`;
          }
        })}`;
      }
    }
  )}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"app"}">${validate_component(Navbar_1, "Navbar").$$render($$result, {}, {}, {})}
	${validate_component(Container, "Container").$$render($$result, { class: "pt-4" }, {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}</div>`;
});
export {
  Layout as default
};
