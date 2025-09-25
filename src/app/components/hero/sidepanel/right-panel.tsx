import React from 'react';
import Link from 'next/link';

export default function RightPanel() {
    return (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 text-[#FF4500]" 
             style={{ fontFamily: 'Mondwest, sans-serif', fontSize: '14.5px', fontWeight: '500' }}>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/music">Music</NavLink>
            <NavLink href="/games">Games</NavLink>
        </div>
    );
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    return (
        <Link 
            href={href} 
            className="hover:text-[#FF6B33] transition-colors relative group flex items-center gap-2"
        >
            <span>{children}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-1">
                ~
            </span>
        </Link>
    );
};