import { useEffect, useState } from "react";
import { axios } from "axios";

import "./App.css";

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
  return link;
}

function App() {
  const link = usePdf();

  const style = {
    width: "200px",
    height: "200px",
  };
  return (
    <>
      <object data={link} style={style}  type="application/pdf">
        <span>NOT RENDERED...</span>
      </object>
      
    </>
  );
}

export default App;
