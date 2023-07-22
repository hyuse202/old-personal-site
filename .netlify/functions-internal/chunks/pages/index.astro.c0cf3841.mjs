import { _ as __astro_tag_component__, c as createAstro, a as createComponent$1, r as renderTemplate, m as maybeRenderHead, b as renderComponent, d as addAttribute, s as spreadAttributes, u as unescapeHTML, F as Fragment, e as renderHead, f as renderSlot } from '../astro.5f4e473f.mjs';
/* empty css                           */import { Feature, serialize } from 'seroval';
import { optimize } from 'svgo';
import cookie from 'cookie';

const ERROR = Symbol("error");
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const fns = lookup(owner, ERROR);
  const error = castError(err);
  if (!fns) throw error;
  try {
    for (const f of fns) f(error);
  } catch (e) {
    handleError(e, owner?.owner || null);
  }
}
const UNOWNED = {
  context: null,
  owner: null,
  owned: null,
  cleanups: null
};
let Owner = null;
function createRoot(fn, detachedOwner) {
  const owner = Owner,
    root = fn.length === 0 ? UNOWNED : {
      context: null,
      owner: detachedOwner === undefined ? owner : detachedOwner,
      owned: null,
      cleanups: null
    };
  Owner = root;
  let result;
  try {
    result = fn(fn.length === 0 ? () => {} : () => cleanNode(root));
  } catch (err) {
    handleError(err);
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value, options) {
  return [() => value, v => {
    return value = typeof v === "function" ? v(value) : v;
  }];
}
function onCleanup(fn) {
  if (Owner) {
    if (!Owner.cleanups) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  }
  return fn;
}
function cleanNode(node) {
  if (node.owned) {
    for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== undefined ? owner.context[key] : lookup(owner.owner, key) : undefined;
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? {
    ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  } : undefined;
}
function createComponent(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source);
      for (const key in descriptors) {
        if (key in target) continue;
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let s = sources[i] || {};
              if (typeof s === "function") s = s();
              const v = s[key];
              if (v !== undefined) return v;
            }
          }
        });
      }
    }
  }
  return target;
}
function simpleMap(props, wrap) {
  const list = props.each || [],
    len = list.length,
    fn = props.children;
  if (len) {
    let mapped = Array(len);
    for (let i = 0; i < len; i++) mapped[i] = wrap(fn, list[i], i);
    return mapped;
  }
  return props.fallback;
}
function For(props) {
  return simpleMap(props, (fn, item, i) => fn(item, () => i));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.keyed ? props.when : () => props.when) : c : props.fallback || "";
}

const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
const BooleanAttributes = /*#__PURE__*/new Set(booleans);
const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});

const ES2017FLAG = Feature.AggregateError
| Feature.BigInt
| Feature.BigIntTypedArray;
function stringify(data) {
  return serialize(data, {
    disabledFeatures: ES2017FLAG
  });
}

