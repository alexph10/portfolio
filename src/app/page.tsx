'use client';

import Hero from './components/hero/hero';
import Footer from './components/footer/footer';

export default function Home() {
    return (
        <div className="flex flex-col" style={{ backgroundColor: '#282828' }}>
            <section className="min-h-screen">
                <Hero />
            </section>
            <section className="h-[40vh] sticky top-0">
                <Footer />
            </section>
        </div>
    );
}
