import React, { useEffect, useState, useRef } from "react";
import styles from "./GenerateBox.module.css";
import Btn from "./Btn";

export default function GenerateBox({ projectPath }) {
  const [content, setContent] = useState("");
  const [cssContent, setCssContent] = useState([]);
  const [jsContent, setJsContent] = useState([]);
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [imageContent, setImageContent] = useState([]);
  const iframeRef = useRef(null);
  const highlightedElementRef = useRef(null);

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
      const isBinary = /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf)$/.test(
        filename
      );
      return {
        content: isBinary ? content : content,
        isBinary,
        name: filename,
      };
    }
    return { content: "", isBinary: false, name: filename };
  };

  const fetchStructure = async () => {
    const res = await fetch(
      `https://1am11m.store/user-templates/directory?dirPath=${projectPath}`
    );
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    if (!projectPath) return;
    const fetchFiles = async () => {
      const structure = await fetchStructure();
      const cssFiles = structure
        .filter((file) => file.name.endsWith(".css"))
        .map((file) => file.path);
      const jsFiles = structure
        .filter((file) => file.name.endsWith(".js"))
        .map((file) => file.path);
      const imageFiles = structure
        .filter(
          (file) =>
            !file.isDirectory &&
            /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf)$/.test(file.name)
        )
        .map((file) => file.path);

      const cssContents = await Promise.all(cssFiles.map(fetchFile));
      const jsContents = await Promise.all(jsFiles.map(fetchFile));
      const imageContents = await Promise.all(imageFiles.map(fetchFile));

      setCssContent(cssContents.map((file) => file.content));
      setJsContent(jsContents.map((file) => file.content));
      setImageContent(
        imageContents.map((file) => ({
          name: file.name,
          content: file.isBinary ? `/temp/${file.name}` : file.content,
        }))
      );

      const htmlContent = await fetchFile(`${projectPath}/index.html`);

      setContent(htmlContent.content);
      setHtmlLoaded(true);
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const handleIframeLoad = () => {
      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow.document;

      iframeDoc.body.addEventListener("click", (event) => {
        console.log(event.target);

        if (highlightedElementRef.current) {
          highlightedElementRef.current.style.border = "";
        }

        event.target.style.border = "2px solid #4629f2";

        highlightedElementRef.current = event.target;
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

  const createMarkup = () => {
    if (!htmlLoaded) return "";

    const cssLinks = cssContent
      .map((css) => `<style>${css}</style>`)
      .join("\n");
    const jsScripts = jsContent
      .map((js) => `<script>${js}</script>`)
      .join("\n");
    const imageReplacements = imageContent.reduce((acc, { name, content }) => {
      acc[name] = content;
      return acc;
    }, {});

    let finalContent = content;
    Object.keys(imageReplacements).forEach((imageName) => {
      finalContent = finalContent.replace(
        new RegExp(imageName, "g"),
        imageReplacements[imageName]
      );
    });

    const fullContent = `
      <html>
        <head>
          ${cssLinks}
        </head>
        <body>
          ${finalContent}
          ${jsScripts}
        </body>
      </html>
    `;

    console.log(fullContent);

    return fullContent;
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
