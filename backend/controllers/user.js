import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import customerModel from '../models/customerModel.js';
import saleModel from '../models/saleModel.js';

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


router.get('/get-user', authenticateToken, async (req, res) => {
    const { userId } = req.query; // Get user from query params

    if (!userId) {
        return res.status(400).send('Invalid model type');
    }
    
    try {
        const user = await UserModel.findOne({ id: userId });

        if (!user) return res.status(404).send('User not found');
        
        return user
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Server error');
    }
});


// Route to add an item to the specified model 
router.post('/add-item', authenticateToken, async (req, res) => {
    const { modelType, item } = req.body; // Get the model type and item to be added from request body

    if (!modelType || !item) {
        return res.status(400).send('Missing model type or item data');
    }

    try {
        // Find the currently logged-in user using the user info from the token
        const user = await UserModel.findOne({ id: req.user.id }); 

        if (!user) return res.status(404).send('User not found');
        
        // Depending on the model type, add the item to the correct model        
        if (modelType === 'customerModel') {
            const newCustomer = new customerModel({
                owningUser: user.id,
                name: item.name,
                email: item.email,
                phoneNumber: item.phoneNumber,
                leadStatus: item.leadStatus,
                dateCreated: item.dateCreated,
                jobTitle: item.jobTitle,
                industry: item.industry,
                customerId: item.customerId
            });
            // Save the updated model
            await newCustomer.save();
        } else if (modelType === 'saleModel') {
            const newSale = new saleModel({
                owningUser: user.id,
                buyerName: item.buyerName,
                dealStage: item.dealStage,
                amount: item.amount,
                closeDate: item.closeDate,
                saleType: item.saleType,
                priority: item.priority,
                associatedWith: item.associatedWith,
                saleId: item.saleId
            });
            // Save the updated model
            await newSale.save()
        } else {
            return res.status(400).send('Invalid model type');
        }

        console.log('Item added successfully! ' + JSON.stringify(item))
        res.status(200).send('Item added successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/remove-item', authenticateToken, async (req, res) => {
    const { modelType, item } = req.body; 

    if (!modelType || !item) {
        return res.status(400).send('Missing model type or item data');
    }
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');

        if (modelType === 'customerModel') {
            await customerModel.deleteOne({ customerId: item.id})
        } else if (modelType === 'saleModel') {
            await saleModel.deleteOne({ saleId: item.id})
        } else {
            return res.status(400).send('Invalid model type');
        }

        await user.save();

        console.log('Item removed successfully!');
        res.status(200).send('Item removed successfully');
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/update-item', authenticateToken, async (req, res) => {
    const { modelType, item } = req.body;  

    if (!modelType || !item) {
        return res.status(400).send('Missing model type or item data');
    }
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');

        if (modelType === 'customerModel') {
            await customerModel.findOneAndUpdate({ owningUser: user.id}, item)
        } else if (modelType === 'saleModel') {
            await saleModel.findOneAndUpdate({ owningUser: user.id}, item)
        } else {
            return res.status(400).send('Invalid model type');
        }

        await user.save();

        console.log(`Item updated successfully!`);
        res.status(200).send('Item updated successfully');
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Server error');
    }
});

router.get('/get-model', authenticateToken, async (req, res) => {
    const { modelType } = req.query; // Get modelType from query params

    if (!modelType) {
        return res.status(400).send('Invalid model type');
    }
    
    try {
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');
        
        if (modelType === 'customerModel') {
            return customerModel.find({ owningUser: user.id}) 
        } else if (modelType === 'saleModel') {
            return saleModel.find({ owningUser: user.id}) 
        } else {
            return res.status(400).send('Invalid model type');
        }
    } catch (error) {
        console.error('Error getting model:', error);
        res.status(500).send('Server error');
    }
});


export default router;