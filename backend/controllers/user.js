import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import customerModel from '../models/customerModel.js';
import saleModel from '../models/saleModel.js';
import columnModel from '../models/columnModel.js';

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
            const newSale = {
                dealName: item.sale.dealName,
                dealStage: item.sale.dealStage,
                amount: item.sale.amount,
                closeDate: item.sale.closeDate,
                saleType: item.sale.saleType,
                priority: item.sale.priority,
                associatedWith: item.sale.associatedWith,
                saleId: item.sale.saleId
            };

            const newSaleCard = new saleModel({
                owningUser: user.id,
                id: item.id,
                columnId: item.columnId,
                sale: newSale
            });
            // Save the updated model
            await newSaleCard.save();
        } else if (modelType === 'columnModel') {
            const newColumn = new columnModel({
                owningUser: user.id,
                id: item.id,
                title: item.title
            });
            // Save the updated model
            await newColumn.save()
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
        if (modelType === 'customerModel') {
            await customerModel.deleteOne({ customerId: item.customerId})
        } else if (modelType === 'saleModel') {
            await saleModel.deleteOne({ id: item.id })
        } else if (modelType === 'columnModel') {
            await columnModel.deleteOne({ id: item.id })
        } else {
            return res.status(400).send('Invalid model type');
        }

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
        console.log(item.customerId)
        const user = await UserModel.findOne({ id: req.user.id });

        if (!user) return res.status(404).send('User not found');

        if (modelType === 'customerModel') {
            await customerModel.findOneAndUpdate({ owningUser: user.id, customerId: item.customerId}, item)
        } else if (modelType === 'saleModel') {
            await saleModel.findOneAndUpdate({ owningUser: user.id, id: item.id}, item)
        } else if (modelType === 'columnModel') {
            await columnModel.findOneAndUpdate({ owningUser: user.id, id: item.id }, item)
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
        
        let result;
        
        if (modelType === 'customerModel') {
            result = await customerModel.find({ owningUser: user.id }).lean(); 
        } else if (modelType === 'saleModel') {
            result = await saleModel.find({ owningUser: user.id }).lean(); 
        } else if (modelType === 'columnModel') {
            result = await columnModel.find({ owningUser: user.id }).lean(); 
        } else {
            return res.status(400).send('Invalid model type');
        }
        
        return res.status(200).json(result); 
    } catch (error) {
        console.error('Error getting model:', error);
        res.status(500).send('Server error');
    }
});


export default router;