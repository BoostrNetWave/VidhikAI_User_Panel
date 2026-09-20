import React from 'react';

/**
 * Official vector SVG logos for Payment Methods (UPI, GPay, PhonePe, Paytm,
 * Visa, Mastercard, RuPay, SBI, HDFC, ICICI, Axis, CRED, MobiKwik, Amazon Pay, Razorpay)
 */

export const UpiLogo: React.FC<{ className?: string }> = ({ className = "h-5 w-auto" }) => (
    <svg viewBox="0 0 76 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <polygon points="11,3 22,13 11,23 15,13" fill="#097939" />
        <polygon points="19,3 30,13 19,23 23,13" fill="#ED7524" />
        <text x="34" y="19" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="15" fill="#1C1C1C" letterSpacing="0.6">UPI</text>
    </svg>
);

export const GPayLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-auto" }) => (
    <svg viewBox="0 0 46 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8.2 7.5V10.2H12.8C12.6 11.5 11.7 12.8 10.1 12.8C8.2 12.8 6.7 11.2 6.7 9.3C6.7 7.4 8.2 5.8 10.1 5.8C11.1 5.8 11.8 6.2 12.3 6.6L14.2 4.7C13 3.6 11.4 2.8 10.1 2.8C6.6 2.8 3.7 5.7 3.7 9.3C3.7 12.9 6.6 15.8 10.1 15.8C13.8 15.8 16.3 13.2 16.3 9.6C16.3 8.9 16.2 8.2 16.1 7.5H8.2Z" fill="#4285F4"/>
        <text x="18" y="13.5" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#5F6368">Pay</text>
    </svg>
);

export const PhonePeLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="11" cy="11" r="11" fill="#5F259F" />
        <path d="M6.5 6H13C14.4 6 15.5 7.1 15.5 8.5C15.5 9.9 14.4 11 13 11H9.3V15.5H6.5V6Z" fill="white" />
        <path d="M9.3 8.5H12.5C13 8.5 13.4 8.9 13.4 9.4C13.4 9.9 13 10.3 12.5 10.3H9.3V8.5Z" fill="#5F259F" />
        <path d="M10.8 5.2L12.8 3.2H14.8" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

export const PaytmLogo: React.FC<{ className?: string }> = ({ className = "h-3.5 w-auto" }) => (
    <svg viewBox="0 0 46 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="0" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="12" fill="#002E6E">Pay</text>
        <text x="24.5" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="12" fill="#00BAF2">tm</text>
    </svg>
);

export const VisaLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-auto" }) => (
    <svg viewBox="0 0 46 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.8 1.5L13.7 14.5H10.4L6.9 4.2C6.7 3.5 6.4 3.2 5.9 2.9C4.9 2.4 3.4 2 2 1.7L2.1 1.5H7.5C8.2 1.5 8.8 2 9 2.7L10.3 9.7L13.6 1.5H18.8ZM35.3 10C35.3 6.2 30.2 6 30.2 4.3C30.2 3.8 30.7 3.3 31.7 3.1C32.2 3 33.6 2.9 35.1 3.6L35.8 1.2C34.7 0.8 33.4 0.5 31.6 0.5C27.7 0.5 24.9 2.6 24.9 5.7C24.9 8 26.8 9.2 28.4 10C30 10.8 30.5 11.3 30.5 12C30.5 13.1 29.3 13.6 28.1 13.6C26.2 13.6 25 13.1 24.1 12.6L23.3 15.1C24.3 15.6 26.1 16 27.8 16C32 16 35.3 13.9 35.3 10ZM45.6 14.5H48.5L46 1.5H43.5C42.8 1.5 42.2 1.9 42 2.5L35.9 14.5H39.4L40.1 12.5H44.3L44.7 14.5H45.6ZM41 10.2L42.9 4.8L43.9 10.2H41ZM23.7 1.5L21.1 14.5H17.9L20.5 1.5H23.7Z" fill="#1A1F71"/>
    </svg>
);

