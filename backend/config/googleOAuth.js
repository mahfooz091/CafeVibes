const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifies a Google ID token sent from the frontend (One Tap / GSI button)
 * and returns the decoded payload containing user profile info.
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload(); // { email, name, picture, sub, ... }
};

module.exports = { googleClient, verifyGoogleToken };
