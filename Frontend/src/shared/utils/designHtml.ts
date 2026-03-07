export function extractMainContentFromDesign(html: string): string {
  if (typeof window === "undefined") {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const main = doc.querySelector("main");
  if (main) {
    return main.innerHTML;
  }

  const root = doc.body.firstElementChild;
  if (!root) {
    return doc.body.innerHTML;
  }

  root.querySelectorAll("header, footer").forEach((node) => node.remove());
  return root.innerHTML;
}