const READY_PREFIXES = [
  'data:',
  'file:',
  'content:',
  'blob:',
  'http:',
  'https:',
  'ph:',
  'assets-library:',
];

export function toImageUri(uri: string) {
  if (READY_PREFIXES.some((prefix) => uri.startsWith(prefix))) {
    return uri;
  }

  return `data:image/jpeg;base64,${uri}`;
}
