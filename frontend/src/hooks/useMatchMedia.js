import { useState, useEffect } from 'react';

export function useMatchMedia(query) {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const mql = window.matchMedia(query);
        mql.addListener(event => setMatches(event.matches));
    }, [query]);

    return matches;
}