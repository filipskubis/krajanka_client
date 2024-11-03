import { toPng } from "html-to-image";

const printNodeAsImage = async (node) => {
  try {
    const dataUrl = await toPng(node);
    const newWindow = window.open();
    newWindow.document.write(
      `<img src="${dataUrl}" onload="window.print(); window.close()">`
    );
  } catch (error) {
    console.error("Error creating image:", error);
  }
};

export default printNodeAsImage;
