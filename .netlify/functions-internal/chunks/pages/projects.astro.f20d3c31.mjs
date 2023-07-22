import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, d as addAttribute, b as renderComponent } from '../astro.5f4e473f.mjs';
import { $ as $$Layout } from './index.astro.c0cf3841.mjs';
import 'cookie';
import 'kleur/colors';
import '@astrojs/internal-helpers/path';
import 'path-to-regexp';
import 'mime';
import 'html-escaper';
import 'string-width';
/* empty css                           */import 'seroval';
import 'svgo';

const $$Astro$4 = createAstro();
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index$1;
  const { title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<h1 data-animate style="--stagger:1" class="mb-4 text-3xl font-extrabold tracking-tight md:text-5xl">
  ${title}
</h1>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/page-title/index.astro");

const $$Astro$3 = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index;
  const { content } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<p data-animate style="--stagger:2" class="mb-4 max-w-lg font-mono">
  ${content}
</p>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/components/page-subtitle/index.astro");

const data = [
  {
    id: "1",
    title: "Website",
    Projects: [
      {
        id: true,
        title: "manga-lib",
        description: "Nodejs lib that easily scrape manga content from various websites",
        link: "https://github.com/hyuse202/manga-lib"
      },
      {
        id: true,
        title: "Kuku manga",
        description: "Not published at this time",
        link: "null"
      },
      {
        id: true,
        title: "Meflix",
        decription: "A Netflix clone using Nextjs and TMDB api",
        link: "https://meflix-hyuse.vercel.app"
      }
    ]
  },
  {
    id: "2",
    title: "Personal stuff",
    Projects: [
      {
        id: true,
        title: "Dotfile",
        description: "Gnome X11 ricing",
        link: "https://github.com/hyuse202/dotfiles"
      },
      {
        id: true,
        title: "Personal site",
        description: "My astro personal site",
        link: "https://github.com/hyuse202/personal-site"
      }
    ]
  }
];

const $$Astro$2 = createAstro();
const $$ProjectCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProjectCard;
  const { title, description, link } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(link, "href")} target="_blank" rel="noopener noreferrer" class="py-4 px-3 hover:bg-slate-5 rounded-md"${addAttribute(title, "aria-label")}>
  <div class="text-lg font-bold">${title}</div>
  <div class="mt-2 font-mono text-slate-11 text-sm">${description}</div>
</a>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/features/projects-page/components/project-card.astro");

const $$Astro$1 = createAstro();
const $$ProjectList = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProjectList;
  return renderTemplate`${maybeRenderHead()}<div class="mb-5">
  ${data.map((item) => renderTemplate`<div>
        <h2 data-animate class="mt-10 text-2xl  font-extrabold tracking-tight ">
          ${item.title}
        </h2>

        <div data-animate${addAttribute({ "--stagger": 3 }, "style")} class="grid grid-cols-1 md:grid-cols-3 mt-2">
          ${item.Projects.map((project) => renderTemplate`${renderComponent($$result, "ProjectCard", $$ProjectCard, { "description": project.description, "link": project.link, "title": project.title })}`)}
        </div>
      </div>`)}
</div>`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/features/projects-page/components/project-list.astro");

const $$Astro = createAstro();
const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Projects;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projects" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="flex flex-col">
    ${renderComponent($$result2, "PageTitle", $$Index$1, { "title": "Projects" })}
    ${renderComponent($$result2, "PageSubtitle", $$Index, { "content": "List of projects I recently worked on and working on." })}
    ${renderComponent($$result2, "ProjectList", $$ProjectList, { "data": data })}
  </div>
` })}`;
}, "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/pages/projects.astro");

const $$file = "/home/hysue202/__.Workspace__/Personal_site/hyuse202/src/pages/projects.astro";
const $$url = "/projects";

export { $$Projects as default, $$file as file, $$url as url };
