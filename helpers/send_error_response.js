function sendErrorResponse(error, res) {
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Token yaroqsiz (invalid signature)" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token muddati tugagan" });
  }

  return res.status(500).json({
    message: "Noma'lum server xatosi",
    error: error.message,
  });
}

module.exports = {
  sendErrorResponse,
};
