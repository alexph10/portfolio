import { useState } from 'react';

interface ThreadPostProps {
    content: string;
    timestamp: string;
    likes: number;
    replies: number;
    isLiked: boolean;
}

export default function ThreadPost({ content, timestamp, likes, replies, isLiked: initialIsLiked }: ThreadPostProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="border-b border-[#FF4500]/20 pb-4">
            <div className="flex gap-3 items-start">
                <div className="flex-1">
                    <div className="text-[#FF4500]">{content}</div>
                    <div className="mt-2 flex items-center gap-4">
                        <button 
                            onClick={handleLike}
                            className={`text-sm ${isLiked ? 'text-[#FF4500]' : 'text-[#FF4500]/70'}`}
                        >
                            ♥ {likeCount}
                        </button>
                        <span className="text-sm text-[#FF4500]/70">💬 {replies}</span>
                        <span className="text-sm text-[#FF4500]/50">{timestamp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