const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
function renderToString(code, options = {}) {
  let scripts = "";
  sharedConfig.context = {
    id: options.renderId || "",
    count: 0,
    suspense: {},
    lazy: {},
    assets: [],
    nonce: options.nonce,
    writeResource(id, p, error) {
      if (sharedConfig.context.noHydrate) return;
      if (error) return scripts += `_$HY.set("${id}", ${stringify(p)});`;
      scripts += `_$HY.set("${id}", ${stringify(p)});`;
    }
  };
  let html = createRoot(d => {
    setTimeout(d);
    return resolveSSRNode(escape(code()));
  });
  sharedConfig.context.noHydrate = true;
  html = injectAssets(sharedConfig.context.assets, html);
  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
  return html;
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
    result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += escape(key);
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  if (props == null) props = {};else if (typeof props === "function") props = props();
  const skipChildren = VOID_ELEMENTS.test(tag);
  const keys = Object.keys(props);
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined && !skipChildren) children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${escape(((n = props.class) ? n + " " : "") + ((n = props.className) ? n + " " : ""), true) + ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  if (skipChildren) return {
    t: result + "/>"
  };
  if (typeof children === "function") children = children();
  return {
    t: result + `>${resolveSSRNode(children, true)}</${tag}>`
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s());
    if (!attr && Array.isArray(s)) {
      for (let i = 0; i < s.length; i++) s[i] = escape(s[i]);
      return s;
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node, top) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let prev = {};
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) {
      if (!top && typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
      mapped += resolveSSRNode(prev = node[i]);
    }
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function Portal(props) {
  return "";
}

const NAV_LINKS = [
  { to: "/", label: "~/Home" },
  { to: "/projects", label: "~/Projects" }
];
const MAXIMUM_THEME_INDEX = 7;
const THEME_COOKIE_NAME = "__theme_nfz";

const _tmpl$$1 = "<div class=\"sb-handle-container\"><div class=\"sb-handle\"></div></div>",
  _tmpl$2$1 = ["<div", " class=\"sb-overlay\">", "</div>"];
const SolidBottomsheet = props => {
  const isSnapVariant = props.variant === "snap";
  const [maxHeight, setMaxHeight] = createSignal(window.visualViewport.height);
  const [isClosing, setIsClosing] = createSignal(false);
  const [isSnapping, setIsSnapping] = createSignal(false);
  const getDefaultTranslateValue = () => {
    if (isSnapVariant) {
      const defaultValue = props.defaultSnapPoint({
        maxHeight: maxHeight()
      });
      if (defaultValue !== maxHeight()) {
        return window.innerHeight - defaultValue;
      }
    }
    return 0;
  };
  const [bottomsheetTranslateValue, setBottomsheetTranslateValue] = createSignal(getDefaultTranslateValue());
  const onViewportChange = () => {
    setMaxHeight(window.visualViewport.height);
  };
  onCleanup(() => {
    document.body.classList.remove("sb-overflow-hidden");
    window.visualViewport.removeEventListener("resize", onViewportChange);
  });
  return createComponent(Portal, {
    get children() {
      return ssr(_tmpl$2$1, ssrHydrationKey(), ssrElement("div", mergeProps({
        get classList() {
          return {
            "sb-content": true,
            "sb-is-closing": isClosing(),
            "sb-is-snapping": isSnapping()
          };
        },
        get style() {
          return {
            transform: `translateY(${bottomsheetTranslateValue()}px)`,
            ...(isSnapVariant ? {
              height: `${maxHeight()}px`
            } : {})
          };
        }
      }, () => isClosing() ? {
        onAnimationEnd: props.onClose
      } : {}), () => [ssr(_tmpl$$1), "<!--#-->", escape(props.children), "<!--/-->"], false));
    }
  });
};

__astro_tag_component__(SolidBottomsheet, "@astrojs/solid-js");

const _tmpl$ = ["<button", " class=\"font-bold text-slate-11 text-xl\"><a href=\"javascript:void(0);\" class=\"icon\"><i class=\"fa fa-bars\"></i></a></button>"],
  _tmpl$2 = ["<div", " class=\"px-2\"><div class=\"grid gap-1 py-8\"><nav class=\"grid gap-3 text-2xl\">", "</nav></div></div>"],
  _tmpl$3 = ["<a", " class=\"", "\">", "</a>"];
function MobileMenu(props) {
  const {
    path
  } = props;
  const [isOpen, setOpen] = createSignal(false);
  return [ssr(_tmpl$, ssrHydrationKey()), createComponent(Show, {
    get when() {
      return isOpen();
    },
    get children() {
      return createComponent(SolidBottomsheet, {
        variant: "snap",
        defaultSnapPoint: ({
          maxHeight
        }) => maxHeight / 4,
        snapPoints: ({
          maxHeight
        }) => [maxHeight, maxHeight / 4],
        onClose: () => setOpen(false),
        get children() {
          return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(For, {
            each: NAV_LINKS,
            children: (item, index) => ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("href", escape(item.to, true), false), path === item.to ? "font-bold theme-txt" : "", escape(item.label))
          })));
        }
      });
    }
  })];
}

__astro_tag_component__(MobileMenu, "@astrojs/solid-js");

