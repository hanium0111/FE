import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import ChatComponent from "../components/ChatComponent";
import Templates from "../components/Templates";
import SkeletonUI from "../components/Skeleton";
import { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 2초 후에 로딩 완료
  }, []);

  if (loading) {
    return <SkeletonUI />;
  }

  return (
    <div className={styles.container}>
      <Header />
      <ChatComponent />
      <Templates showMoreButton={true} showCategories={false} />
    </div>
  );
}
