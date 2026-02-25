import type { PortableTextBlock } from "~/models/site-settings.interface";

export const usePortableText = () => {
  const renderBlock = (block: PortableTextBlock): string => {
    if (block._type !== "block" || !block.children) {
      return "";
    }

    const textContent = block.children
      .map((child) => {
        let text = child.text || "";

        // Apply marks (bold, italic, underline, code)
        if (child.marks && child.marks.length > 0) {
          if (child.marks.includes("strong")) {
            text = `<strong>${text}</strong>`;
          }
          if (child.marks.includes("em")) {
            text = `<em>${text}</em>`;
          }
          if (child.marks.includes("underline")) {
            text = `<u>${text}</u>`;
          }
          if (child.marks.includes("code")) {
            text = `<code>${text}</code>`;
          }
        }

        return text;
      })
      .join("");

    const style = block.style || "normal";
    const tag = style === "normal" ? "p" : style;

    return `<${tag}>${textContent}</${tag}>`;
  };

  const renderBlocks = (blocks: PortableTextBlock[] | undefined): string => {
    if (!blocks || !Array.isArray(blocks)) {
      return "";
    }
    return blocks.map((block) => renderBlock(block)).join("");
  };

  return {
    renderBlock,
    renderBlocks,
  };
};
