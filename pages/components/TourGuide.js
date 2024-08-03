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

export const TourGuideProvider = ({ children }) => {
  return <TourProvider steps={steps}>{children}</TourProvider>;
};

export const TourButton = () => {
  const { setIsOpen } = useTour();

  return <button onClick={() => setIsOpen(true)}>도움말</button>;
};
