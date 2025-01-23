import React, { useEffect, useState } from 'react';

const ChatComponent = ({ mentorId }) => {
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const response = await fetch(`/api/access/check-access?mentorId=${mentorId}`);
            const data = await response.json();
            setHasAccess(data.hasAccess);
        };
        checkAccess();
    }, [mentorId]);

    if (!hasAccess) return <p>Access denied. Please complete the payment to chat.</p>;

    return <div>Chat functionality here</div>;
};

export default ChatComponent;
