import { useEffect, useState } from "react";
import Head from "next/head";

const GenerateBox = ({ projectPath }) => {
  const [indexFile, setIndexFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

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

  const renderFileContent = () => {
    if (!fileContent) return null;

    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(fileContent, "text/html");

      // 현재 HTML 파일 경로에서 디렉터리 경로 추출
      const basePath = indexFile.path.substring(
        0,
        indexFile.path.lastIndexOf("/")
      );
      console.log("Base Path:", basePath);

      // CSS 파일 경로를 조정
      const linkTags = Array.from(
        doc.querySelectorAll('link[rel="stylesheet"]')
      );
      const cssFiles = linkTags.map((tag) => {
        const href = tag.getAttribute("href");
        return `https://1am11m.store${basePath}/${href}`;
      });

      // 이미지 경로를 조정
      const imgTags = Array.from(doc.querySelectorAll("img"));
      imgTags.forEach((img) => {
        const src = img.getAttribute("src");
        img.setAttribute("src", `https://1am11m.store${basePath}/${src}`);
      });

      // HTML 내용을 다시 직렬화하여 렌더링
      const updatedHTML = doc.documentElement.outerHTML;

      return (
        <div>
          <Head>
            {cssFiles.map((href, index) => (
              <link key={index} rel="stylesheet" href={href} />
            ))}
          </Head>
          <div dangerouslySetInnerHTML={{ __html: updatedHTML }} />
        </div>
      );
    }

    return null;
  };

  return <div>{renderFileContent()}</div>;
};

export default GenerateBox;
