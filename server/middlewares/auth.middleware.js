import jwt from 'jsonwebtoken'
export const AuthMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token format"
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token was generated with { id }, so use decoded.id
        req.user = { id: decoded.id };
        
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Not authorized, token failed'
        });
    }
}
