import * as jose from 'jose'

const JWT_SECRET_KEY = 'mydiploma'
const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY)

export const withAuth =
    (...data) => 
    async (config) => {


        const token = config.headers.Authorization?.split(' ')[1]

        const verified = token ? await verifyToken(token) : false
        
        if(!verified) {
            return [403, { message : "Unauthorized"}]
        }

        return typeof data[0] == 'function' ? data[0](config) : data;
    }

export const verifyToken = async (token, options = undefined) => {
    try {
        const verification = await jose.jwtVerify(token, jwtSecret);
        return options?.returnPayload ? verification.payload : true;
    } catch {
        return false;
    }
}

export const generateRefreshToken = async (data) => {
    return await new jose.SignJWT({ data })
        .setProtectedHeader({ alg : 'HS256'})
        .setExpirationTime('30d')
        .sign(jwtSecret)
}