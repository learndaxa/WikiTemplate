import postcssImport from "postcss-import";
import tailwindcssNesting from "@tailwindcss/nesting";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export const plugins = [
  postcssImport(),
  tailwindcssNesting(),
  tailwindcss(),
  autoprefixer(),
];
