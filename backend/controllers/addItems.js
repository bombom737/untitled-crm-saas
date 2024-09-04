import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from './models/userModel.js';

const router = Router();

//Middleware to authenticate the user token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401); // 401 error Unauthorized, missing token

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid or expired token

        req.user = user; // Attach the decoded token (with user info) to req object
        next();
    });
};

// Route to add an item to the specified array (customersArray or salesArray)
router.post('/add-item', authenticateToken, async (req, res) => {
    const { arrayType, item } = req.body; // Get the array type and item to be added from request body

    if (!arrayType || !item) {
        return res.status(400).send('Missing arrayType or item data');
    }

    try {
        // Find the currently logged-in user using the user info from the token
        const user = await UserModel.findById(req.user.id); // Assuming token contains user ID as `req.user.id`

        if (!user) return res.status(404).send('User not found');

        // Depending on the array type, add the item to the correct array
        if (arrayType === 'customersArray') {
            user.customerArray.push(item);
        } else if (arrayType === 'salesArray') {
            user.salesArray.push(item); // Assuming you have a `salesArray` in your schema
        } else {
            return res.status(400).send('Invalid array type');
        }

        // Save the updated user document
        await user.save();

        res.status(200).send('Item added successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/remove-item', authenticateToken, async (req, res) => {
    const { arrayType, item } = req.body; // Get the array type and item to be added from request body

    if (!arrayType || !item) {
        return res.status(400).send('Missing arrayType or item data');
    }
    try {
        const user = await UserModel.findById(req.user.id); // Assuming token contains user ID as `req.user.id`

        if (!user) return res.status(404).send('User not found');

        res.status(200).send('Item removed successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Server error');
    }
});

export default router;
