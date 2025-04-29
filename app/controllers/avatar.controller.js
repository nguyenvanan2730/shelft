import { changeUserAvatar } from '../services/avatar.service.js';

/**
 * Handles the change avatar request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function changeAvatar(req, res) {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        const result = await changeUserAvatar(user.user_id);
        
        if (result.success) {
            return res.json({ 
                status: 'ok', 
                ...result
            });
        } else {
            return res.status(500).json({ 
                status: 'error', 
                ...result
            });
        }
    } catch (error) {
        console.error("Error in change-avatar route:", error);
        return res.status(500).json({ 
            status: 'error', 
            success: false,
            message: 'Internal server error' 
        });
    }
}

export const methods = {
    changeAvatar
}; 