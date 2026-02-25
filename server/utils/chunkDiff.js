export const splitDiffIntoChunks = (diff, maxChars = 6000) => {
    const chunks = [];
    let current = "";

    const lines = diff.split("\n");

    for (const line of lines) {
        if ((current + line).length > maxChars) {
            chunks.push(current);
            current = "";
        }
        current += line + "\n";
    }

    if (current.length > 0) chunks.push(current);

    return chunks;
};
