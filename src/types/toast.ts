export type AppToastType = 'success' | 'info' | 'danger';

export interface ShowToastOptions {
    message: string;
    type?: AppToastType;
    duration?: number;
    afterToast?: () => void;
}

export type ShowToast = (options: ShowToastOptions) => void;


