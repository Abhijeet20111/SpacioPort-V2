export interface Space {
  id: string;
  name: string;
  location: string;
  city: string;
  address?: string;
  // New schema: type=virtual|physical, duration=long-term|on-demand (physical only)
  // Old type values ('longterm'|'ondemand') are still accepted for legacy mock data.
  type: 'virtual' | 'physical' | 'longterm' | 'ondemand';
  duration?: 'long-term' | 'on-demand';
  price: number;
  priceUnit: string;
  discount: number;
  rating: number;
  reviews: number;
  capacity: number;
  image: string;
  amenities: string[];
  description: string;
  images: string[];
}

export const spaces: Space[] = [
  {
    id: '1', name: 'Skyline Co-Work', location: 'Connaught Place, Central Delhi', city: 'Delhi',
    type: 'longterm', price: 25000, priceUnit: '/month', discount: 15, rating: 4.8, reviews: 124,
    capacity: 50, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    amenities: ['WiFi', 'Meeting Rooms', 'Pantry', 'Parking', '24/7 Access', 'Printer'],
    description: 'Premium coworking space in the heart of Connaught Place with stunning city views.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
  },
  {
    id: '2', name: 'Tech Hub BKC', location: 'Bandra Kurla Complex, Bandra East', city: 'Mumbai',
    type: 'ondemand', price: 800, priceUnit: '/hour', discount: 0, rating: 4.6, reviews: 89,
    capacity: 20, image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600',
    amenities: ['WiFi', 'Whiteboard', 'Tea/Coffee', 'Monitor', 'Video Conferencing'],
    description: 'Modern tech-focused workspace in BKC, ideal for startups and freelancers.',
    images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  },
  {
    id: '3', name: 'Executive Suite', location: 'MG Road, Central Bangalore', city: 'Bangalore',
    type: 'virtual', price: 4999, priceUnit: '/month', discount: 10, rating: 4.9, reviews: 56,
    capacity: 1, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
    amenities: ['Business Address', 'Mail Handling', 'Phone Answering', 'Meeting Room Credits'],
    description: 'Professional virtual office with a prestigious Bangalore business address.',
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
  },
  {
    id: '4', name: 'Creative Loft', location: 'Salt Lake Sector V, IT Hub', city: 'Kolkata',
    type: 'longterm', price: 18000, priceUnit: '/month', discount: 20, rating: 4.7, reviews: 73,
    capacity: 30, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
    amenities: ['WiFi', 'Event Space', 'Pantry', 'Bike Parking', 'Terrace'],
    description: 'Inspiring creative workspace in Kolkata\'s vibrant IT corridor.',
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'],
  },
  {
    id: '5', name: 'Marina Business Center', location: 'Nungambakkam, Near Gemini Flyover', city: 'Chennai',
    type: 'ondemand', price: 600, priceUnit: '/hour', discount: 5, rating: 4.5, reviews: 41,
    capacity: 12, image: 'https://images.unsplash.com/photo-1462826303086-329426d1afd5?w=600',
    amenities: ['WiFi', 'AC', 'Tea/Coffee', 'Parking', 'Whiteboard'],
    description: 'Professional workspace in the commercial heart of Chennai.',
    images: ['https://images.unsplash.com/photo-1462826303086-329426d1afd5?w=800'],
  },
  {
    id: '6', name: 'Innovation Hub', location: 'HITEC City, Madhapur', city: 'Hyderabad',
    type: 'longterm', price: 15000, priceUnit: '/month', discount: 25, rating: 4.8, reviews: 98,
    capacity: 40, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
    amenities: ['WiFi', 'Lab Space', 'Meeting Rooms', 'Pantry', '3D Printer', 'Podcast Studio'],
    description: 'State-of-the-art innovation hub in Hyderabad\'s booming tech corridor.',
    images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'],
  },
];

export const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'];
