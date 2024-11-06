import Payment from '../models/payment.model.js';

export const checkAccess = async (req, res) => {
    const { mentorId } = req.query;

    try {
        const payment = await Payment.findOne({ userId: req.user.id, mentorId: mentorId, status: "paid" });

        if (payment) {
            res.json({ hasAccess: true });
        } else {
            res.json({ hasAccess: false });
        }
    } catch (error) {
        console.error('Error checking access:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
