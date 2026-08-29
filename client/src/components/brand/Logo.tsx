import React from 'react';

interface LogoProps {
    className?: string;
    isCollapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", isCollapsed = false }) => {
    return (
        <div className={`flex items-center justify-center overflow-hidden h-full w-full ${className}`}>
            <img 
                src="/user/img/logo.jpeg" 
                alt="Vidhik AI Logo" 
                className={`transition-all duration-300 ${isCollapsed ? 'h-10 w-10 object-contain' : 'h-20 w-full object-contain'}`}
            />
        </div>
    );
};
