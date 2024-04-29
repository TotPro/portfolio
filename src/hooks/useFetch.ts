import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

const rawTxtFetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.text());

export const useFetch = <T = any>(path: string) => {
  return useSWR<T>(path, fetcher);
};

export const useFetchRawTxt = (path: string) => {
  return useSWR(path, rawTxtFetcher);
};
