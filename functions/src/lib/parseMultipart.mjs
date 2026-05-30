import Busboy from "busboy";
import { PassThrough } from "node:stream";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function detectMimeType(buf) {
  if (buf.length < 12) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "image/webp";
  return null;
}

/**
 * Parses a multipart/form-data request from an Azure Functions v4 Request object.
 * Returns { fields, imageBuffer, imageFilename, imageMimeType }.
 * Throws with a user-facing message if the image fails validation.
 */
export async function parseMultipart(request) {
  const contentType = request.headers.get("content-type") ?? "";
  const rawBuffer = Buffer.from(await request.arrayBuffer());

  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: { "content-type": contentType } });
    const fields = {};
    let imageBuffer = null;
    let imageFilename = "upload";

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (name, stream, info) => {
      if (name === "image") {
        imageFilename = info.filename || "upload";
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          imageBuffer = Buffer.concat(chunks);
        });
      } else {
        stream.resume(); // drain unrecognised file fields
      }
    });

    busboy.on("finish", () => {
      if (!imageBuffer || imageBuffer.length === 0) {
        return resolve({ fields, imageBuffer: null, imageFilename: null, imageMimeType: null });
      }

      if (imageBuffer.length > MAX_IMAGE_BYTES) {
        return reject(new Error("Image must be 5 MB or smaller."));
      }

      const mimeType = detectMimeType(imageBuffer);
      if (!mimeType || !ALLOWED_TYPES.has(mimeType)) {
        return reject(new Error("Image must be a JPEG, PNG, or WebP file."));
      }

      resolve({ fields, imageBuffer, imageFilename, imageMimeType: mimeType });
    });

    busboy.on("error", reject);

    const passthrough = new PassThrough();
    passthrough.pipe(busboy);
    passthrough.end(rawBuffer);
  });
}
