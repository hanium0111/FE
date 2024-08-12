import React, { useState, useEffect } from "react";

const WebPageRenderer = () => {
  const [fileData, setFileData] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [jsContent, setJsContent] = useState("");

  useEffect(() => {
    // 파일 데이터를 API를 통해 가져오기
    fetch(
      "https://1am11m.store/user-templates/directory?dirPath=/copied_userTemplates/t_oys128950@gmail.com_1723439968134"
    )
      .then((response) => response.json())
      .then((data) => {
        setFileData(data);
        processFiles(data);
      })
      .catch((error) => console.error("Error fetching file data:", error));
  }, []);

  const processFiles = (files) => {
    files.forEach((file) => {
      fetch(`https://1am11m.store${file.path}`)
        .then((response) => response.text())
        .then((content) => {
          if (file.name.endsWith(".html")) {
            setHtmlContent((prev) => prev + content);
          } else if (file.name.endsWith(".css")) {
            setCssContent((prev) => prev + content);
          } else if (file.name.endsWith(".js")) {
            setJsContent((prev) => prev + content);
          }
        })
        .catch((error) =>
          console.error(`Error fetching file ${file.name}:`, error)
        );
    });
  };

  useEffect(() => {
    if (cssContent) {
      const style = document.createElement("style");
      style.textContent = cssContent;
      document.head.appendChild(style);
    }

    if (jsContent) {
      const script = document.createElement("script");
      script.textContent = jsContent;
      document.body.appendChild(script);
    }
  }, [cssContent, jsContent]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default WebPageRenderer;
