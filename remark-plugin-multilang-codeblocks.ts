import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root, Code, RootContent } from "mdast";
import type { Node } from "unist";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";

const multilangCodeblocks: Plugin<[], Root> = () => {
  loadLanguages();

  return (tree) => {
    visit(tree, "root", (node: Root) => {
      let codeBlockGroup: Code[] = [];

      node.children = node.children.reduce((acc, current) => {
        if (current.type === "code") {
          codeBlockGroup.push(current as Code);
        } else {
          if (codeBlockGroup.length > 0) {
            acc.push(createMultiLangNode(codeBlockGroup));
            codeBlockGroup = [];
          }
          acc.push(current);
        }
        return acc;
      }, [] as Node[]) as RootContent[];

      if (codeBlockGroup.length > 0) {
        node.children.push(createMultiLangNode(codeBlockGroup) as RootContent);
      }
    });
  };
};

// shorthand, full name, prism language
const languageMap: Array<[string, string, string]> = [
  ["js", "Javascript", "javascript"],
  ["cpp", "C++", "cpp"],
  ["c", "C", "c"],
  ["glsl", "GLSL", "glsl"],
  ["rust", "Rust", "rust"],
  ["python", "Python", "python"],
  ["py", "Python", "python"],
  ["csharp", "C#", "csharp"],
  ["cs", "C#", "csharp"],
  ["shell", "Shell", "bash"],
  ["sh", "Shell", "bash"],
  ["bash", "Shell", "bash"],
  ["batch", "Batch", "batch"],
];

function getCodeLangName(shorthand: string | null | undefined): string {
  if (!shorthand) return "Unknown";
  const lang = languageMap.find(([short]) => short === shorthand);
  return lang ? lang[1] : shorthand;
}

function getPrismLangName(shorthand: string | null | undefined): string | null {
  if (!shorthand) return null;
  const lang = languageMap.find(([short]) => short === shorthand);
  return lang ? lang[2] : null;
}

function escapeHTML(str: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
  };

  return str.replace(/[&<]/g, function (m) {
    return map[m];
  });
}

const createMultiLangNode = (codeBlocks: Code[]): Node => {
  return {
    type: "html",
    value: `
      <div class="multilang-codeblock">
        <div class="head">
          ${codeBlocks.map((block, index) => `<button class="multilang-codeblock-tab ${index === 0 ? "active" : ""}" data-tab=${index}><span>${getCodeLangName(block.lang)}</span></button>`).join("")}
        </div>
        <div class="body">
          ${codeBlocks.map((block, index) => `<div data-tab=${index} class="${index === 0 ? "active" : ""}"><pre class="langauge-${block.lang}"><code class="langauge-${block.lang}">${generateHighlightedHTML(block.value, block.lang)}</code></pre></div>`).join("")}
        </div>
      </div>
    `,
  } as Node;
};

function generateHighlightedHTML(
  code: string,
  lang: string | undefined | null,
): string {
  if (!lang) return escapeHTML(code);
  if (lang === "plaintext") return escapeHTML(code);
  const prismlang = getPrismLangName(lang) || "plaintext";
  if (lang === "plaintext") return escapeHTML(code);
  return Prism.highlight(code, Prism.languages[prismlang], prismlang);
}

export default multilangCodeblocks;
