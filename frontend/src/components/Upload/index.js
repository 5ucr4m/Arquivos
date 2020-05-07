import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import "./styles.css";

import Dropzone from "../Dropzone";
import Progress from "../ProgressBar";

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case "change":
      return { ...state, [action.name]: action.stage };
    case "reset":
      return {};
    default:
      throw new Error();
  }
}

export default function Upload() {
  const [uploadProgress, dispatch] = useReducer(reducer, initialState);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);

  function onFilesAdded(newFiles) {
    setFiles(files.concat(newFiles));
  }

  function sendRequest(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("http://localhost:8000/upload", formData, {
          onUploadProgress: function(progressEvent) {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            const stage = {
              state: "pending",
              percentage: percentCompleted
            };

            dispatch({ type: "change", name: file.name, stage });
          }
        })
        .then(data => resolve(data));
    });
  }

  async function uploadFiles() {
    dispatch({ type: "reset" });
    setUploading(true);

    const promises = [];

    files.forEach(file => {
      promises.push(sendRequest(file));
    });

    try {
      await Promise.all(promises);
      setSuccessfullUploaded(true);
      setUploading(false);
    } catch (e) {
      setSuccessfullUploaded(true);
      setUploading(false);
    }
  }

  function renderActions() {
    if (successfullUploaded) {
      return (
        <button
          onClick={() => {
            setFiles([]);
            setSuccessfullUploaded(false);
          }}
        >
          Clear
        </button>
      );
    } else {
      return (
        <button disabled={files.length < 0 || uploading} onClick={uploadFiles}>
          Upload
        </button>
      );
    }
  }

  function renderProgress(file) {
    return (
      <div className="ProgressWrapper">
        <Progress
          progress={
            uploadProgress[file.name] ? uploadProgress[file.name].percentage : 0
          }
        />
        {/* <img
          className="CheckIcon"
          alt="done"
          src="baseline-check_circle_outline-24px.svg"
          style={{
            opacity: uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
          }}
        /> */}
      </div>
    );
  }

  return (
    <div className="Upload">
      <span className="Title">Upload Files</span>
      <div className="Content">
        <div>
          <Dropzone
            onFilesAdded={onFilesAdded}
            disabled={uploading || successfullUploaded}
          />
        </div>
        <div className="Files">
          {files.map(file => {
            return (
              <div key={file.name} className="Row">
                <span className="Filename">{file.name}</span>
                {renderProgress(file)}
              </div>
            );
          })}
        </div>
      </div>
      <div className="Actions">{renderActions()}</div>
    </div>
  );
}
