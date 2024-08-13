import { useState, useEffect } from "react";

const GenerateBoxTest = ({ files }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [cssContent, setCssContent] = useState("");
  const [jsContent, setJsContent] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      if (!files || !Array.isArray(files)) {
        console.error("Files data is undefined or not an array");
        return;
      }

      const baseURL = "https://1am11m.store";

      const htmlFile = files.find((file) => file.name === "index.html");
      const cssFile = files.find((file) => file.name.endsWith(".css"));
      const jsFile = files.find((file) => file.name.endsWith(".js"));

      try {
        if (htmlFile) {
          const htmlResponse = await fetch(baseURL + htmlFile.path);
          const htmlData = await htmlResponse.text();
          setHtmlContent(htmlData);
        }

        if (cssFile) {
          const cssResponse = await fetch(baseURL + cssFile.path);
          const cssData = await cssResponse.text();
          setCssContent(cssData);
        }

        if (jsFile) {
          const jsResponse = await fetch(baseURL + jsFile.path);
          const jsData = await jsResponse.text();
          setJsContent(jsData);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [files]);

  useEffect(() => {
    if (cssContent) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = cssContent;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [cssContent]);

  useEffect(() => {
    if (jsContent) {
      const scriptElement = document.createElement("script");
      scriptElement.innerHTML = jsContent;
      document.body.appendChild(scriptElement);

      return () => {
        document.body.removeChild(scriptElement);
      };
    }
  }, [jsContent]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export const getServerSideProps = async () => {
  try {
    const response = await fetch(
      "https://1am11m.store/user-templates/directory?dirPath=/copied_userTemplates/test_oys128950@gmail.com_1723447296518"
    );
    const files = await response.json();

    return { props: { files } };
  } catch (error) {
    console.error("Error fetching file list:", error);
    return { props: { files: null } };
  }
};

export default GenerateBoxTest;
