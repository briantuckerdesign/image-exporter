import { windowLogging, loggingLevel } from "./capture";

/** This package can be imported in non-DOM contexts (Node / SSR). */
const hasWindow = typeof window !== "undefined";

export const log = {
  info: (...messages: unknown[]) => logAction(messages, "info"),
  error: (...messages: unknown[]) => logAction(messages, "error"),
  verbose: (...messages: unknown[]) => logAction(messages, "verbose"),
  progress: (progress: number, total: number) => logProgress(progress, total),
  group: {
    open: (...messages: unknown[]) => logAction(messages, "group"),
    close: (...messages: unknown[]) => logAction(messages, "groupEnd"),
  },
};

async function logAction(messages: unknown[], type: LogType = "info") {
  const combinedMessage = messages
    .map((msg) => (typeof msg === "object" ? JSON.stringify(msg) : msg))
    .join(" ");

  switch (type) {
    case "info":
      if (loggingLevel === "info" || loggingLevel === "verbose") {
        console.log(...messages);
      }
      break;
    case "error":
      if (loggingLevel === "error" || loggingLevel === "verbose") {
        console.error(...messages);
      }
      break;
    case "verbose":
      if (loggingLevel === "verbose") {
        console.log(...messages);
      }
      break;
    case "group":
      console.group(...messages);
      break;
    case "groupEnd":
      console.groupEnd();
      break;
  }

  if (windowLogging && hasWindow)
    window.imageExporterLogs.push({ message: combinedMessage, type });
}

async function logProgress(progress: number, total: number) {
  if (windowLogging && hasWindow) {
    window.imageExporterProgress.push([progress, total]);
  }
}

type LogType = "info" | "error" | "verbose" | "progress" | "group" | "groupEnd";

type Log = {
  message: string;
  type: LogType;
  progress?: number;
  total?: number;
};

type Progress = [number, number];

declare global {
  interface Window {
    imageExporterLogs: Log[];
    imageExporterProgress: Progress[];
  }
}

if (hasWindow) {
  window.imageExporterLogs = [];
  window.imageExporterProgress = [];
}
