import Header from "../components/Header";
import styles from "../styles/Wrap.module.css";
import GenerateBox from "../components/GenerateBox";
export default function Gen() {
  return (
    <div className={styles.wrap}>
      <Header />
      <GenerateBox />
    </div>
  );
}
