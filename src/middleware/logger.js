const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;
    const statusCode = res.statusCode;

    // Use neat terminal coloring: Green for 2xx, Yellow for 3xx, Orange for 4xx, Red for 5xx
    let color = '\x1b[0m'; // Default
    if (statusCode >= 200 && statusCode < 300) {
      color = '\x1b[32m'; // Green
    } else if (statusCode >= 300 && statusCode < 400) {
      color = '\x1b[33m'; // Yellow
    } else if (statusCode >= 400 && statusCode < 500) {
      color = '\x1b[35m'; // Magenta/Orange
    } else if (statusCode >= 500) {
      color = '\x1b[31m'; // Red
    }

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${color}${statusCode}\x1b[0m - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
