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
    console.log("Callback function triggered"); // Check if the function is called
    try {
        const { code } = req.query;
        console.log("Received authorization code:", code); // Log the received code

        if (!code) {
            console.log("No authorization code received");
            return res.status(400).json({ error: "Authorization code is required" });
        }

        // Step 1: Exchange the authorization code for an access token and ID token
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: "http://localhost:5000/api/auth/callback",  // Use your redirect URI
                grant_type: "authorization_code",
                code: code,
            },
        });

        console.log("Google token response:", tokenResponse.data);  // Log the entire response

        const { id_token } = tokenResponse.data;

        if (!id_token) {
            console.log("ID token is missing in the response");
            return res.status(400).json({ error: "ID token missing from Google response" });
        }

        // Step 2: Decode and log the id_token to ensure it's an RS256 token
        try {
            const decoded = jwt.decode(id_token, { complete: true });
            console.log("Decoded ID token:", decoded);  // Log the decoded JWT structure
        } catch (err) {
            console.error("Error decoding token:", err);
            return res.status(400).json({ error: "Error decoding the token" });
        }

        // Step 3: Verify the Google ID token (RS256) using Google's public keys
        console.log("Verifying ID token with Google OAuth2 client...");
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is the correct audience (your Google Client ID)
        });

        console.log("Ticket received from Google:", ticket); // Log the ticket response

        const { email, name, sub } = ticket.getPayload();
        console.log("Verified user payload:", { email, name, sub }); // Log user info from Google

        // Step 4: Find or create the user in your database
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log("User not found, creating a new one...");
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId: sub,
                    role: "RENTER",

                },
            });
        }

        console.log("User:", user); // Log the user info

        // Step 5: Generate your custom JWT (access token) for your app (signed with HS256)
        const accessToken = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET,  // Secret for signing your JWT (HS256)
            { expiresIn: "1d" }
        );

        console.log("Generated access token:", accessToken); // Log the access token

        // Step 6: Redirect to frontend with the custom JWT (access token)
        res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);

    } catch (error) {
        console.error("Google Auth Callback Error:", error);  // Log any error that occurs during the process
        res.status(500).json({ error: "Internal Server Error" });
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
  
      res.json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Role Update Error:", error);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
  