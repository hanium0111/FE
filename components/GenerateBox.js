import { useEffect, useState } from "react";
import Head from "next/head";

const GenerateBox = ({ projectPath }) => {
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  useEffect(() => {
    const fetchFileData = async () => {
      const res = await fetch(
        `https://1am11m.store/user-templates/directory?dirPath=${projectPath}`
      );
      const json = await res.json();
      setFiles(json);
    };

    fetchFileData();
  }, [projectPath]);

  useEffect(() => {
    if (files.length > 0) {
      const fetchFileContents = async (file) => {
        if (file.isDirectory && file.children) {
          await Promise.all(file.children.map(fetchFileContents));
        } else {
          const res = await fetch(`https://1am11m.store${file.path}`);
          const content = await res.text();
          setFileContents((prevContents) => ({
            ...prevContents,
            [file.path]: content,
          }));
        }
      };

      files.forEach(fetchFileContents);
    }
  }, [files]);

  const renderFileContent = (file) => {
    const content = fileContents[file.path];
    if (!content) return null;

    if (file.name.endsWith(".html")) {
      if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        // 현재 HTML 파일 경로에서 디렉터리 경로 추출
        const basePath = file.path.substring(0, file.path.lastIndexOf("/"));
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
    }

    return null;
  };

  return (
    <div>
      {files.map((file) => (
        <div key={file.path}>{renderFileContent(file)}</div>
      ))}
    </div>
  );
};

export default GenerateBox;
