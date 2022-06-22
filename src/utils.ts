/**
 * Converts a buffer into a DataURI for embedding within html.
 * @param input The input to be converted.
 */
export function toDataUri(input: Buffer, imageType: "png" | "jpeg" = "png"): string {
    return `data:image/${imageType};base64,${input.toString("base64")}`;
}