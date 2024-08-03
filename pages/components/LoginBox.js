import styles from "./LoginBox.module.css";
import Image from "next/image";
import Btn from "./Btn";

export default function LoginBox() {
  // const handleGoogleLogin = () => {
  //   window.location.href = "https://1am11m.store/auth/google";
  // };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("https://1am11m.store/auth/google", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "https://0111.site";
      } else {
        console.error("데이터 가져오기 실패. 상태:", response.status);
      }
    } catch (error) {
      console.error("데이터 가져오기 중 에러 발생:", error);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.imgBox}>
        <Image
          className={styles.img}
          alt="team"
          layout="fill"
          src={"/team.jpg"}
        />
      </div>
      <h1 className={styles.title}>
        <span>웹사이트 만들기,</span>
        <br /> <span className={styles.bold}>누구나 쉽게 할 수 있어요!</span>
      </h1>
      <div className={styles.btnWrap}>
        <Btn
          text={"구글 아이디로 시작하기"}
          background={"#000"}
          border={"000"}
          textColor={"#fff"}
          width={"20rem"}
          onClick={handleGoogleLogin}
        />
      </div>
    </div>
  );
}
