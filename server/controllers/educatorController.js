import { clerkClient } from '@clerk/clerk-sdk-node';

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req?.auth?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: missing user id' });
        }

        await clerkClient.users.updateUser(userId, {
            publicMetadata: { role: 'educator' },
        });

        return res.json({ success: true, message: 'Role updated to educator successfully' });
    } catch (error) {
        console.error('updateRoleToEducator error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};