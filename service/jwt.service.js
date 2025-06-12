const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor(accessKey, refreshKey, accessTime, refreshTime) {
    this.accessKey = accessKey;
    this.refreshKey = refreshKey;
    this.accessTime = accessTime;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });

    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, this.accessKey);
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

let adminJwtService = new JwtService(
  config.get("adminAccess_key"),
  config.get("adminRefresh_key"),
  config.get("adminAccess_time"),
  config.get("adminRefresh_time")
);

let clientJwtService = new JwtService(
  config.get("clientAccess_key"),
  config.get("clientRefresh_key"),
  config.get("clientAccess_time"),
  config.get("clientRefresh_time")
);

let ownerJwtService = new JwtService(
  config.get("ownerAccess_key"),
  config.get("ownerRefresh_key"),
  config.get("ownerAccess_time"),
  config.get("ownerRefresh_time")
);

module.exports = {
  adminJwtService,
  clientJwtService,
  ownerJwtService,
};
