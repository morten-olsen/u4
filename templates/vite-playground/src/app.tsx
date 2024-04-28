import { ComponentType } from "react";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const pageImports = import.meta.glob<false, string, { Page: ComponentType }>('./pages/**/*.tsx');
const pageRoutes = Object.keys(pageImports).map((path) => {
  const [, routePath] = path.split('./pages');
  const [pageName] = routePath.split('.tsx');
  const pageImport = pageImports[path];
  const withoutIndex = pageName.replace('/index', '');

  return {
    path: withoutIndex === '' ? '/' : withoutIndex,
    lazy: async () => {
      const { Page } = await pageImport();
      return { Component: Page };
    }
  };
});

const router = createHashRouter(pageRoutes);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export { App };
