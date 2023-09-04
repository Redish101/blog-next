"use client";

import Retalk from "@retalkgo/client";
import "@retalkgo/client/retalk.css";
import { useEffect, useState } from "react";

export default function Comment() {
  useEffect(() => {
    new Retalk({
      server: "https://retalk.redish101.top",
      el: "#retalk",
      lang: "zh-CN",
      gravatarProxy: "https://cn.gravatar.com/avatar/",
    });
  })

  return <></>;
}
