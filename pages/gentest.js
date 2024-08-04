import Header from "../components/Header";
import styles from "../styles/Wrap.module.css";
import GenerateBoxTest from "../components/GenerateBoxTest";
export default function GenTest() {
  return (
    <div className={styles.wrap}>
      <Header />
      <GenerateBoxTest />
    </div>
  );
}
