import crypto from "crypto";
export interface DecryptedPayload {
  token: string;
}

const algorithm = "aes-256-cbc";
const secretKey = crypto.randomBytes(32).toString("hex").slice(0, 32);
const iv = crypto.randomBytes(16);
export const encryptPayload = (payload: object): string => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(JSON.stringify(payload));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptPayload = (encryptedPayload: string): DecryptedPayload => {
  const textParts = encryptedPayload.split(":");
  const ivBuffer = Buffer.from(textParts.shift()!, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    ivBuffer
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString()) as DecryptedPayload;
};
