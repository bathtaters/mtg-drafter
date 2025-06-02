/** Simple SHA-256 hash of text. Returns null if input is falsy. */
export const hashText = (text?: string | null) =>
  !text
    ? Promise.resolve(null)
    : window.crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(text))
        .then((z) =>
          Array.from(new Uint8Array(z))
            .map((d) => d.toString(16).padStart(2, "0"))
            .join("")
        );
