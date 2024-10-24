import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import customerModel from '../models/customerModel.js';
import saleModel from '../models/saleModel.js';
import columnModel from '../models/columnModel.js';
import { swapItems } from '../services/helperFunctions.js';

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
            const newCustomer = ({
                name: item.name,
                email: item.email,
                phoneNumber: item.phoneNumber,
                leadStatus: item.leadStatus,
                dateCreated: item.dateCreated,
                jobTitle: item.jobTitle,
                industry: item.industry,
                customerId: item.customerId
            });
            
            // Find existing customer array owned by user
            let userCustomers = await customerModel.findOne({ owningUser: user.id });

            // If not found, create one
            if (!userCustomers) {
                const defaultCustumerArray = {
                    owningUser: user.id,
                    customers: []
                }
                userCustomers = await customerModel.create(defaultCustumerArray)
            }

            // Push customer into array
            userCustomers.customers.push(newCustomer)

            //Save the updated document
            await userCustomers.save()

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

            const newSaleCard = ({
                id: item.id,
                columnId: item.columnId,
                sale: newSale
            });

            let userSaleCards = await saleModel.findOne({ owningUser: user.id });

            if (!userSaleCards) {
                const defaultSaleCardArray = {
                    owningUser: user.id,
                    saleCards: []
                }

                userSaleCards = await saleModel.create(defaultSaleCardArray)
            };

            userSaleCards.saleCards.push(newSaleCard);

            await userSaleCards.save();

        } else if (modelType === 'columnModel') {
            const newColumn = ({
                id: item.id,
                title: item.title
            });

            let userColumns = await columnModel.findOne({ owningUser: user.id });

            if (!userColumns) {
                const defaultColumnArray = {
                    owningUser: user.id,
                    columns: []
                }

                userColumns = await columnModel.create(defaultColumnArray)
            }

            userColumns.columns.push(newColumn);

            await userColumns.save();

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
    
    // Find the currently logged-in user using the user info from the token
    const user = await UserModel.findOne({ id: req.user.id }); 

    if (!user) return res.status(404).send('User not found');
    
    const { modelType, item } = req.body; 
    if (!modelType || !item) {
        return res.status(400).send('Missing model type or item data');
    }
    
    try {
        if (modelType === 'customerModel') {
            const updatedUserCustomers = await customerModel.findOneAndUpdate(
                // Find the document owned by user
                { owningUser: user.id },
                // Pull the requested item from array, removing it
                { $pull: { customers: { customerId: item.customerId } } },
                // Return the new document
                { new: true }
            );
        
            // Check if the operation failed and return status 404
            if (!updatedUserCustomers) {
                console.log('Customer not found or user does not exist');
                return res.status(404).send('Customer not found or user does not exist');
            }

        } else if (modelType === 'saleModel') {
            const updatedUserSaleCards = await saleModel.findOneAndUpdate(
                { owningUser: user.id },
                { $pull: { saleCards: { id: item.id } } },
                { new: true }
            );
        
            if (!updatedUserSaleCards) {
                console.log('Sale card not found or user does not exist');
                return res.status(404).send('Sale card not found or user does not exist');
            }

        } else if (modelType === 'columnModel') {
            const updatedUserColumns = await columnModel.findOneAndUpdate(
                { owningUser: user.id },
                { $pull: { columns: { id: item.id } } },
                { new: true }
            );
        
            if (!updatedUserColumns) {
                console.log('Column not found or user does not exist');
                return res.status(404).send('Column not found or user does not exist');
            }

        } else {
            console.log('Invalid model type');
            return res.status(400).send('Invalid model type');
        }

        console.log('Item removed successfully!');
        res.status(200).send('Item removed successfully!');
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/update-item', authenticateToken, async (req, res) => {
    
    // Find the currently logged-in user using the user info from the token
    const user = await UserModel.findOne({ id: req.user.id });

    if (!user) return res.status(404).send('User not found');

    const { modelType, item } = req.body;  

    if (!modelType || !item) {
        return res.status(400).send('Missing model type or item data');
    }
    try {
        if (modelType === 'customerModel') {
            const updatedCustomer = await customerModel.findOneAndUpdate(
                // Find the customer that matches Id and owningUser
                { 'customers.customerId': item.customerId, owningUser: user.id }, 
                // Set it to the updated values
                { 
                    $set: { 
                        'customers.$.name': item.name,
                        'customers.$.email': item.email,
                        'customers.$.phoneNumber': item.phoneNumber,
                        'customers.$.leadStatus': item.leadStatus,
                        'customers.$.dateCreated': item.dateCreated,
                        'customers.$.jobTitle': item.jobTitle,
                        'customers.$.industry': item.industry,
                        'customers.$.customerId': item.customerId
                    }
                },
                // Return the new document
                { new: true }
            );
        
            // Check if the operation failed and return status 404
            if (!updatedCustomer) {
                return res.status(404).send('Customer not found');
            }
        } else if (modelType === 'saleModel') {
            const updatedSaleCard = await saleModel.findOneAndUpdate(
                { 'saleCards.id': item.id, owningUser: user.id },
                { 
                    $set: { 
                        'saleCards.$.columnId': item.columnId, 
                        'saleCards.$.sale.dealName': item.sale.dealName,
                        'saleCards.$.sale.dealStage': item.sale.dealStage,
                        'saleCards.$.sale.amount': item.sale.amount,
                        'saleCards.$.sale.closeDate': item.sale.closeDate,
                        'saleCards.$.sale.saleType': item.sale.saleType,
                        'saleCards.$.sale.priority': item.sale.priority,
                        'saleCards.$.sale.associatedWith': item.sale.associatedWith
                    }
                },
                { new: true }
            );
        
            if (!updatedSaleCard) {
                return res.status(404).send('Sale card not found');
            }
        } else if (modelType === 'columnModel') {
            const updatedColumn = await columnModel.findOneAndUpdate(
                { 'columns.id': item.id, owningUser: user.id },                 
                { 
                    $set: { 
                        'columns.$.columns': item.columns,
                        'columns.$.title': item.title,
                    }
                },
                { new: true }
            );
        
            if (!updatedColumn) {
                return res.status(404).send('Column not found');
            }
        } else {
            return res.status(400).send('Invalid model type');
        }

        await user.save();

        console.log(`Item updated successfully!`);
        res.status(200).send('Item updated successfully!');
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Server error');
    }
});

