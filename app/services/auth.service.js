const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const maxAge = 3 * 60 * 60

const createToken = (data) => {
    return jwt.sign(data, jwtSecret, {
        expiresIn: maxAge,
    })
}

const createJWT = ({ response, data }) => {
    const token = createToken(data)
    response.cookie("jwt", token, {
        httpOnly: true, // prevent access from javascript
        maxAge: maxAge * 1000, // convert to milliseconds
        sameSite: 'Lax', // allow cross-site
        secure: false, // allow http
        
    });
    return token
}

const resetJWT = ({ response }) => {
    response.cookie("jwt", "", {
        maxAge: 1,
    });
}

module.exports = {
    createToken,
    createJWT,
    resetJWT,
}