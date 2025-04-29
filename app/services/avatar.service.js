const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const db = require('../services/db');

/**
 * Deletes an avatar file if it exists and is not the default avatar
 * @param {string} avatarPath - The path to the avatar file
 */
async function deleteOldAvatar(avatarPath) {
    try {
        // Don't delete the default avatar
        if (avatarPath === 'avatar/default.svg') {
            return;
        }

        const fullPath = path.join(__dirname, '../../public', avatarPath);
        if (fs.existsSync(fullPath)) {
            await unlink(fullPath);
            console.log(`Deleted old avatar: ${avatarPath}`);
        }
    } catch (error) {
        console.error('Error deleting old avatar:', error);
    }
}

/**
 * Downloads a random avatar from DiceBear API
 * @returns {Promise<string>} The path to the saved image
 */
async function downloadRandomBookCover() {
    try {
        // Generate a random string for unique avatar
        const randomString = Math.random().toString(36).substring(7);
        
        // Call DiceBear API using fetch with fixed radius=50
        const response = await fetch(`https://api.dicebear.com/9.x/thumbs/svg?seed=${randomString}&radius=50`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the SVG data
        const svgData = await response.text();

        // Create avatar directory if it doesn't exist
        const avatarDir = path.join(__dirname, '../../public/avatar');
        if (!fs.existsSync(avatarDir)) {
            await mkdir(avatarDir, { recursive: true });
        }

        // Generate unique filename using timestamp
        const timestamp = new Date().getTime();
        const filename = `${timestamp}.svg`;
        const filepath = path.join(avatarDir, filename);

        // Save the SVG
        await writeFile(filepath, svgData);

        // Return the relative path
        return `avatar/${filename}`;
    } catch (error) {
        console.error('Error downloading avatar:', error);
        // Return a default avatar path if the API call fails
        return 'avatar/default.svg';
    }
}

/**
 * Changes the user's avatar to a new random one
 * @param {number} userId - The ID of the user
 * @returns {Promise<{success: boolean, avatarPath: string, message: string}>}
 */
async function changeUserAvatar(userId) {
    try {
        // Get current avatar path before updating
        const [currentUser] = await db.query(
            "SELECT profile_img FROM Users WHERE user_id = ?",
            [userId]
        );

        // Get a new random avatar
        const avatarPath = await downloadRandomBookCover();

        // Update user's avatar in database
        await db.query(
            "UPDATE Users SET profile_img = ? WHERE user_id = ?",
            [avatarPath, userId]
        );

        // Delete the old avatar if it exists
        if (currentUser && currentUser.profile_img) {
            await deleteOldAvatar(currentUser.profile_img);
        }

        return { 
            success: true,
            avatarPath: avatarPath,
            message: 'Avatar updated successfully' 
        };
    } catch (error) {
        console.error("Error updating avatar:", error);
        return { 
            success: false,
            message: 'Internal server error' 
        };
    }
}

module.exports = {
    downloadRandomBookCover,
    changeUserAvatar,
    deleteOldAvatar
}; 