const $$Astro$b = createAstro();
const $$Index$3 = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Index$3;
  const pathname = new URL(Astro2.request.url).pathname;
  return renderTemplate`${maybeRenderHead()}<div class="w-full max-w-3xl mt-20">
  <a class="hidden md:flex text-sm items-center text-slate-11 justify-center">
    <em>Build with love and balance.</em>
  </a>
</div>
<div class="md:hidden fixed bottom-6 right-0 left-0 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
  <div class="w-full max-w-3xl rounded-3xl shadow-xl relative z-10 dark:bg-blackA-11 bg-whiteA-10">
    <div class="px-4 py-4 flex justify-between items-center">
      <div>
        <div class="text-xs flex items-center text-slate-11">
          <em> Build with love and balance.</em>
        </div>
      </div>
      <div class="flex justify-end">
        ${renderComponent($$result, "MobileMenu", MobileMenu, { "path": pathname, "client:media": "(max-width: 768px)", "client:component-hydration": "media", "client:component-path": "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/bottom-nav/mobile-menu", "client:component-export": "default" })}
      </div>
    </div>
  </div>
</div>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/bottom-nav/index.astro");

const $$Astro$a = createAstro();
const $$Navlinks = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Navlinks;
  const pathname = new URL(Astro2.request.url).pathname;
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center gap-x-2">
  ${NAV_LINKS.map((item) => renderTemplate`<a class="font-normal text-slate-11 rounded-lg p-1 transition duration-100 ease-in hover:bg-slate-3 sm:px-3 sm:py-2 md:inline-block"${addAttribute(item.to, "href")}${addAttribute(`${pathname === item.to ? "page" : "false"}`, "aria-current")}>
        ${item.label}
      </a>`)}
</div>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/navbar/Navlinks.astro");

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$9 = createAstro();
const $$Icon = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/node_modules/astro-icon/lib/Icon.astro");

const AstroIcon = Symbol("AstroIcon");
function trackSprite(result, name) {
  if (typeof result[AstroIcon] !== "undefined") {
    result[AstroIcon]["sprites"].add(name);
  } else {
    result[AstroIcon] = {
      sprites: /* @__PURE__ */ new Set([name])
    };
  }
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(result) {
  if (typeof result[AstroIcon] !== "undefined") {
    return Array.from(result[AstroIcon]["sprites"]);
  }
  const pathname = result._metadata.pathname;
  if (!warned.has(pathname)) {
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(pathname);
  }
  return [];
}

const $$Astro$8 = createAstro();
const $$Spritesheet = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites($$result);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`display: none; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$7 = createAstro();
const $$SpriteProvider = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$6 = createAstro();
const $$Sprite = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite($$result, name);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$5 = createAstro();
const $$DarkModeToggle = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$DarkModeToggle;
  return renderTemplate`${maybeRenderHead()}<button type="button" class="flex items-center p-1 rounded-md theme-btn" aria-label="toggle dark mode" id="dark-mode-toggle">
  <span class="dark:hidden block">
    ${renderComponent($$result, "Icon", $$Icon, { "name": "feather:moon", "aria-hidden": true, "class": "h-5 w-5" })}
  </span>
  <span class="dark:block hidden">
    ${renderComponent($$result, "Icon", $$Icon, { "name": "feather:sun", "aria-hidden": true, "class": "h-5 w-5" })}
  </span>
</button>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/navbar/dark-mode-toggle.astro");

const $$Astro$4 = createAstro();
const $$ThemeToggle = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ThemeToggle;
  return renderTemplate`${maybeRenderHead()}<button type="button" aria-label="toggle theme color" class="p-3 rounded-full theme-bg" id="theme-toggle"></button>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/navbar/theme-toggle.astro");

const $$Astro$3 = createAstro();
const $$Index$2 = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$2;
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center w-full justify-between px-7 md:px-32 mt-8 mb-14">
  <div>
    ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, {})}
  </div>
  <div class="md:block hidden">
    ${renderComponent($$result, "Navlinks", $$Navlinks, {})}
  </div>
  <div>
    ${renderComponent($$result, "DarkModeToggle", $$DarkModeToggle, {})}
  </div>
</div>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/navbar/index.astro");

function getThemeCookie(headers) {
  const cookie_ = headers.get("cookie") ?? "";
  const parsed = cookie.parse(cookie_);
  if (parsed[THEME_COOKIE_NAME]) {
    const value = JSON.parse(parsed[THEME_COOKIE_NAME]);
    return value;
  }
  return null;
}

