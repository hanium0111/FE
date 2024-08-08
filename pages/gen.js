import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import styles from "../styles/Wrap.module.css";
import GenerateBox from "../components/GenerateBox";

export default function Gen() {
  const router = useRouter();
  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    const queryPath = router.query.projectPath;
    if (queryPath) {
      setProjectPath(queryPath);
      localStorage.setItem("projectPath", queryPath);
    } else {
      const storedPath = localStorage.getItem("projectPath");
      if (storedPath) {
        setProjectPath(storedPath);
      }
    }
  }, [router.query]);

  return (
    <div className={styles.wrap}>
      <Header />
      <GenerateBox projectPath={projectPath} />
    </div>
  );
}
