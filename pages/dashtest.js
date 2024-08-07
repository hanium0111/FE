import Header from "../components/Header";
import DashTest from "../components/DashTest";
import styles from "../styles/Wrap.module.css";

export default function DashBoard() {
  return (
    <div className={styles.wrap}>
      <Header />
      <DashTest showMoreButton={false} showCategories={true} />
    </div>
  );
}
