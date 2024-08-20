import config from "../../site.config";

export default async function useFetcher(url: string, method: string) {
  const response = await fetch(config.server + url, { method });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
