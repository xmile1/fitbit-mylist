import document from "document";

const views = {
  lists: () => import("../views/lists"),
  "list-items": () => import("../views/list-items"),
};

export const _goto = (views) => (viewName) => {
  document.location.replace(`./resources/views/${viewName}.view`);
  views[viewName]().then((module) => {
    module.init({});
  });
};

export const goto = _goto(views);