router.post('/move-items', authenticateToken, async (req, res) => {
    
    // Find the currently logged-in user using the user info from the token
    const user = await UserModel.findOne({ id: req.user.id });

    if (!user) return res.status(404).send('User not found');

    // Get database model, and items to move indexes from request body
    const { modelType, itemToMoveFromIndex, itemToMoveToIndex } = req.body;  
    
    if (!modelType || itemToMoveFromIndex === undefined || itemToMoveToIndex === undefined) {
        return res.status(400).send('Missing model type or item data');
    }
    try {

        if (modelType === 'customerModel') {
            const userCustomers = await customerModel.findOne({ owningUser: user.id });

            if (!userCustomers) {
                return res.status(404).send('Customers not found');
            }

            // Use utility function swapItems to swap array indexes 
            await swapItems(userCustomers.customers, itemToMoveFromIndex, itemToMoveToIndex);

            await userCustomers.save();
        } else if (modelType === 'saleModel') {
            const userSaleCards = await saleModel.findOne({ owningUser: user.id });

            if (!userSaleCards) {
                return res.status(404).send('Sale cards not found');
            }

            await swapItems(userSaleCards.saleCards, itemToMoveFromIndex, itemToMoveToIndex);

            await userSaleCards.save();
        } else if (modelType === 'columnModel') {
            const userColumns = await columnModel.findOne({ owningUser: user.id });

            if (!userColumns) {
                return res.status(404).send('Columns not found');
            }

            await swapItems(userColumns.columns, itemToMoveFromIndex, itemToMoveToIndex);

            await userColumns.save(); 
        } else {
            console.log(`Invalid model. data: \n modelType: ${modelType} \n itemToMoveFromIndex: ${itemToMoveFromIndex} \n itemToMoveToIndex: ${itemToMoveToIndex}`);
            
            return res.status(400).send('Invalid model type');
        }

        console.log(`Items swapped successfully!`);
        res.status(200).send('Items swapped successfully!');
    } catch (error) {
        console.error('Error swapping items:', error);
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
            result = await customerModel.findOne({ owningUser: user.id }).lean(); 
        } else if (modelType === 'saleModel') {
            result = await saleModel.findOne({ owningUser: user.id }).lean(); 
        } else if (modelType === 'columnModel') {
            result = await columnModel.findOne({ owningUser: user.id }).lean(); 
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