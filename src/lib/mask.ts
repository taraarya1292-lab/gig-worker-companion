export function maskSensitive(value: string): string {
  return value
    .replace(/\b[A-Z]{5}\d{4}[A-Z]\b/gi, "[PAN hidden]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[ID hidden]")
    .replace(/\b\d{10,16}\b/g, "[number hidden]");
}

export function clip(value: string, max: number): string {
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}
