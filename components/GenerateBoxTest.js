import { useEffect, useState } from "react";
import Head from "next/head";

const GenerateBoxTest = ({ projectPath }) => {
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  useEffect(() => {
    // JSON 데이터를 가져오는 함수
    const fetchFileData = async () => {
      const res = await fetch(
        `https://1am11m.store/user-templates/directory?dirPath=${projectPath}`
      );
      const json = await res.json();
      setFiles(json);
    };

    fetchFileData();
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      // 재귀적으로 파일 내용을 가져오는 함수
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
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      // HTML 파일에서 모든 CSS 파일을 찾음
      const linkTags = Array.from(
        doc.querySelectorAll('link[rel="stylesheet"]')
      );
      const cssFiles = linkTags.map((tag) => tag.getAttribute("href"));

      return (
        <div>
          <Head>
            {/* 동적으로 모든 CSS 파일을 로드 */}
            {cssFiles.map((href, index) => (
              <link
                key={index}
                rel="stylesheet"
                href={`https://1am11m.store${href}`}
              />
            ))}
          </Head>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    // 기타 파일 형식에 대한 처리
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

export default GenerateBoxTest;
