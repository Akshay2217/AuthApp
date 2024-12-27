import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    // console.log("token>>:",token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret key as in your login function
        //  console.log("req.user>>:",decoded);
        req.user = decoded; // Add decoded token data to the request object
        console.log("req.user>>:",req.user);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;
