export interface Wisata {
  id: number;
  nama: string;
  kategori: string;
  location: string;
  short_desc: string;
  long_desc: string;
  rating: number;
  price: string | number;
  hours: string;
  images: string[];
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export async function fetchWisata(): Promise<Wisata[]> {
  try {
    // Simulate async delay for realism if needed, or just return immediately
    // const response = await new Promise(resolve => setTimeout(resolve, 500));
    // Fix: Use require() directly to bypass import/module issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rawData = require('../data/map.json');
    const data = rawData.default || rawData;

    if (!data || !data.features) {
      console.error('Invalid GeoJSON data structure:', data);
      return [];
    }

    const wisataList: Wisata[] = data.features
      .map((feature: any) => {
        try {
          const props = feature.properties;
          const coords = feature.geometry.coordinates; // [lon, lat]

          if (!props || !coords) return null;

          return {
            id: props.id,
            nama: props.nama,
            kategori: props.kategori,
            location: props.location,
            short_desc: props.short_desc,
            long_desc: props.long_desc,
            rating: props.rating,
            price: props.price,
            hours: props.hours,
            images: props.images || [],
            tags: props.tags || [],
            coordinates: {
              latitude: coords[1],
              longitude: coords[0],
            },
          };
        } catch (e) {
          console.warn('Skipping invalid feature:', e);
          return null;
        }
      })
      .filter((item: Wisata | null) => item !== null);

    return wisataList;
  } catch (error) {
    console.error('Error loading local wisata data:', error);
    return [];
  }
}

export async function fetchWisataById(id: string | number): Promise<Wisata | null> {
  try {
    const allWisata = await fetchWisata();
    // Use loose comparison (==) to handle both string and number IDs
    // eslint-disable-next-line eqeqeq
    const found = allWisata.find(item => item.id == id);
    return found || null;
  } catch (error) {
    console.error('Error fetching wisata by id:', error);
    return null;
  }
}
