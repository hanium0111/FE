import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import ChatComponent from "../components/ChatComponent";
import Templates from "../components/Templates";

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <ChatComponent />
      <Templates showMoreButton={true} showCategories={false} />
    </div>
  );
}
