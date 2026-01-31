export interface Wisata {
  id: string;
  nama: string;
  kategori: string;
  short_desc: string;
  long_desc: string;
  hours: string;
  price: string;
  rating: number;
  tags: string[];
  location: string;
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const API_BASE_URL = 'https://69189e6a21a963594870aa33.mockapi.io/wisata';
const WISATA_ENDPOINT = `${API_BASE_URL}/wisata`;

// Error-safe transformation with fallback values
const transformWisataItem = (item: any): Wisata => {
  try {
    return {
      id: item?.id?.toString() || '',
      nama: item?.nama || 'Unknown Destination',
      kategori: item?.kategori || 'Alam',
      short_desc: item?.short_desc || 'No description available',
      long_desc: item?.long_desc || 'No detailed description available',
      hours: item?.hours || 'Hours not specified',
      price: item?.price || 'Price not available',
      rating: typeof item?.rating === 'number' ? item.rating : 0,
      tags: Array.isArray(item?.tags) ? item.tags : [],
      location: item?.location || 'Location not specified',
      images: Array.isArray(item?.images) ? item.images : [],
      coordinates: {
        latitude: typeof item?.coordinates?.latitude === 'number' ? item.coordinates.latitude : 0,
        longitude: typeof item?.coordinates?.longitude === 'number' ? item.coordinates.longitude : 0,
      },
    };
  } catch (error) {
    console.warn('Error transforming wisata item:', error);
    return {
      id: '',
      nama: 'Error Loading',
      kategori: 'Alam',
      short_desc: 'Failed to load data',
      long_desc: 'Failed to load detailed information',
      hours: 'N/A',
      price: 'N/A',
      rating: 0,
      tags: [],
      location: 'N/A',
      images: [],
      coordinates: { latitude: 0, longitude: 0 },
    };
  }
};

export const fetchWisata = async (): Promise<Wisata[]> => {
  try {
    const response = await fetch(WISATA_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid API response format');
    }

    return data.map(transformWisataItem);
  } catch (error) {
    console.error('Error fetching wisata data:', error);
    // Return empty array as fallback
    return [];
  }
};

export const fetchWisataById = async (id: string): Promise<Wisata | null> => {
  try {
    if (!id) return null;

    const response = await fetch(`${WISATA_ENDPOINT}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return transformWisataItem(data);
  } catch (error) {
    console.error('Error fetching wisata by ID:', error);
    return null;
  }
};

const api = {
  fetchAllWisata: fetchWisata,
  fetchWisataById,
};

export { api };
export default api;
