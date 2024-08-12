"use client";

import { useEffect } from "react";
import config from "../../site.config";

declare global {
    interface Window {
        twikoo?: any;
    }
}

export default function Comment() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = config.twikoo.js;
        script.async = true;
        script.onload = () => {
            window.twikoo.init({
                envId: config.twikoo.envId,
                el: "#tcomment"
            }
            )
        }

        document.head.appendChild(script);
    }, [])
    return <div id="tcomment">评论正在加载...</div>;
}