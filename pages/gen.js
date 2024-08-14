import Header from "../components/Header";
import styles from "../styles/Wrap.module.css";
import GenerateBoxTest from "@/components/GenerateBoxTest";
import { useRouter } from "next/router";

export default function Gen() {
  const router = useRouter();
  const { projectPath } = router.query;

  return (
    <div className={styles.wrap}>
      <Header />
      <GenerateBoxTest projectPath={projectPath} />
    </div>
  );
}
