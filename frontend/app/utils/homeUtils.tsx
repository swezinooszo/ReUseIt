import api from "./api"

export const saveListing = async (listingId:string) =>{
    try {
        const result = await api.post('/users/favorite',{
            listingId:listingId
        })
        return result.data;
    } catch (error) {
        console.error('Error saving push token:', error);
        throw error
    }
}