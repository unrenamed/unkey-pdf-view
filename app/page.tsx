"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleX,
  Key,
  LoaderIcon,
  RefreshCcw,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const savedApiKey = window.localStorage.getItem("apiKey");
    setApiKey(savedApiKey ?? "");
    setIsLoading(false);
  }, []);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      try {
        const response = await axiosInstance.get(
          `/api/viewPage?key=${apiKey}&page=${pageNum}`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPage(pageNum);
        setError("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    },
    [apiKey]
  );

  const generateNewKey = async () => {
    setIsGenerating(true);
    try {
      const response = await axiosInstance.post("/api/generateKey", {
        oldKey: apiKey,
      });
      localStorage.setItem("apiKey", response.data.apiKey);
      setApiKey(response.data.apiKey);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (apiKey.length) fetchPage(1);
  }, [fetchPage, apiKey]);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-between flex lg:flex-row lg:max-w-none lg:px-0">
      {apiKey.length > 0 && (
        <div className="absolute flex items-center right-4 top-4 md:right-8 md:top-8 gap-2 text-sm text-black">
          <Key className="size-4" />
          {apiKey}
          <button
            className="rounded-xl p-1.5 bg-black/5 active:scale-95"
            title="Refresh API key"
            onClick={generateNewKey}
          >
            {isGenerating ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <RefreshCcw className="size-4" />
            )}
          </button>
        </div>
      )}

      <div className="relative h-full flex-col flex p-10 text-white bg-black dark:border-r w-full lg:w-2/5 lg:min-h-screen">
        <Link
          href="https://unkey.com"
          target="_blank"
          className="relative z-20 flex items-center text-lg font-medium"
        >
          Unkey.com
        </Link>
        <div className="mb-8 sm:mt-16">
          <h2 className="sm:text-[40px] sm:text-5xl font-medium tracking-tight blog-heading-gradient leading-[56px] md:w-2/3 xl:w-full text-balance">
            Protecting digital content with temporary access
          </h2>

          <p className="mt-2 text-base leading-6 sm:mt-6 lg:mt-12 text-white/60">
            Allow your users to generate an API key with temporary access to
            download an e-book for a limited period (e.g., 10 minutes).
          </p>
        </div>
      </div>
      <div className="lg:p-8 w-full lg:w-3/5 text-black bg-zinc-50 border-l min-h-screen flex flex-col justify-center p-4">
        {isLoading ? null : apiKey.length < 1 ? (
          <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6">
            <div className="flex flex-col space-y-3 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                No API key found
              </h1>
              <p className="text-sm text-muted-foreground">
                Click the button below to get a temporary access to the e-book
              </p>
              <button
                onClick={generateNewKey}
                disabled={isGenerating}
                className="rounded-md active:scale-95 bg-black text-white px-4 py-2 disabled:opacity-30 flex items-center justify-center"
              >
                {isGenerating && <LoaderIcon className="mr-4 animate-spin" />}
                <span className="text-md">Generate new key</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="600"
                height="700"
                className="border border-gray-300 rounded-md"
              />
            )}

            <div className="flex flex-col items-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => fetchPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-md active:scale-95 bg-black text-white px-4 py-2 text-sm disabled:opacity-30 flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Previous page
                </button>
                <button
                  onClick={() => fetchPage(page + 1)}
                  className="rounded-md active:scale-95 bg-black text-white px-4 py-2 text-sm disabled:opacity-30 flex items-center justify-center"
                >
                  Next page
                  <ArrowRight className="ml-2 size-4" />
                </button>
              </div>
            </div>

            {error.length > 0 && (
              <div className="py-2 px-4 rounded-md border border-red-700 bg-red-100 flex items-center justify-center">
                <CircleX className="mr-2 size-4 text-red-500" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
