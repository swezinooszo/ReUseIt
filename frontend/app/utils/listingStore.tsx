import { create } from 'zustand';

interface Listing {
  title: string;
  price: number;
  condition: string;
  description: string;
  dynamicFields?: { [key: string]: string };
}

interface ListingStore {
    updatedListing: Listing | null;
    setUpdatedListing: (listing: Listing) => void;
    clearUpdatedListing: () => void;
}

export const useListingStore = create<ListingStore>((set) => ({
  updatedListing: null,
  setUpdatedListing: (listing) => set({ updatedListing: listing }),
  clearUpdatedListing: () => set({ updatedListing: null }),
}));