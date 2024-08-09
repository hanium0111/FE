import React, { useEffect, useState, useRef } from "react";
import styles from "./GenerateBox.module.css";
import Btn from "./Btn";

export default function GenerateBox({ projectPath }) {
  const [content, setContent] = useState("");
  const [cssFilePath, setCssFilePath] = useState("");
  const [jsContent, setJsContent] = useState("");
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const iframeRef = useRef(null);

  const cleanContent = (content) => {
    return content
      .replace(/\\&quot;/g, '"')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\s+/g, " ");
  };

  const fetchFile = async (filename) => {
    const res = await fetch(
      `https://1am11m.store/user-templates/file?filePath=${filename}`
    );
    if (res.ok) {
      let content = await res.text();
      content = cleanContent(content);
      console.log("Fetched Content for:", filename, content);
      return { content, name: filename };
    }
    return { content: "", name: filename };
  };

  const fetchStructure = async () => {
    const res = await fetch(
      `https://1am11m.store/user-templates/directory?dirPath=${projectPath}`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (!projectPath) return;

      const structure = await fetchStructure();
      const cssFile = structure.find((file) => file.name.endsWith(".css"));
      const jsFile = structure.find((file) => file.name.endsWith(".js"));

      if (cssFile) {
        setCssFilePath(cssFile.path);
      }

      if (jsFile) {
        const jsContent = await fetchFile(jsFile.path);
        setJsContent(jsContent.content);
      }

      const htmlContent = await fetchFile(`${projectPath}/index.html`);
      setContent(htmlContent.content);
      setHtmlLoaded(true);
    };

    fetchFiles();
  }, [projectPath]);

  const createMarkup = () => {
    if (!htmlLoaded) return "";

    const cssLinkTag = `<link rel="stylesheet" type="text/css" href="https://1am11m.store${cssFilePath}">`;
    const jsScriptTag = `<script>${jsContent}</script>`;
    const fullContent = `
            <html>
                <head>
                    ${cssLinkTag}
                </head>
                <body>
                    ${content}
                    ${jsScriptTag}
                </body>
            </html>
        `;

    console.log(fullContent);

    return fullContent;
  };

  useEffect(() => {
    const handleIframeLoad = () => {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow.document;

      iframeDoc.body.addEventListener("click", (event) => {
        console.log(event.target);
      });
    };

    if (htmlLoaded && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.addEventListener("load", handleIframeLoad);
      return () => {
        iframe.removeEventListener("load", handleIframeLoad);
      };
    }
  }, [htmlLoaded]);

  return (
    <div className={styles.wrap}>
      <div className={styles.genBoxWrap}>
        {htmlLoaded && (
          <iframe
            ref={iframeRef}
            className={styles.generateBox}
            srcDoc={createMarkup()}
            width="100%"
            height="100%"
            display="initial"
            position="relative"
            allowFullScreen
          />
        )}
      </div>
      <div className={styles.editorWrap}>
        <form className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="수정하고 싶은 부분을 입력하세요."
          />
          <button type="submit" className={styles.button}>
            <svg
              className={styles.icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </form>
        <Btn
          text={"수정 완료"}
          background={"#666"}
          border={"#666"}
          textColor={"#FFF"}
        />
      </div>
    </div>
  );
}
