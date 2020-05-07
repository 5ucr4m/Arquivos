import React, { useRef, useState } from "react";

import UploadIcon from "../../assets/img/upload.svg";

import "./styles.css";

export default function Dropzone({ onFilesAdded, disabled }) {
  const fileInputRef = useRef();
  const [hightlight, setHightlight] = useState(false);

  function openFileDialog() {
    if (disabled) return;
    fileInputRef.current.click();
  }

  function handleOnFileAdded(evt) {
    const array = fileListToArray(evt.target.files);
    onFilesAdded(array);
  }

  function fileListToArray(files) {
    const array = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      array.push(element);
    }
    return array;
  }

  function onDragOver(evt) {
    evt.preventDefault();

    if (disabled) return;
    setHightlight(true);
  }

  function onDragLeave(evt) {
    setHightlight(false);
  }

  function onDrop(evt) {
    evt.preventDefault();

    if (disabled) return;
    const files = evt.dataTransfer.files;

    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }

    setHightlight(false);
  }

  return (
    <div
      className={`Dropzone ${hightlight ? "Highlight" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <img alt="upload" className="Icon" src={UploadIcon} />
      <input
        ref={fileInputRef}
        className="FileInput"
        type="file"
        multiple
        onChange={handleOnFileAdded}
      />
      <span>Upload Files</span>
    </div>
  );
}
