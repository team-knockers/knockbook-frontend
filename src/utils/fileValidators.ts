export const MAX_FILES = 3;
export const MAX_SIZE = 20 * 1024 * 1024; // 20MB
export const ALLOWED_EXT = ["gif", "png", "jpg", "jpeg", "mov", "mp4", "log", "txt"];

export function getExtension(name: string): string {
  return (name.split(".").pop() || "").toLowerCase();
}

export function validateFiles(prevFiles: File[], newFiles: File[]) {
  const errors: string[] = [];
  const remaining = MAX_FILES - prevFiles.length;

  const uniqueFiles = newFiles.filter(
    (f) => !prevFiles.some(p => 
      p.name === f.name 
      && p.size === f.size 
      && p.lastModified === f.lastModified)
  );

  const validFiles = uniqueFiles.filter(f => {
    const ext = getExtension(f.name);
    if (!ALLOWED_EXT.includes(ext)) {
      errors.push(`허용되지 않는 형식: ${f.name}`);
      return false;
    }
    if (f.size > MAX_SIZE) {
      errors.push(`용량 초과(20MB): ${f.name}`);
      return false;
    }
    return true;
  });

  const accepted = validFiles.slice(0, remaining);
  if (validFiles.length > remaining) {
    errors.push(`최대 ${MAX_FILES}개까지만 첨부 가능합니다.`);
  }

  return { accepted, errors };
}
