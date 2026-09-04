export function getBbColor(bbWidth) {
  if (bbWidth >= 15) {
    return "success.main";
  }

  if (bbWidth >= 10) {
    return "warning.main";
  }

  return "text.primary";
}
