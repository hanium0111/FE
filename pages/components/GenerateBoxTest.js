import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import styles from "./GenerateBox.module.css";

export default function GenerateBoxTest() {
  const [content, setContent] = useState("");
  const [cssContent, setCssContent] = useState([]);
  const [jsContent, setJsContent] = useState([]);
  const [htmlLoaded, setHtmlLoaded] = useState(false);
  const [imageContent, setImageContent] = useState([]);

  const fetchFile = async (filename) => {
    const res = await fetch(`/api/render?filename=${filename}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return { content: "", isBinary: false, name: filename };
  };

  const fetchStructure = async () => {
    const res = await fetch(`/api/renderFile`);
    const data = await res.json();
    return data.structure;
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const structure = await fetchStructure();
      const cssFiles = structure
        .filter((file) => file.name.endsWith(".css"))
        .map((file) => file.name);
      const jsFiles = structure
        .filter((file) => file.name.endsWith(".js"))
        .map((file) => file.name);
      const imageFiles = structure
        .filter((file) =>
          /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf)$/.test(file.name)
        )
        .map((file) => file.name);

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

      const htmlContent = await fetchFile("templatemo_559_zay_shop/index.html");
      setContent(htmlContent.content);
      setHtmlLoaded(true);
    };

    fetchFiles();
  }, []);

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

    return `
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
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.genBoxWrap}>
        {htmlLoaded && (
          <iframe
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
      </div>
    </div>
  );
}
