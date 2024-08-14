import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import styles from "@/components/GenerateBox.module.css";
import Btn from "./Btn";

const GenerateBox = ({ projectPath }) => {
  const [indexFile, setIndexFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchFileData = async () => {
      const res = await fetch(
        `https://1am11m.store/user-templates/directory?dirPath=${projectPath}`
      );
      const json = await res.json();

      // index.html 파일 찾기
      const findIndexFile = (files) => {
        for (const file of files) {
          if (file.isDirectory && file.children) {
            const foundFile = findIndexFile(file.children);
            if (foundFile) return foundFile;
          } else if (file.name === "index.html") {
            return file;
          }
        }
        return null;
      };

      const indexHtmlFile = findIndexFile(json);
      setIndexFile(indexHtmlFile);
    };

    fetchFileData();
  }, [projectPath]);

  useEffect(() => {
    if (indexFile) {
      const fetchFileContent = async () => {
        const res = await fetch(`https://1am11m.store${indexFile.path}`);
        const content = await res.text();
        setFileContent(content);
      };

      fetchFileContent();
    }
  }, [indexFile]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.removeEventListener("click", handleElementClick);
      contentRef.current.addEventListener("click", handleElementClick);
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("click", handleElementClick);
      }
    };
  }, [fileContent]);

  const handleElementClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const clickedElement = event.target;
    clearHighlight();
    clickedElement.style.outline = "2px solid blue";

    console.log("Clicked Element:", clickedElement);

    clickedElement.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        e.preventDefault();
      },
      { once: true }
    );
  };

  const clearHighlight = () => {
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll("*");
      elements.forEach((element) => {
        element.style.outline = "none";
      });
    }
  };

  const renderFileContent = () => {
    if (!fileContent) return null;

    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(fileContent, "text/html");

      const basePath = indexFile.path.substring(
        0,
        indexFile.path.lastIndexOf("/")
      );

      const linkTags = Array.from(
        doc.querySelectorAll('link[rel="stylesheet"]')
      );
      linkTags.forEach((tag) => {
        const href = tag.getAttribute("href");
        if (href && !href.startsWith("http")) {
          tag.setAttribute("href", `https://1am11m.store${basePath}/${href}`);
        }
      });

      const imgTags = Array.from(doc.querySelectorAll("img"));
      imgTags.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http")) {
          img.setAttribute("src", `https://1am11m.store${basePath}/${src}`);
        }
      });

      const updatedHTML = doc.documentElement.outerHTML;

      return (
        <div className={styles.genBoxWrap}>
          <Head>
            {linkTags.map((tag, index) => (
              <link
                key={index}
                rel="stylesheet"
                href={tag.getAttribute("href")}
              />
            ))}
          </Head>
          <div
            ref={contentRef}
            className={styles.genBox}
            dangerouslySetInnerHTML={{ __html: updatedHTML }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.wrap}>
      {renderFileContent()}
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
};

export default GenerateBox;
