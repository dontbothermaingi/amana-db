import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";

export default function NewsletterEditor() {
  const [value, setValue] = useState("<p>Start writing your newsletter...</p>");

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>📰 Create Newsletter</h2>
      <RichTextEditor value={value} onChange={setValue} />
      <div style={{ marginTop: "2rem" }}>
        <h4>Preview:</h4>
        <div
          style={{ border: "1px solid #ddd", padding: "10px" }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
}
