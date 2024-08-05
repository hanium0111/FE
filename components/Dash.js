export default function Dash() {
  const [templates, setTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showDeployed, setShowDeployed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await fetch(
          "https://1am11m.store/dashboards/dashboard/mydashboard",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch fetchDash:", error);
      }
    };
    fetchDash();
  }, []);

  const filteredTemplates = templates
    .filter((template) =>
      template.projectName.toLowerCase().includes(searchQuery.toLowerCase())
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
                      src={
                        template.profileImage
                          ? template.profileImage
                          : "/profile.png"
                      }
                    />
                  </div>
                </div>
                <div className={styles.cardHeaderInfo}>
                  <div className={styles.cardUser}>{template.displayName}</div>
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
                      onRename={() => openRenameModal(template)}
                      onDelete={() => openDeleteModal(template)}
                    />
                  )}
                </div>
              </div>
              <div className={styles.cardImage}>
                <Image
                  src={`https://1am11m.store${template.imagePath}`}
                  alt="Template Screenshot"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{template.projectName}</div>
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
          ))}
        </div>
      </section>
    </>
  );
}
