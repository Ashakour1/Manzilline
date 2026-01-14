import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // const userExists = await User.findOne({ email });
    // if (userExists) {
    //     res.status(400);
    //     throw new Error('User already exists');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role,
            status: 'ACTIVE' // Default to active for new registrations
        }
    });

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
    });

});


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    // Check if user is inactive
    if (user.status === 'INACTIVE') {
        res.status(403);
        throw new Error('Your account is inactive. Please contact support.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(400);
        throw new Error('Invalid password');
    }

    const token = generateToken(user.id);

    // Update user online status and lastSeen
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isOnline: true,
            lastSeen: new Date(),
        },
    });

    // Log login activity
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
    const userAgent = req.headers['user-agent'];

    prisma.userActivity
        .create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                description: 'User logged in',
                ipAddress,
                userAgent,
            },
        })
        .catch((error) => {
            // Log error but don't block login
            console.error('Error logging login activity:', error);
        });

    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: token,
    });
});

export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    // If user is authenticated, log logout activity and set offline
    if (userId) {
        // Log logout activity
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0];
        const userAgent = req.headers['user-agent'];

        await prisma.userActivity.create({
            data: {
                userId,
                action: 'LOGOUT',
                description: 'User logged out',
                ipAddress,
                userAgent,
            },
        }).catch((error) => {
            // Log error but don't block logout
            console.error('Error logging logout activity:', error);
        });

        // Set user offline
        await prisma.user.update({
            where: { id: userId },
            data: {
                isOnline: false,
                lastSeen: new Date(),
            },
        }).catch((error) => {
            // Log error but don't block logout
            console.error('Error setting user offline:', error);
        });
    }

    res.status(200).json({
        message: 'Logged out successfully',
    });
});


export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
