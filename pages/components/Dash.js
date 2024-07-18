import { useState, useEffect } from "react";
import styles from "./Dash.module.css";
import { FaEllipsisV, FaHeart, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Btn from "./Btn";
import Modal from "react-modal";

const DropdownMenu = ({
  isDeployed,
  onEdit,
  onDelete,
  onDeploy,
  onShare,
  onUse,
  onRename,
}) => {
  return (
    <div className={styles.dropdownMenu}>
      {isDeployed ? (
        <>
          <button onClick={onUse}>템플릿 사용</button>
          <button onClick={onShare}>배포 링크 공유</button>
        </>
      ) : (
        <>
          <button onClick={onDeploy}>프로젝트 배포</button>
          <button onClick={onEdit}>프로젝트 편집</button>
        </>
      )}
      <button onClick={onDelete}>프로젝트 삭제</button>
      <button onClick={onRename}>이름 변경</button>
    </div>
  );
};

export default function Dash() {
  const [templates, setTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showDeployed, setShowDeployed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch("/api/data?filename=dashs");
      const data = await res.json();
      setTemplates(data);
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates
    .filter((template) =>
      template.templateName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((template) => (showDeployed ? !template.deploy : true));

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === "인기순") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      width: "300px",
      height: "400px",
      margin: "auto",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      padding: "20px",
    },
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h1>Modal</h1>
        <p>{modalContent}</p>
        <button onClick={closeModal}>닫기</button>
      </Modal>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>대시보드</h2>
        </div>
        <div className={styles.sectionControls}>
          <div className={styles.sectionLeft}>
            <Btn
              text={"최신순"}
              background={sortOrder === "최신순" ? "#4629F2" : "#fff"}
              border={"#4629F2"}
              textColor={sortOrder === "최신순" ? "#fff" : "#4629F2"}
              onClick={() => setSortOrder("최신순")}
            />
            <Btn
              text={"인기순"}
              background={sortOrder === "인기순" ? "#4629F2" : "#fff"}
              border={"#4629F2"}
              textColor={sortOrder === "인기순" ? "#fff" : "#4629F2"}
              onClick={() => setSortOrder("인기순")}
            />
            <div className={styles.switchContainer}>
              <label className={styles.switchLabel}>
                {showDeployed ? "배포 대기" : "모든 상태"}
              </label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={showDeployed}
                  onChange={() => setShowDeployed((prev) => !prev)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          <div className={styles.sectionRight}>
            <div className={styles.searchWrap}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="검색어를 입력하세요 ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.grid}>
          {sortedTemplates.map((template) => (
            <div key={template.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardProfileWrap}>
                  <div className={styles.cardProfile}>
                    <Image
                      className={styles.cardProfileImg}
                      alt="profile"
                      layout="fill"
                      src={template.profileImage}
                    />
                  </div>
                </div>
                <div className={styles.cardHeaderInfo}>
                  <div className={styles.cardUser}>{template.user}</div>
                </div>
                <div
                  className={styles.cardMenu}
                  style={{ position: "relative" }}
                >
                  <button
                    className={styles.cardMenuButton}
                    onClick={() => toggleDropdown(template.id)}
                  >
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen === template.id && (
                    <DropdownMenu
                      isDeployed={template.deploy}
                      onShare={() => console.log("Share")}
                      onUse={() => console.log("Use")}
                      onDeploy={() => console.log("Deploy")}
                      onEdit={() => console.log("Edit")}
                      onRename={() => console.log("Rename")}
                      onDelete={() => console.log("Delete")}
                    />
                  )}
                </div>
              </div>
              <div className={styles.cardImage}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{template.templateName}</div>
                <div className={styles.cardSubhead}>{template.date}</div>
                <p>{template.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <Btn
                  icon={<FaHeart className={styles.likeIcon} />}
                  text={template.likes}
                  background={"none"}
                  border={"#4629F2"}
                  textColor={"#4629F2"}
                />
                {template.deploy ? (
                  <Btn
                    text={"배포 완료"}
                    background={"#E0E0E0"}
                    border={"#E0E0E0"}
                    textColor={"#7D7D7D"}
                    width="7rem"
                    onClick={() => openModal(template.description)}
                  />
                ) : (
                  <Btn
                    text={"배포하기"}
                    background={"#4629F2"}
                    border={"#4629F2"}
                    textColor={"#fff"}
                    width="7rem"
                    onClick={() => openModal(template.description)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
