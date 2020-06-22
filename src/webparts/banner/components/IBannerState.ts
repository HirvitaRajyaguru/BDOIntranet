import { IBannerImages } from './IBannerImages';
export interface IBannerState {
    bannerlImages: any[];
    isLoading: boolean;
    errorMessage: string;
    hasError: boolean;
    teamsTheme: string;
    photoIndex: number;
    loadingImage: boolean;
}