const $$Astro$2 = createAstro();
const $$Layout = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const theme_ = getThemeCookie(Astro2.request.headers);
  const {
    title,
    maxThemeIndex = MAXIMUM_THEME_INDEX,
    theme = theme_
  } = Astro2.props;
  return renderTemplate`<html lang="en"${addAttribute(maxThemeIndex, "data-max-theme-index")}${addAttribute(JSON.stringify(theme), "data-theme")}${addAttribute(theme?.mode ?? "", "class")}${addAttribute(theme?.theme ?? 1, "data-theme-index")}>
  <head>
    <meta charset="UTF-8">
    <title>Hyuse-${title}</title>
    <meta content="UI developer interested in design systems and Interfaces." name="description">
    <meta content="#FFF" name="theme-color">
    <meta content="width=device-width,initial-scale=1,viewport-fit=cover" name="viewport">
    <link rel="icon" href="/static/og.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
  ${renderHead()}</head>

  <body>
    ${renderComponent($$result, "Navbar", $$Index$2, {})}
    <main class="flex flex-col px-7 md:px-32 mb-10 sm:mb-0">
      ${renderSlot($$result, $$slots["default"])}
    </main>
    ${renderComponent($$result, "BottomNav", $$Index$3, {})}
  </body></html>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/layouts/Layout.astro");

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const Links = [
    {
      icon: "feather:github",
      label: "github account",
      href: "https://github.com/hyuse202"
    },
    {
      icon: "feather:mail",
      label: "mail link",
      href: "mailto:buinguyentanhuy2002@gmail.com"
    },
    {
      icon: "feather:instagram",
      label: "instagram account",
      href: "https://www.instagram.com/mc_hyuse202/"
    },
    {
      icon: "feather:twitter",
      label: "twitter account",
      href: "https://twitter.com/TlHuy1"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div data-animate style="--stagger:3" class="flex items-center gap-x-2 mt-5">
  ${Links.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(item.label, "aria-label")} class="flex items-center p-1.5 rounded-md theme-btn" target="_blank" rel="noopener noreferrer">
        ${renderComponent($$result, "Icon", $$Icon, { "name": item.icon, "aria-hidden": true, "class": "h-5 w-5" })}
      </a>`)}
</div>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/social-links/index.astro");

const $$Astro = createAstro();
const $$Index = createComponent$1(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Developer" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<section class="flex flex-col sm:mb-0 mb-20">
    <!-- <div class="mb-4 hidden md:block">
      <Image
        format="webp"
        src={import("../assets/image-2.jpg")}
        class="rounded-full"
        width={100}
        height={100}
        align-item: 
        alt="potrait"
      />
    </div> -->
    <h1 data-animate style="--stagger:1" class="text-5xl font-extrabold tracking-tighter sm:text-7xl mb-16 max-w-3xl">
      Halo, hyuse here.
    </h1>

    <div data-animate style="--stagger:2" class="font-mono flex flex-col gap-y-1 text-sm sm:text-base sm:max-w-xl max-w-72 text-slate11 text-slate11">
      <p>
        I'm a highschooler and self-taught developer based in
        <a class="rounded-md hover:bg-slate-5" href="https://en.wikipedia.org/wiki/Vietnam" target="_blank">Vietnam</a>, inspired by
        <u>
          <a class="rounded-md hover:bg-slate-5" href="https://github.com/geohot" target="_blank">
            @geohotz</a>
        </u>
        and
        <u>
          <a class="rounded-md hover:bg-slate-5" href="https://twitch.tv/gmhikaru" target="_blank">@gmhikaru</a>
        </u>
        <br>
        Currently working with Typescript, NodeJs and Linux.<br>
        Outside of work, I'm interested in playing games and reading seinen mangas.
      </p>
    </div>
    ${renderComponent($$result2, "SocialLinks", $$Index$1, {})}
  </section>
` })}`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/pages/index.astro");

const $$file = "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/pages/index.astro";
const $$url = "";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, createComponent as c, index as i, renderToString as r, ssr as s };
