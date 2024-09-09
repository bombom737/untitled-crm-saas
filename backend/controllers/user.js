import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const router = Router();

//Middleware to authenticate the user token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401); // Token not found

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid or expired token

        req.user = user; // Attach the decoded token (with user info) to req object
        next();
    });
};

// Route to add an item to the specified array 
router.post('/add-item', authenticateToken, async (req, res) => {
    const { arrayType, item } = req.body; // Get the array type and item to be added from request body

    if (!arrayType || !item) {
        return res.status(400).send('Missing array type or item data');
    }

    try {
        // Find the currently logged-in user using the user info from the token
        const user = await UserModel.findOne({ id: req.user.id }); 

        if (!user) return res.status(404).send('User not found');
        
        // Depending on the array type, add the item to the correct array        
        if (arrayType === 'customerArray') {
            user.customersArray.push(item);
        } else if (arrayType === 'salesArray') {
            user.salesArray.push(item); 
        } else {
            return res.status(400).send('Invalid array type');
        }

        // Save the updated user document
        await user.save();

        console.log('Item added successfully! ' + JSON.stringify(item))
        res.status(200).send('Item added successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/remove-item', authenticateToken, async (req, res) => {
    const { arrayType, item } = req.body; 

    if (!arrayType || !item) {
        return res.status(400).send('Missing array type or item data');
    }
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');

        let itemToRemove = null;
        if (arrayType === 'customerArray') {
            itemToRemove = user.customersArray.indexOf(item)
            user.customersArray.splice(itemToRemove, 1);
        } else if (arrayType === 'salesArray') {
            itemToRemove = user.salesArray.indexOf(item)
            user.salesArray.splice(itemToRemove, 1);
        } else {
            return res.status(400).send('Invalid array type');
        }

        await user.save();

        console.log(`Item removed successfully Item: ${JSON.stringify(item)}`);
        res.status(200).send(`Item removed successfully`);
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/update-item', authenticateToken, async (req, res) => {
    const { arrayType, item } = req.body;  

    if (!arrayType || !item) {
        return res.status(400).send('Missing array type or item data');
    }
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');

        let itemToupdate = null;
        if (arrayType === 'customerArray') {
            itemToupdate = user.customersArray.findIndex((id) => {id === item.id})
            user.customersArray.splice(itemToupdate, 1, item);
        } else if (arrayType === 'salesArray') {
            itemToupdate = user.salesArray.findIndex((id) => {id === item.id})
            user.salesArray.splice(itemToupdate, 1, item);
        } else {
            return res.status(400).send('Invalid array type');
        }

        await user.save();

        console.log(`Item updated successfully!`);
        res.status(200).send('Item updated successfully');
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Server error');
    }
});

router.get('/get-array', authenticateToken, async (req, res) => {
    const { arrayType } = req.query; // Get arrayType from query params

    if (!arrayType) {
        return res.status(400).send('Invalid array type');
    }
    
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');
        
        if (arrayType === 'customerArray') {
            return res.json(user.customersArray); 
        } else if (arrayType === 'salesArray') {
            return res.json(user.salesArray);
        } else {
            return res.status(400).send('Invalid array type');
        }
    } catch (error) {
        console.error('Error getting array:', error);
        res.status(500).send('Server error');
    }
});


export default router;