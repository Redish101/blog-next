"use client";

import { useEffect, useState } from "react";
import config from "../../site.config";

export default function Comment() {
  const [loadingStatus, setLoadingStatus] = useState<"loading" | "error">(
    "loading",
  );
  useEffect(() => {
    import("twikoo")
      .then(({ default: init }) => {
        init({
          envId: config.twikoo.envId,
          el: "#tcomment",
        });
      })
      .catch((error) => {
        setLoadingStatus("error");
        console.error(`Failed to load twikoo: ${error}`);
      });
  }, []);

  return (
    <div id="tcomment">
      {loadingStatus === "loading" && <div>正在加载评论...</div>}
      {loadingStatus === "error" && <div>评论加载失败</div>}
    </div>
  );
}
