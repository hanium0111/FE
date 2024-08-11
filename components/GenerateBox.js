import React, { useEffect, useState, useRef } from "react";
import styles from "./GenerateBox.module.css";
import Btn from "./Btn";

export default function GenerateBox({ projectPath }) {
  const [content, setContent] = useState("");
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [cssFiles, setCssFiles] = useState([]);
  const [jsFiles, setJsFiles] = useState([]);
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

    const htmlFiles = data.filter((file) => file.name.endsWith(".html"));
    const cssFiles = data.filter((file) => file.name.endsWith(".css"));
    const jsFiles = data.filter((file) => file.name.endsWith(".js"));

    setHtmlFiles(htmlFiles);
    setCssFiles(cssFiles);
    setJsFiles(jsFiles);
  };

  useEffect(() => {
    if (!projectPath) return;

    // fetchStructure를 먼저 호출하여 파일 목록을 받아옴
    fetchStructure();
  }, [projectPath]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (htmlFiles.length === 0) return;

      const indexFile = htmlFiles.find((file) => file.name === "index.html");
      if (!indexFile) {
        console.error("index.html 파일을 찾을 수 없습니다.");
        return;
      }

      const indexContent = await fetchFile(indexFile.path);

      // CSS와 JS 파일들 로드
      const cssPromises = cssFiles.map((file) => fetchFile(file.path));
      const jsPromises = jsFiles.map((file) => fetchFile(file.path));

      const cssContents = await Promise.all(cssPromises);
      const jsContents = await Promise.all(jsPromises);

      // CSS와 JS를 index.html에 결합
      const cssLinks = cssContents
        .map(
          (cssFile) =>
            `<link rel="stylesheet" href=https://1am11m.store${cssFile.name}>` // 수정된 부분
        )
        .join("\n");

      const jsScripts = jsContents
        .map((jsFile) => `<script>${jsFile.content}</script>`)
        .join("\n");

      // HTML 컨텐츠에서 이미지 경로 수정
      const fixedIndexContent = indexContent.content.replace(
        /src=["'](.*?)["']/g,
        (match, p1) => `src="https://1am11m.store${p1}"`
      );

      const fullContent = `
        <html>
          <head>
            ${cssLinks}
          </head>
          <body>
            ${fixedIndexContent}
            ${jsScripts}
          </body>
        </html>
      `;

      setContent(fullContent);
      setHtmlLoaded(true);
    };

    fetchFiles();
  }, [htmlFiles, cssFiles, jsFiles]);

  const createMarkup = () => {
    if (!htmlLoaded) return "";
    return content;
  };

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
