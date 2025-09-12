
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

/**
 * Listen to deep link events and call the handler with the full URL
 */
export function useDeepLinkListener(onUrl: (url: string) => void) {
    useEffect(() => {
        const listener = ({ url }: { url: string }) => {
            if (url && typeof onUrl === 'function') {
                onUrl(url);
            }
        };

        const subscription = Linking.addEventListener('url', listener);

        // Also check if the app was opened with a URL initially
        (async () => {
            const initialUrl = await Linking.getInitialURL();
            if (initialUrl) {
                listener({ url: initialUrl });
            }
        })();

        return () => {
            subscription.remove();
        };
    }, [onUrl]);
};