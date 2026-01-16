import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const rs = await User.findOne({ 'email': email });
        if (rs != null) {
            return res.status(406).send("email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const rs2 = await User.create(
            {
                'email': email,
                'password': encryptedPassword,
                'imgUrl': imgUrl
            });
        const tokens = await generateTokens(rs2)
        res.status(201).send(
            {
                email: rs2.email,
                _id: rs2._id,
                imgUrl: rs2.imgUrl,
                ...tokens
            })
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const generateTokens = async (user: any) => {
    const expiresIn = process.env.JWT_EXPIRATION || '1h';
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn } as jwt.SignOptions);
    const refreshToken = jwt.sign({ _id: user._id, nonce: Math.random().toString(36) }, process.env.JWT_REFRESH_SECRET as string);
    if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
    } else {
        user.refreshTokens.push(refreshToken);
    }
    await user.save();
    return {
        'accessToken': accessToken,
        'refreshToken': refreshToken
    };
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = await User.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }

        const tokens = await generateTokens(user)
        return res.status(200).send(tokens);
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
}

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err, user: { '_id': string }) => {
        if (err) return res.sendStatus(401);
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb) {
                return res.sendStatus(401);
            }
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            } else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                await userDb.save();
                return res.sendStatus(200);
            }
        } catch (err: any) {
            return res.status(401).send(err?.message || 'Logout failed');
        }
    });
}

const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err, user: { '_id': string }) => {
        if (err) return res.sendStatus(401);
        try {
            const userDb = await User.findOne({ '_id': user._id });
            if (!userDb) {
                return res.sendStatus(401);
            }
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }
            const expiresIn = process.env.JWT_EXPIRATION || '1h';
            const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn } as jwt.SignOptions);
            const newRefreshToken = jwt.sign({ _id: user._id, nonce: Math.random().toString(36) }, process.env.JWT_REFRESH_SECRET as string);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();
            return res.status(200).send({
                'accessToken': accessToken,
                'refreshToken': newRefreshToken
            });
        } catch (err: any) {
            return res.status(401).send(err?.message || 'Token refresh failed');
        }
    });
}

export default {
    register,
    login,
    logout,
    refresh
}
