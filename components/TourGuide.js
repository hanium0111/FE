import React from "react";
import { TourProvider, useTour } from "@reactour/tour";

const steps = [
  {
    selector: ".input",
    content: "질문에 맞는 답변을 적어주세요!",
  },
  {
    selector: ".button",
    content: "이 버튼을 눌러 전송하세요!",
  },
];

const tourStyles = {
  popover: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "10px",
    padding: "30px",
    maxWidth: "300px",
  }),

  arrow: (base, state) => ({
    ...base,
    color: "ccc",
  }),

  badge: (base) => ({
    ...base,
    backgroundColor: "#4629f2",
    color: "#fff",
  }),
  button: (base, state) => ({
    ...base,
    color: "#fff",
    background: "none #fff",
    backgroundColor: "#fff",
  }),
  close: (base) => ({
    ...base,
    color: "#000",
    background: "none #fff",
    backgroundColor: "#fff",
    top: "15px",
    right: "15px",
  }),
  controls: (base) => ({
    ...base,
    buttonColor: "#fff",
  }),
  dot: (base, state) => ({
    ...base,
    backgroundColor: state.current ? "#4629f2" : "#ccc",
  }),
  maskArea: (base) => ({
    ...base,
    fill: "rgba(0, 0, 0, 0.9)",
  }),
  maskWrapper: (base) => ({
    ...base,
    opacity: 0.7,
  }),
};

export const TourGuideProvider = ({ children }) => {
  return (
    <TourProvider steps={steps} styles={tourStyles}>
      {children}
    </TourProvider>
  );
};

export const TourButton = () => {
  const { setIsOpen } = useTour();

  return <button onClick={() => setIsOpen(true)}>도움말</button>;
};

const TourGuidePage = () => {
  return (
    <div>
      <TourButton />
    </div>
  );
};

export default TourGuidePage;
