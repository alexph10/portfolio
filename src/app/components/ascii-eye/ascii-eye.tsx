'use client';

import React, { useEffect, useState } from 'react';

const AsciiEye: React.FC = () => {
    const [frame, setFrame] = useState(0);
    
    // Eye frames for animation
    const eyeFrames = [
        [
            "    .::::::::.",
            "  .:::::::::::::.",
            " .:::::::::::::::'",
            ".::::::::::::::'  ",
            "::::'   `:::::'   ",
            ":::     .::::'    ",
            ":::     ::::'     ",
            ":::     ::::'     ",
            ":::     `::::.    ",
            "::::     .::::'   ",
            "'::::    :::::'   ",
            " ':::::::::::::'  ",
            "  '::::::::::'    ",
            "    '::::::'      "
        ],
        [
            "    .::::::::.",
            "  .:::::::::::::.",
            " .:::::::::::::::.",
            ".:::::::::::::::' ",
            "::::'   `:::::'   ",
            ":::   O  .::::'   ",
            ":::  (@) ::::'    ",
            ":::   O  ::::'    ",
            ":::     `::::.    ",
            "::::     .::::'   ",
            "'::::    :::::'   ",
            " ':::::::::::::'  ",
            "  '::::::::::'    ",
            "    '::::::'      "
        ]
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => (prev + 1) % eyeFrames.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [eyeFrames.length]);

    return (
        <pre className="text-[#FF4500] whitespace-pre font-mono text-sm leading-none">
            {eyeFrames[frame].map((line, index) => (
                <div key={index}>{line}</div>
            ))}
        </pre>
    );
};

export default AsciiEye;
