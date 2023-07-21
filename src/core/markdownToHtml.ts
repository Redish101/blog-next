import { marked } from "marked";
import highlightjs from "./highlight";

export default async function markdownToHtml(markdown: string) {
  const renderer = new marked.Renderer();

  let toc = []

  renderer.heading = function(text, level, raw, slugger) {
    toc.push({
      text,
      level
    })
    return `
      <h${level} id="${text}">
        ${text}
      </h${level}>
    `
  }

  renderer.code = function (code, language) {
    // 添加hljs类和data-language属性
    let lang = language ? language.toUpperCase() : "";
    if (!language) {
      lang = "TEXT";
    }
    if (language == "") {
      language = "plaintext";
    }
    const highlightedCode = highlightjs(code, language);
    return `<pre class="hljs language-${lang}" data-language="${lang}">
      <code>${highlightedCode}</code>
    </pre>`;
  };
  return marked.parse(markdown, { mangle: false, headerIds: false, renderer });
}
