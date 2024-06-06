import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import playformInline from "@playform/inline";
import qwikdev from "@qwikdev/astro";
import mdx from "@astrojs/mdx";

import multilangCodeblocks from "./remark-plugin-multilang-codeblocks";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    playformCompress(),
    playformInline(),
    qwikdev(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [multilangCodeblocks],
  },
});
