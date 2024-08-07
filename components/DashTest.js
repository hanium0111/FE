import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./Dash.module.css";
import { FaEllipsisV, FaHeart, FaSearch, FaPlus } from "react-icons/fa";
import Image from "next/image";
import Btn from "./Btn";
import Modal from "react-modal";
import { SkeletonDash } from "./Skeleton";

const DropdownMenu = ({
  isDeployed,
  isShared,
  onEdit,
  onDelete,
  onDeploy,
  onUse,
  onRename,
  onStopSharing,
}) => {
  return (
    <div className={styles.dropdownMenu}>
      {isDeployed ? (
        <>
          <button onClick={onUse}>템플릿 사용</button>
          <button onClick={() => console.log("배포 링크 공유")}>
            배포 링크 공유
          </button>
        </>
      ) : isShared ? (
        <button onClick={onStopSharing}>템플릿 공유 중지</button>
      ) : (
        <button onClick={onDeploy}>템플릿으로 공유</button>
      )}
      <button onClick={onEdit}>프로젝트 편집</button>
      <button onClick={onDelete}>프로젝트 삭제</button>
      <button onClick={onRename}>이름 변경</button>
    </div>
  );
};

export default function DashTest() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showDeployed, setShowDeployed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [pageName, setPageName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashStructure, setDashStructure] = useState([]);
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [displayName, setDisplayName] = useState("사용자");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileImage("/profile.png");
        setDisplayName("사용자");
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    // 임의의 데이터 로드
    const mockData = [
      {
        id: 81,
        projectName: "ㅁㅁ",
        projectPath:
          "/copied_userTemplates/ㅁㅁ_oys128950@gmail.com_1722933381497",
        imagePath:
          "/page_screenshots/ㅁㅁ_oys128950@gmail.com_1722933381497.png",
        shared: false,
        email: "oys128950@gmail.com",
        likes: 0,
        publish: false,
        websiteType: "기업 웹사이트",
        features: "",
        mood: "",
        content: "",
        createdAt: "2024-08-06T08:36:21.000Z",
        updatedAt: "2024-08-06T08:36:21.000Z",
      },
      {
        id: 82,
        projectName: "ad",
        projectPath:
          "/copied_userTemplates/ad_oys128950@gmail.com_1722933433373",
        imagePath: "/page_screenshots/ad_oys128950@gmail.com_1722933433373.png",
        shared: false,
        email: "oys128950@gmail.com",
        likes: 0,
        publish: false,
        websiteType: "기업 웹사이트",
        features: "",
        mood: "",
        content: "",
        createdAt: "2024-08-06T08:37:13.000Z",
        updatedAt: "2024-08-06T08:37:13.000Z",
      },
      {
        id: 83,
        projectName: "bb",
        projectPath:
          "/copied_userTemplates/aa_oys128950@gmail.com_1722933852764",
        imagePath: "/page_screenshots/aa_oys128950@gmail.com_1722933852764.png",
        shared: false,
        email: "oys128950@gmail.com",
        likes: 0,
        publish: false,
        websiteType: "비즈니스",
        features: "",
        mood: "",
        content: "",
        createdAt: "2024-08-06T08:44:12.000Z",
        updatedAt: "2024-08-06T08:56:23.000Z",
      },
      {
        id: 84,
        projectName: "xx",
        projectPath:
          "/copied_userTemplates/xx_oys128950@gmail.com_1722933865615",
        imagePath: "/page_screenshots/xx_oys128950@gmail.com_1722933865615.png",
        shared: true,
        email: "oys128950@gmail.com",
        likes: 0,
        publish: false,
        websiteType: "기업 웹사이트",
        features: "",
        mood: "",
        content: "",
        createdAt: "2024-08-06T08:44:25.000Z",
        updatedAt: "2024-08-07T06:21:49.000Z",
      },
    ];

    setTemplates(mockData);
    setDashStructure(new Array(mockData.length).fill(null));
    setLoading(false);
  }, []);

  const filteredTemplates = templates
    .filter((template) =>
      template.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((template) => (showDeployed ? !template.deploy : true));

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortOrder === "인기순") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTemplate = async () => {
    try {
      const res = await fetch(
        `https://1am11m.store/dashboards/dashboard/remove/${selectedTemplate.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template.id !== selectedTemplate.id)
      );

      console.log("Template deleted successfully:", selectedTemplate);
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete template:", error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  const openRenameModal = (template) => {
    setSelectedTemplate(template);
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
  };

  const handleRenameTemplate = async () => {
    if (!pageName.trim()) {
      alert("새로운 이름을 입력하세요.");
      return;
    }

    try {
      const res = await fetch(
        `https://1am11m.store/dashboards/${selectedTemplate.id}/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: pageName }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedTemplate = await res.json();

      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === updatedTemplate.id
            ? { ...template, projectName: updatedTemplate.projectName }
            : template
        )
      );

      console.log("Template renamed successfully:", updatedTemplate);
      closeRenameModal();
    } catch (error) {
      console.error("Failed to rename template:", error);
      alert("이름 변경에 실패했습니다.");
    }
  };

  const openShareModal = (template) => {
    setSelectedTemplate(template);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleShareTemplate = async () => {
    if (!category.trim() || !description.trim()) {
      setModalContent("카테고리와 설명을 입력해주세요.");
      setIsModalOpen(true);
      return;
    }

    try {
      const res = await fetch(
        `https://1am11m.store/dashboards/dashboard/${selectedTemplate.id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category, description }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const sharedTemplate = await res.json();

      console.log("Template shared successfully:", sharedTemplate);
      closeShareModal();
    } catch (error) {
      console.error("Failed to share template:", error);
      setModalContent("템플릿 공유에 실패했습니다.");
      setIsModalOpen(true);
    }
  };

  const handleStopSharingTemplate = async () => {
    try {
      const res = await fetch(
        `https://1am11m.store/dashboards/dashboard/${selectedTemplate.id}/share-stop`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === selectedTemplate.id
            ? { ...template, shared: false }
            : template
        )
      );

      console.log("Template sharing stopped successfully:", selectedTemplate);
    } catch (error) {
      console.error("Failed to stop sharing template:", error);
      alert("템플릿 공유 중지에 실패했습니다.");
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
    content: {
      width: "24rem",
      height: "max-content",
      margin: "auto",
      borderRadius: "1rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      padding: "2rem",
      zIndex: 1001,
    },
  };

  return (
    <>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        style={customStyles}
      >
        <h1>정말로 삭제하겠습니까?</h1>
        <p>이 작업은 되돌릴 수 없습니다.</p>
        <div className={styles.modalButtons}>
          <button
            onClick={handleDeleteTemplate}
            className={styles.confirmButton}
          >
            예
          </button>
          <button onClick={closeDeleteModal} className={styles.cancelButton}>
            아니요
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isRenameModalOpen}
        onRequestClose={closeRenameModal}
        style={customStyles}
      >
        <h1>이름을 변경하시겠습니까?</h1>
        <input
          className={styles.pageinputform}
          type="text"
          placeholder="이름 입력.."
          onChange={(e) => setPageName(e.target.value)}
        />{" "}
        <div className={styles.modalButtons}>
          <button
            onClick={handleRenameTemplate}
            className={styles.confirmButton}
          >
            예
          </button>
          <button onClick={closeRenameModal} className={styles.cancelButton}>
            아니요
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isShareModalOpen}
        onRequestClose={closeShareModal}
        style={customStyles}
      >
        <h1>템플릿 공유</h1>
        <input
          className={styles.pageinputform}
          type="text"
          placeholder="카테고리 입력.."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className={styles.pageinputform}
          type="text"
          placeholder="설명 입력.."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button
            onClick={handleShareTemplate}
            className={styles.confirmButton}
          >
            확인
          </button>
          <button onClick={closeShareModal} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h1>알림</h1>
        <p>{modalContent}</p>
        <div className={styles.modalButtons}>
          <button onClick={closeModal} className={styles.confirmButton}>
            닫기
          </button>
        </div>
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
        {loading ? (
          <SkeletonDash dashStructure={dashStructure} />
        ) : (
          <div className={styles.grid}>
            {sortedTemplates.length === 0 ? (
              <>
                <Btn
                  icon={<FaPlus className={styles.likeIcon} />}
                  width={"14rem"}
                  text={"지금 웹페이지 생성하기!"}
                  background={"#000"}
                  border={"#000"}
                  textColor={"#fff"}
                  onClick={() => router.push("/")}
                />
              </>
            ) : (
              sortedTemplates.map((template) => (
                <div key={template.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardProfileWrap}>
                      <div className={styles.cardProfile}>
                        <Image
                          className={styles.cardProfileImg}
                          alt="profile"
                          layout="fill"
                          src={profileImage}
                        />
                      </div>
                    </div>
                    <div className={styles.cardHeaderInfo}>
                      <div className={styles.cardUser}>{displayName}</div>
                      <div className={styles.cardShareState}>
                        <div
                          className={`${styles.cardShareStateCircle} ${
                            template.shared ? styles.shared : ""
                          }`}
                        ></div>{" "}
                      </div>
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
                          isShared={template.shared}
                          onShare={() => console.log("배포 링크 공유")}
                          onUse={() => console.log("Use")}
                          onDeploy={() => openShareModal(template)}
                          onEdit={() => console.log("Edit")}
                          onRename={() => openRenameModal(template)}
                          onDelete={() => openDeleteModal(template)}
                          onStopSharing={() =>
                            handleStopSharingTemplate(template)
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.cardImage}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={`https://1am11m.store${template.imagePath}`}
                        alt="Template Screenshot"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>
                      {template.projectName}
                    </div>
                    <div className={styles.cardSubhead}>
                      {formatDate(template.updatedAt)}
                    </div>
                    <p>{template.content}</p>
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
              ))
            )}
          </div>
        )}
      </section>
    </>
  );
}
