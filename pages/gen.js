import Header from "../components/Header";
import styles from "../styles/Wrap.module.css";
import GenerateBox from "../components/GenerateBox";
import { useRouter } from "next/router";

export default function Gen() {
  const router = useRouter();
  const { projectPath } = router.query;

  return (
    <div className={styles.wrap}>
      <Header />
      <GenerateBox projectPath={projectPath} />
    </div>
  );
}
