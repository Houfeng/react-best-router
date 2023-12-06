import index_zh from "./zh/index.md?raw";
import api_zh from "./zh/api.md?raw";
import specific_zh from "./zh/specific.md?raw";
import pattern_zh from "./zh/pattern.md?raw";
import examples_zh from "./zh/examples.md?raw";

export const contents = [
  {
    name: "index",
    title: "🚀 快速上手 RBR",
    content: index_zh,
  },
  {
    name: "api",
    title: "🗼 仅有 4 组 API",
    content: api_zh,
  },
  {
    name: "pattern",
    title: "🚏 详解路径匹配",
    content: pattern_zh,
  },
  {
    name: "specific",
    title: "🧬 RBR 路由特性",
    content: specific_zh,
  },
  {
    name: "examples",
    title: "💡 常见用法示例",
    content: examples_zh,
  },
];
