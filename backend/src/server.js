import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

// multer({ dest: uploadFolder });

import UploadController from "./Controller/Upload";

const server = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

const uploadFolder = path.resolve(__dirname, "public", "uploads");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // error first callback
    cb(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    // error first callback
    const name = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, name);
  }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({ storage });

server.use(cors(corsOptions));

server.get("/", (req, res) => res.json({ message: "Bem Vindo!!" }));
// server.post("/file/upload", UploadController.upload);

server.post("/upload", upload.single("file"), (req, res) =>
  res.status(200).json({ message: "Upload Realizado com sucesso!!" })
);

server.use(express.static(path.resolve(__dirname, "public")));

server.listen(8000, () => {
  console.log("Server started!");
});
