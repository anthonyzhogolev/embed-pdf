import { useEffect, useState } from "react";
import { axios } from "axios";
import icon from "./onCountRounded.svg";

import "./App.css";

const saveDocument = ({ link, name = "", fileFormat = "pdf" }) => {
  let fileName = name;
  if (name && fileFormat) {
    fileName = `${name}.${fileFormat}`;
  }

  const targetLink = document.createElement("a");
  targetLink.download = fileName;
  targetLink.href = link;
  targetLink.click();
  targetLink.remove();
};

const isSafari = () => {
  const isAppleVendor = navigator.vendor.indexOf("Apple") > -1;
  const isCriOS = navigator.userAgent.indexOf("CriOS") === -1;
  const isFxiOS = navigator.userAgent.indexOf("FxiOS") === -1;
  return isAppleVendor && isCriOS && isFxiOS;
};

const openDocument = (options) => {
  if (isSafari()) {
    saveDocument(options);
  } else {
    window.open(options.link, "_blank");
  }
};

function usePdf() {
  const [link, setLink] = useState("");
  useEffect(() => {
    console.log("useEffect...");

    const fetchData = async () => {
      const response = await fetch(
        encodeURI(
          "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
        ),
        {
          // mode: "no-cors",
        }
      );

      const buffer = await response.arrayBuffer();
      console.log("buffer.length", buffer.length);
      const myBlob = new Blob([buffer], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(myBlob);
      setLink(objectUrl);
    };

    fetchData();

    return () => {
      URL.revokeObjectURL(link);
      setLink("");
    };
  }, []);

  return {
    link: isSafari() ? null : link,
    download: () => {
      saveDocument({ link, name: "test-pdf", fileFormat: "pdf" });
    },
    preview: () => {
      openDocument({ link, name: "test-pdf", fileFormat: "pdf" });
    },
  };
}

function App() {
  const { link, download, preview } = usePdf();

  const showPreview = false && link !== null;

  const style = {
    width: "200px",
    height: "200px",
  };
  return (
    <>
      <div onClick={preview} style={{ cursor: "pointer" }}>
        {showPreview ? (
          <object data={link} style={style} type="application/pdf">
            <param name="data" value={link} />
            <span>NOT RENDERED...</span>
          </object>
        ) : (
          <img src={icon} className="icon" alt="logo" />
        )}
      </div>
      <div onClick={download}>Download PDF</div>
    </>
  );
}

export default App;
