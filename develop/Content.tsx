import { createElement, Fragment } from "react";
import MarkdownView from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import { useNavigator } from "../src";
import { contents } from "./docs";
import { getLocalLanguage } from "./LocalStore";

function scrollToTop() {
  setTimeout(() => (document.documentElement.scrollTop = 0), 0);
}

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
  const nav = useNavigator<"name">();
  const item =
    contents.find((it) => it.name === nav.params.name) || contents[0];
  const index = contents.indexOf(item);
  const prev = contents[index - 1];
  const next = contents[index + 1];
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
            const { children, className = "" } = props;
            return (
              <p
                className={`${
                  getLocalLanguage() === "zh" ? "font-serif" : ""
                } ${className} [&>a>img]:inline [&>a>img]:m-0`}
              >
                {children}
              </p>
            );
          },
          li(props) {
            const { children, className = "" } = props;
            const lang = getLocalLanguage();
            return (
              <li
                className={`${lang === "zh" ? "font-serif" : ""} ${className}`}
              >
                {children}
              </li>
            );
          },
        }}
      >
        {item.content}
      </MarkdownView>
      <nav className="mt-10 flex justify-between">
        {prev ? (
          <button
            className="btn"
            onClick={() => [nav.push(`/${prev.name}`), scrollToTop()]}
          >
            ←
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            className="btn"
            onClick={() => [nav.push(`/${next.name}`), scrollToTop()]}
          >
            {`${next.title} →`}
          </button>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
