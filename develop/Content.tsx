import { createElement, Fragment } from "react";
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
    <article className="prose p-6 w-screen">
      <MarkdownView
        remarkPlugins={[remarkGfm]}
        components={{
          pre(props) {
            const { className = "", children } = props;
            return (
              <pre className={`[&>.code]:block ${className} font-mono`}>
                {children}
              </pre>
            );
          },
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children || "").replace(/\n$/, "");
            return renderCodeBlock(code, match?.[1]);
          },
          p(props) {
            const { children, className = "", ...others } = props;
            return (
              <p
                className={`font-serif ${className} [& a>img]:inline`}
                {...others}
              >
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </MarkdownView>
    </article>
  );
}
