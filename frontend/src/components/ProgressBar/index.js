import React from "react";

// import { Container } from './styles';
import "./styles.css";

export default function ProgressBar({ progress = 10 }) {
  return (
    <div className="ProgressBar">
      <div className="Progress" style={{ width: progress + "%" }} />
    </div>
  );
}
