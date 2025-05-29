import React, { useEffect, useState } from "react";
import { fetchBiblePassage } from "../api/bible";

const BibleViewer = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetchBiblePassage("de4e12af7f28f599-01", "GEN.1").then(data => {
      setText(data?.data?.content || "No content available.");
    });
  }, []);

  return (
    <div>
      <h1>Genesis 1</h1>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default BibleViewer;
