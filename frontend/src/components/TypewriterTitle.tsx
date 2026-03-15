import { useState, useEffect } from 'react';

interface TypewriterTitleProps {
    words: string[];
    interval?: number;
}

export function TypewriterTitle({ words, interval = 3000 }: TypewriterTitleProps) {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
                setFade(true);
            }, 500); // Wait for fade out
        }, interval);

        return () => clearInterval(timer);
    }, [words, interval]);

    return (
        <span className={`inline-block transition-all duration-500 ease-in-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } bg-primary-500 text-white italic serif px-6 py-2 transform -rotate-2 shadow-xl`}>
            {words[index]}
        </span>
    );
}
