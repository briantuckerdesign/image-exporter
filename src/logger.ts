import { windowLogging, loggingLevel } from "./capture";

export const log = {
  info: (...messages: any[]) => logAction(messages, "info"),
  error: (...messages: any[]) => logAction(messages, "error"),
  verbose: (...messages: any[]) => logAction(messages, "verbose"),
  progress: (progress: number, total: number) => logProgress(progress, total),
};

async function logAction(messages: any[], type: LogType = "info") {
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
  }

  if (windowLogging) window.imageExporterLogs.push({ message: combinedMessage, type });
}

async function logProgress(progress: number, total: number) {
  if (windowLogging) {
    window.imageExporterProgress.push([progress, total]);
  }
}

type LogType = "info" | "error" | "verbose" | "progress";

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

window.imageExporterLogs = [];
window.imageExporterProgress = [];
