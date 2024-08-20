import hljs from "highlight.js";
import "@/styles/hl.css";

export default function highlightjs(code: any, lang: any) {
  if (lang == "提示1" || lang == "提示2") {
    return code;
  }
  return hljs.highlight(code, { language: lang }).value;
}
