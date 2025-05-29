export async function fetchBiblePassage(bibleId, passage) {
    try {
      const res = await fetch("http://localhost:5050/api/bible", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bibleId, passage })
      });
  
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching passage:", err);
      throw err;
    }
  }
  