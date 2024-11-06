import React from 'react';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PaymentButton = ({ amount, mentorId }) => {
    const handlePayment = async () => {
        // Dynamically load Razorpay SDK
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // Send request to your backend to create an order
        const response = await fetch("/api/payments/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, mentorId }),
        });

        const data = await response.json();

        if (!data.orderId) {
            alert("Failed to create Razorpay order");
            return;
        }

        // Setup Razorpay options
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // Razorpay key from .env
            amount: data.amount,  // Razorpay expects amount in paise (100 = ₹1)
            currency: data.currency,
            name: "Mentorship Session",
            description: "Pay-to-Talk Mentorship",
            order_id: data.orderId,
            handler: async (paymentResponse) => {
                // Verify the payment after success
                const verifyResponse = await fetch("/api/payments/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        order_id: paymentResponse.order_id,
                        payment_id: paymentResponse.payment_id,
                        signature: paymentResponse.signature,
                    }),
                });

                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                    alert("Payment successful and verified!");
                } else {
                    alert("Payment verification failed.");
                }
            },
            theme: { color: "#3399cc" }, // Customize Razorpay theme
        };

        // Open Razorpay checkout
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return (
        <button onClick={handlePayment}>
            Book Session (₹{amount})
        </button>
    );
};

export default PaymentButton;
