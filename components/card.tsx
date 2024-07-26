import React from "react";

const Card = ({ list }: { list: (number | string)[] }) => {
  return (
    <div className="card">
      {list?.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          {setProperty(`${idx}`)}
          <span>:</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

export default Card;
const setProperty = (key: string) => {
  switch (key) {
    case "0":
      return "id";
    case "1":
      return "phase";
    case "2":
      return "actual";
    case "3":
      return "base";
    default:
      return null;
  }
};
