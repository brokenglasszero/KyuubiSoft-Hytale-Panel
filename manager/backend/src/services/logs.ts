import type { LogEntry } from '../types/index.js';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'UNKNOWN';

const LOG_PATTERNS: [RegExp, LogLevel][] = [
  [/\[ERROR\]|\[SEVERE\]|ERROR:|SEVERE:/i, 'ERROR'],
  [/\[WARN\]|\[WARNING\]|WARN:|WARNING:/i, 'WARN'],
  [/\[DEBUG\]|DEBUG:/i, 'DEBUG'],
  [/\[INFO\]|INFO:/i, 'INFO'],
];

export function detectLogLevel(line: string): LogLevel {
  for (const [pattern, level] of LOG_PATTERNS) {
    if (pattern.test(line)) {
      return level;
    }
  }
  return 'INFO';
}

export function parseLogLine(line: string): LogEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const level = detectLogLevel(trimmed);

  // Try to extract timestamp from Docker logs format
  // Format: 2024-01-14T12:00:00.000000000Z message
  let timestamp: string | null = null;
  let message = trimmed;

  const timestampMatch = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/.exec(trimmed);
  if (timestampMatch) {
    timestamp = timestampMatch[1];
    message = trimmed.substring(timestampMatch[0].length).replace(/^[\.\d]*Z?\s*/, '').trim();
  }

  return {
    timestamp: timestamp || new Date().toISOString(),
    level,
    message,
    raw: trimmed,
  };
}

export function parseLogs(rawLogs: string): LogEntry[] {
  const lines = rawLogs.split('\n');
  const entries: LogEntry[] = [];

  for (const line of lines) {
    const entry = parseLogLine(line);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}
