import axios from "axios";

export const getImageBase64 = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    let base64Image = Buffer.from(response.data, "binary").toString("base64");
    base64Image = `data:image/jpeg;base64,${base64Image}`;
    res.status(200).json({ ok: true, base64Image });
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res.status(500).json({ ok: false, message: error });
  }
};
