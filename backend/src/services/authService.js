import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (email, name, googleId, role)=>{

    return await prisma.user.create({

        data:{

            email,
            name,
            googleId,
            role

        }
    })
}