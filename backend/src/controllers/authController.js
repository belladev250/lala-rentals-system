import prisma from '../config/prisma.js';

import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";

const client =  new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleSignIn = async (req,res) => {

const {token} = req.body

const ticket = await client.verifyIdToken({
  idToken :token,
  audience: process.env.GOOGLE_CLIENT_ID
})

const { email, name, sub } = ticket.getPayload();

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

const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});

res.json({ token: accessToken, user });

}
