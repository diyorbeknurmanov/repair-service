const { sendErrorResponse } = require("../helpers/send_error_response");
const { clientJwtService } = require("../service/jwt.service");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res
        .status(401)
        .send({ message: "Authorization header not found" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer token not found" });
    }

    // const decodedPayload = jwt.verify(token, config.get("tokenKey"));
    const decodedPayload = await clientJwtService.verifyAccessToken(token);

    req.client = decodedPayload;

    next();
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
