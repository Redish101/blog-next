import hljs from "highlight.js";
import "@/styles/hl.css";

export default function highlightjs(code: any, lang: any) {
  return hljs.highlight(code, { language: lang }).value;
}
