import fs from "fs";
import axios from "axios";
import path from "path";
import pdfMake from "pdfmake/build/pdfmake.js";
import vfsFonts from "pdfmake/build/vfs_fonts.js";

// pdfMake.vfs = vfsFonts.pdfMake.vfs;

var fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};

const getImageBase64 = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return base64Image;
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    throw error;
  }
};

// Función para generar el PDF
export const generatePdf = async (req, res) => {
  const { imageUrl, compraWithDetalles } = req.body;

  console.log(req.body);

  var PdfPrinter = require("../scripts/print.js");
  var printer = new PdfPrinter(fonts);

  try {
    // Obtener la imagen en base64
    const base64Image = await getImageBase64(imageUrl);

    // Definición del documento PDF
    const documentDefinition = {
      content: [
        { text: `Compra #${compraWithDetalles.com_codigo}`, style: "header" },
        [
          {
            text: [
              { text: "Fecha: ", bold: true },
              { text: `${compraWithDetalles.com_fecha_compra}` },
            ],
            margin: [0, 10, 0, 10],
          },
          {
            text: [
              { text: "Proveedor: ", bold: true },
              { text: `${compraWithDetalles.proveedor}` },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            text: [
              { text: "RUC/CI: ", bold: true },
              { text: `${compraWithDetalles.ruc}` },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            image: base64Image, // URL de la imagen
            width: 100, // Ajusta el tamaño de la imagen
            alignment: "right", // Alinea la imagen a la derecha
            margin: [0, 10, 0, 0], // Margen para separar la imagen de los textos
          },
        ],
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              ["Producto", "Cantidad", "Precio", "Subtotal"],
              ...compraWithDetalles.detalles.map((detalle) => [
                detalle.prod_nombre,
                detalle.prod_cantidad,
                detalle.prod_precio_unitario,
                detalle.prod_cantidad * detalle.prod_precio_unitario, // Subtotal correcto
              ]),
            ],
          },
        },
        {
          text: `Total: ${compraWithDetalles.com_precio_total}`,
          style: "total",
          alignment: "right",
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        total: { fontSize: 14, bold: true },
      },
    };

    // Crear el PDF
    var pdfDoc = printer.createPdfKitDocument(documentDefinition);
    pdfDoc.pipe(fs.createWriteStream("pdfs/basics.pdf"));
    pdfDoc.end();

    // Guardar el PDF en el servidor
    // pdfDocGenerator.getBuffer((buffer) => {
    //   fs.writeFileSync(path.join(__dirname, "compra.pdf"), buffer);
    //   console.log("PDF generado y guardado correctamente");
    res
      .status(200)
      .json({ message: "PDF generado y guardado correctamente.", base64Image });
    // });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ message: "Error al generar el PDF." });
  }
};
