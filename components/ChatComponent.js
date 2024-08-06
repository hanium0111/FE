import { useEffect, useState, useRef } from "react";
import styles from "./ChatComponent.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { TourGuideProvider, TourButton } from "./TourGuide";
import Btn from "./Btn";

export default function ChatComponent() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(1);
  const [websiteType, setWebsiteType] = useState("");
  const [features, setFeatures] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [pageName, setPageName] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (step === 1 && messages.length === 0) {
      setMessages([
        { sender: "assistant", text: "어떤 홈페이지를 만들고 싶나요?" },
      ]);
    }
  }, [step, messages.length]);

  useEffect(() => {
    if (step > 5) {
      console.log({
        websiteType,
        features,
        mood,
        content,
        pageName,
      });
    }
  }, [step, websiteType, features, mood, content, pageName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { sender: "user", text: inputValue }]);
      saveResponse(inputValue);
      setInputValue("");
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  };

  const saveResponse = (response) => {
    switch (step) {
      case 1:
        setWebsiteType(response);
        break;
      case 2:
        setFeatures(response); // Updated to set 'features'
        break;
      case 3:
        setMood(response);
        break;
      case 4:
        setContent(response);
        break;
      case 5:
        setPageName(response);
        break;
      default:
        break;
    }
  };

  const handleGenerateClick = async () => {
    const requestData = {
      websiteType,
      features,
      mood,
      content,
      pageName,
    };

    try {
      const response = await fetch(
        "https://1am11m.store/generate/process-requirments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Generated Website Path:", result);
      } else {
        console.error("Failed to generate website:", response.statusText);
      }
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };

  const nextStep = () => {
    let nextQuestion = "";
    switch (step) {
      case 1:
        nextQuestion = "어떤 기능을 넣고 싶나요?";
        break;
      case 2:
        nextQuestion = "어떤 분위기를 넣고 싶나요?";
        break;
      case 3:
        nextQuestion = "어떤 내용을 넣고 싶나요?";
        break;
      case 4:
        nextQuestion = "페이지 이름을 알려주세요!";
        break;
      case 5:
        nextQuestion = "웹사이트를 생성하겠습니다.";
        break;
      default:
        return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "assistant", text: nextQuestion },
    ]);
    setStep((prevStep) => prevStep + 1);
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const editMessage = (index) => {
    setIsEditing(index);
    setTimeout(() => {
      const editableElement = document.querySelector(`[data-index="${index}"]`);
      if (editableElement) {
        editableElement.focus();
        editableElement.classList.add(styles.editing);
      }
    }, 0);
  };

  const saveEditedMessage = (index, text) => {
    const updatedMessages = messages.map((message, i) =>
      i === index ? { ...message, text } : message
    );
    setMessages(updatedMessages);
    setIsEditing(null);

    const editableElement = document.querySelector(`[data-index="${index}"]`);
    if (editableElement) {
      editableElement.classList.remove(styles.editing);
    }
  };

  return (
    <TourGuideProvider>
      <div className={styles.chatContainer}>
        <h1 className={styles.title}>
          웹사이트 만들기, <br /> 누구나 쉽게 할 수 있어요!
        </h1>
        <div className={styles.menuContainer}>
          <TourButton />
        </div>
        <div className={styles.chatBox} ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              className={`${styles.chatWrap} ${
                message.sender === "user"
                  ? styles.userChatWrap
                  : styles.assistantChatWrap
              }`}
              key={index}
            >
              <div
                className={`${styles.message} ${
                  message.sender === "assistant"
                    ? styles.assistantMessage
                    : styles.userMessage
                } ${message.sender === "user" ? styles.flexContainer : ""}`}
              >
                <p
                  contentEditable={isEditing === index}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => saveEditedMessage(index, e.target.innerText)}
                  data-index={index}
                  className={`${styles.flexText} ${
                    isEditing === index ? styles.editing : ""
                  }`}
                >
                  {message.text}
                </p>
                {message.sender === "user" && isEditing !== index && (
                  <button
                    onClick={() => editMessage(index)}
                    className={styles.editButton}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                )}
                {isEditing === index && (
                  <button
                    onClick={() =>
                      saveEditedMessage(index, messages[index].text)
                    }
                    className={styles.saveButton}
                  ></button>
                )}
              </div>
            </div>
          ))}
        </div>
        {step <= 5 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`${styles.input} input`}
              placeholder="여기에 답변을 입력하세요."
              disabled={step > 5}
            />
            <button type="submit" className={`${styles.button} button`}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </form>
        )}
        {step > 5 && (
          <Btn
            onClick={() => {
              handleGenerateClick;
            }}
            text={">>> 웹사이트 생성 <<<"}
            background={"#000"}
            border={"#4629F2"}
            textColor={"#fff"}
            width={"100%"}
          ></Btn>
        )}
      </div>
    </TourGuideProvider>
  );
}
