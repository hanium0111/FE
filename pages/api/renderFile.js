import fetch from "node-fetch";

export default async function handler(req, res) {
  const { filename } = req.query;

  // Fetch file structure from external URL
  let fileStructure;
  try {
    const response = await fetch("http://x.x.x.x/getFile?fn=");
    if (!response.ok) {
      throw new Error("Failed to fetch file structure");
    }
    fileStructure = await response.json();
  } catch (error) {
    console.error("Error fetching file structure:", error);
    res.status(500).json({ error: "Failed to fetch file structure" });
    return;
  }

  // If no filename is provided, return the file structure
  if (!filename) {
    res.status(200).json({ structure: fileStructure });
    return;
  }

  // Find the file content from the file structure
  const fileUrl = `http://x.x.x.x/getFile?fn=${filename}`;
  try {
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to fetch file content");
    }
    const fileContent = await fileResponse.text();
    const isBinary = /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf)$/.test(
      filename
    );

    if (isBinary) {
      res.status(200).json({ content: fileUrl, isBinary, name: filename });
    } else {
      res.status(200).json({ content: fileContent, isBinary, name: filename });
    }
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(404).json({ error: "File not found" });
  }
}
