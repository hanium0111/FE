import { useState } from "react";
import Modal from "react-modal";
import styles from "./ProfileBox.module.css";

Modal.setAppElement("#__next");

export default function ProfileBox() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAccount = () => {
    // 회원 탈퇴 처리 로직
    console.log("회원 탈퇴 처리");
    closeDeleteModal();
  };

  return (
    <>
      <div className={styles.wrap}>
        <h1 className={styles.title}>회원 정보</h1>
        <div className={styles.listWrap}>
          <div className={styles.list}>
            <div className={styles.profileImgWrap}></div>
            <div className={styles.profileInfoWrap}>
              <div className={styles.profileEmail}>test@gmail.com</div>
              <div className={styles.profileName}>김이름</div>
            </div>
          </div>
          <div className={styles.list}>로그아웃</div>
          <div className={styles.list} onClick={openDeleteModal}>
            회원탈퇴
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="회원 탈퇴 확인"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <h2>정말로 탈퇴하시겠습니까?</h2>
        <div className={styles.modalButtons}>
          <button
            onClick={handleDeleteAccount}
            className={styles.confirmButton}
          >
            예
          </button>
          <button onClick={closeDeleteModal} className={styles.cancelButton}>
            아니요
          </button>
        </div>
      </Modal>
    </>
  );
}
