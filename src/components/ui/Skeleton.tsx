import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
    const baseClass = "bg-gray-200 animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

    const variantClasses = {
        text: "h-4 w-full rounded",
        rect: "rounded-2xl",
        circle: "rounded-full aspect-square"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
    );
};

export const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <Skeleton className="h-72 w-full" />
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <Skeleton variant="text" className="w-3/4 mb-2" />
                    <Skeleton variant="text" className="w-1/2" />
                </div>
                <Skeleton variant="text" className="w-full mb-2" />
                <Skeleton variant="text" className="w-full mb-6" />
                <div className="flex gap-2 mt-auto">
                    <Skeleton className="flex-1 h-14 rounded-2xl" />
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                </div>
            </div>
        </div>
    );
};
