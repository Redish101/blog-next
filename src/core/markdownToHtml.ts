import { marked } from "marked";
import highlightjs from "./highlight";
import md5 from "md5";

export default async function markdownToHtml(markdown: string) {
  const renderer = new marked.Renderer();

  let toc = []

  renderer.heading = function(text, level, raw, slugger) {
    toc.push({
      text,
      level
    })
    let hashedText = md5(text).slice(0, 12)
    return `
      <h${level} id="${hashedText}">
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
