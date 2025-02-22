import prisma from '../config/prisma.js';
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



export const googleSignIn = async (req, res) => {

  try {
      // First verify if this is a Google ID token or our JWT token
      const { token } = req.body;
      console.log("Received token:", token);

      // If it's our JWT token, verify it directly
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          // If verification succeeds, find the user
          const user = await prisma.user.findUnique({ 
              where: { id: decoded.id }
          });
          
          if (!user) {
              throw new Error("User not found");
          }
          
          return res.json({ token, user });
      } catch (jwtError) {
          // If JWT verification fails, try verifying as Google ID token
          const ticket = await client.verifyIdToken({
              idToken: token,
              audience: process.env.GOOGLE_CLIENT_ID,
          });

          const { email, name, sub } = ticket.getPayload();

          // Find or create user
          let user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
              user = await prisma.user.create({
                  data: {
                      email,
                      name,
                      googleId: sub,
                      role: "RENTER",
                  },
              });
          }

          // Generate new JWT token
          const accessToken = jwt.sign(
              { id: user.id, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: "1d" }
          );

          return res.json({ token: accessToken, user });
      }
  } catch (error) {
      console.error("Google SignIn Error:", error);
      res.status(401).json({ 
          error: "Invalid token or authentication failed",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
};



export const googleAuthCallback = async (req, res) => {
    console.log("Callback function triggered");
    try {
        const { code } = req.query;
        console.log("Received authorization code:", code);

        if (!code) {
            console.log("No authorization code received");
            return res.status(400).json({ error: "Authorization code is required" });
        }

        // Step 1: Exchange the authorization code for tokens
        console.log("Exchanging code for tokens...");
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: "http://localhost:5000/api/auth/callback",
                grant_type: "authorization_code",
                code: code,
            },
        });

        console.log("Token response received");
        const { id_token } = tokenResponse.data;

        if (!id_token) {
            console.log("ID token is missing in the response");
            return res.status(400).json({ error: "ID token missing from Google response" });
        }

        // Step 2: Verify the ID token
        console.log("Verifying ID token...");
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, sub } = ticket.getPayload();
        console.log("User info from Google:", { email, name, sub });

        // Step 3: Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log("Creating new user...");
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId: sub,
                    role: "RENTER",
                },
            });
        }

        // Step 4: Generate JWT
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Step 5: Redirect with token
             const redirectUrl = `http://localhost:3000/home?token=${accessToken}`;
            console.log("Redirecting to:", redirectUrl);
           res.redirect(redirectUrl);

    } catch (error) {
        console.error("Google Auth Callback Error:", error);
        // Redirect to frontend with error
        res.redirect(`http://localhost:3000?error=${encodeURIComponent(error.message)}`);
    }
};




export const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        const token = jwt.sign(
            { id: updatedUser.id, role: updatedUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        res.json({
            message: "Role updated successfully",
            user: updatedUser,
            token, 
        });
    } catch (error) {
        console.error("Role Update Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


  export const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

