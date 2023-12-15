import Hexo from "hexo";
import path from "path";
import { cache } from "react";

const initHexo = cache(async () => {
    const hexo = new Hexo()
    await hexo.init()
})

export {
    initHexo
}