export const MastercardLogo: React.FC<{ className?: string }> = ({ className = "h-4.5 w-auto" }) => (
    <svg viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="11" cy="11" r="9" fill="#EB001B" />
        <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.9" />
        <path d="M17 4.6C18.6 6.3 19.6 8.5 19.6 11C19.6 13.5 18.6 15.7 17 17.4C15.4 15.7 14.4 13.5 14.4 11C14.4 8.5 15.4 6.3 17 4.6Z" fill="#FF5F00" />
    </svg>
);

export const RuPayLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-auto" }) => (
    <svg viewBox="0 0 58 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <polygon points="3,2 9,9 3,16 7,9" fill="#097939" />
        <polygon points="8,2 14,9 8,16 12,9" fill="#F47920" />
        <text x="16" y="14" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="12.5" fill="#005B9F">Ru</text>
        <text x="34" y="14" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="12.5" fill="#F47920">Pay</text>
    </svg>
);

export const SbiLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="10" cy="10" r="10" fill="#0084C9" />
        <circle cx="10" cy="8.5" r="3" fill="white" />
        <rect x="8.8" y="8.5" width="2.4" height="7.5" fill="white" />
    </svg>
);

export const HdfcLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="20" height="20" rx="3" fill="#004C8F" />
        <rect x="4" y="4" width="12" height="12" fill="#ED232A" />
        <rect x="7" y="7" width="6" height="6" fill="white" />
        <rect x="8.5" y="2" width="3" height="16" fill="#004C8F" />
        <rect x="2" y="8.5" width="16" height="3" fill="#004C8F" />
    </svg>
);

export const IciciLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="10" cy="10" r="10" fill="#F37021" />
        <path d="M10 4C6.5 4 3.7 6.8 3.7 10C3.7 13.2 6.5 16 10 16C12 16 13.8 15 14.8 13.5L12.7 12.2C12.1 13 11.1 13.5 10 13.5C8 13.5 6.4 11.9 6.4 10C6.4 8.1 8 6.5 10 6.5C11.1 6.5 12.1 7 12.7 7.8L14.8 6.5C13.8 5 12 4 10 4Z" fill="#9C1D26" />
        <circle cx="10" cy="10" r="2.2" fill="white" />
    </svg>
);

export const AxisLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="20" height="20" rx="3" fill="#861F41" />
        <polygon points="10,4 15,16 11.5,16 10,12 8.5,16 5,16" fill="white" />
    </svg>
);

export const CredLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="20" height="20" rx="3.5" fill="#141414" />
        <path d="M5 5.5H15V12C15 14.5 12.5 16.5 10 17C7.5 16.5 5 14.5 5 12V5.5Z" stroke="white" strokeWidth="1.6" fill="none" />
        <path d="M8 8H12V11C12 12.5 11 13.5 10 13.8C9 13.5 8 12.5 8 11V8Z" fill="white" />
    </svg>
);

export const MobiKwikLogo: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="10" cy="10" r="10" fill="#0072BB" />
        <text x="5" y="14" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="11" fill="white">M</text>
        <circle cx="14" cy="8" r="2" fill="#E91E63" />
    </svg>
);

export const AmazonPayLogo: React.FC<{ className?: string }> = ({ className = "h-3.5 w-auto" }) => (
    <svg viewBox="0 0 52 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="1" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10" fill="#131921">amazon</text>
        <text x="36" y="11" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="9" fill="#FF9900">pay</text>
        <path d="M3 13C12 15.5 26 15 33 13" stroke="#FF9900" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

export const RazorpayLogo: React.FC<{ className?: string }> = ({ className = "h-5 w-auto" }) => (
    <svg viewBox="0 0 98 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M8.5 2L2 14.5H8L5 22L16 9.5H10L13 2H8.5Z" fill="#0C2340"/>
        <path d="M10 2L4.5 12.5H9.5L7 19L16 8.5H11L13.5 2H10Z" fill="#0082FF"/>
        <text x="21" y="17" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="14" fill="#0C2340">Razorpay</text>
    </svg>
);
