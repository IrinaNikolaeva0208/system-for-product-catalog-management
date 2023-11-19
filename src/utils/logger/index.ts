import { createLogger, format, transports, addColors } from 'winston';

const { combine, timestamp, printf, colorize } = format;
const loggingFormat = printf(({ level, message, timestamp }) => {
  if (typeof message == 'string') message = message.split('\r').join('');
  return `${timestamp} - ${level} : ${message}`;
});

const ApplicationLogger = createLogger({
  level: 'info',
  format: combine(colorize({ all: true }), timestamp(), loggingFormat),
  transports: [new transports.Console()],
});

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
});

export { ApplicationLogger };
