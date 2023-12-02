import React, { Fragment } from "react";
import MarkdownView from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import { useNavigator } from "../src";
import index_zh from "./docs/zh/index.md?raw";
import api_zh from "./docs/zh/api.md?raw";
import pattern_zh from "./docs/zh/pattern.md?raw";
import examples_zh from "./docs/zh/examples.md?raw";

const contents = {
  index: index_zh,
  api: api_zh,
  pattern: pattern_zh,
  examples: examples_zh,
};

function renderCodeBlock(code: string, language?: string) {
  return (
    <Highlight
      theme={themes.nightOwl}
      code={code}
      language={language || "bash"}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="code inline">
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  );
}

export function Content() {
  const nav = useNavigator<{ name: keyof typeof contents }>();
  const content = contents[nav.params.name || "index"];
  return (
    <article className="prose p-6">
      <MarkdownView
        remarkPlugins={[remarkGfm]}
        components={{
          pre(props) {
            const { children, className, style } = props;
            return (
              <pre className={`${className} [&>.code]:block`} style={style}>
                {children}
              </pre>
            );
          },
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");
            return renderCodeBlock(code, match?.[1]);
          },
        }}
      >
        {content}
      </MarkdownView>
    </article>
  );
}
