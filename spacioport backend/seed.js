/**
 * Seed script — populates your local MongoDB with initial data.
 * Run: node seed.js
 *
 * Creates:
 *   • 1 admin user      (admin@spacioport.in / admin123)
 *   • 1 client user     (rahul@example.com / password123)
 *   • 10 virtual spaces (no city/address required)
 *   • 10 long-term physical spaces (Delhi / Mumbai / Bangalore)
 *   • 10 on-demand physical spaces (mixed cities)
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Space = require('./models/Space');
const Booking = require('./models/Booking');

const IMG = {
  office1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  office2: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
  office3: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  office4: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  office5: 'https://images.unsplash.com/photo-1462826303086-329426d1afd5?w=800',
  office6: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
};

// ---------- 10 Virtual Spaces ----------
const virtualSpaces = [
  ['Prestige Virtual Office',      'Bangalore', 4999],
  ['Connaught Business Address',   'Delhi',     5499],
  ['BKC Virtual Suite',            'Mumbai',    6499],
  ['HITEC City Virtual Office',    'Hyderabad', 3999],
  ['Salt Lake Virtual Address',    'Kolkata',   3499],
  ['Cyber Hub Virtual Office',     'Gurgaon',   5999],
  ['Noida Sector 62 Virtual',      'Noida',     3299],
  ['Koregaon Park Virtual Suite',  'Pune',      4299],
  ['Anna Salai Virtual Address',   'Chennai',   3799],
  ['SG Highway Virtual Office',    'Ahmedabad', 2999],
].map(([name, city, price]) => ({
  name,
  type: 'virtual',
  // virtual → no duration / city / address required
  city, // city is optional for virtual; we still tag it for searchability
  price,
  priceUnit: '/month',
  discount: Math.floor(Math.random() * 20),
  rating: 4.5 + Math.random() * 0.5,
  reviews: 30 + Math.floor(Math.random() * 100),
  capacity: 1,
  image: IMG.office3,
  images: [IMG.office3, IMG.office1],
  amenities: ['Business Address', 'Mail Handling', 'Phone Answering', 'Meeting Room Credits'],
  description: `Professional virtual office service with a prestigious ${city} business address, mail forwarding and call answering.`,
}));

// ---------- 10 Long-Term Physical Spaces (Delhi / Mumbai / Bangalore) ----------
const longTermSpaces = [
  ['Skyline Co-Work',        'Delhi',     'Connaught Place, Central Delhi',           25000, 50, 15],
  ['Cyber Greens Office',    'Delhi',     'Sector 18, Dwarka',                        18000, 35, 10],
  ['Saket Premium Suites',   'Delhi',     'Saket District Centre, South Delhi',       28000, 60, 20],
  ['BKC Premier Workspace',  'Mumbai',    'Bandra Kurla Complex, Bandra East',        35000, 80, 12],
  ['Lower Parel Tower Suite','Mumbai',    'Lower Parel, Senapati Bapat Marg',         32000, 70, 18],
  ['Andheri SEEPZ Hub',      'Mumbai',    'SEEPZ, Andheri East',                      22000, 45, 25],
  ['MG Road Tech Center',    'Bangalore', 'MG Road, Central Bangalore',               24000, 55, 15],
  ['Whitefield Innov Park',  'Bangalore', 'Whitefield Main Road, ITPL',               20000, 60, 22],
  ['Koramangala Startup Loft','Bangalore','5th Block Koramangala',                    21000, 40, 18],
  ['Indiranagar Creator Hub','Bangalore', '100 Feet Road, Indiranagar',               19500, 35, 10],
].map(([name, city, address, price, capacity, discount]) => ({
  name,
  type: 'physical',
  duration: 'long-term',
  city,
  address,
  location: address,
  price,
  priceUnit: '/month',
  discount,
  rating: 4.5 + Math.random() * 0.5,
  reviews: 40 + Math.floor(Math.random() * 120),
  capacity,
  image: IMG.office1,
  images: [IMG.office1, IMG.office2, IMG.office4],
  amenities: ['WiFi', 'Meeting Rooms', 'Pantry', 'Parking', '24/7 Access', 'Printer', 'AC'],
  description: `Premium long-term coworking space in ${city} with dedicated desks, private cabins and full amenities.`,
}));

// ---------- 10 On-Demand Physical Spaces (mixed Indian cities) ----------
const onDemandSpaces = [
  ['Tech Hub BKC',           'Mumbai',    'Bandra Kurla Complex',                  800],
  ['Marina Business Center', 'Chennai',   'Nungambakkam, Near Gemini Flyover',     600],
  ['Innovation Hub',         'Hyderabad', 'HITEC City, Madhapur',                  750],
  ['Cyber Hub Meeting Room', 'Gurgaon',   'DLF Cyber Hub, Phase II',               900],
  ['Salt Lake Sector V Pod', 'Kolkata',   'Salt Lake Sector V, IT Hub',            500],
  ['Noida Express Workspace','Noida',     'Sector 62, Noida-Greater Noida Expy',   550],
  ['Koregaon Park Day Office','Pune',     'North Main Road, Koregaon Park',        650],
  ['SG Highway Hot Desk',    'Ahmedabad', 'Sarkhej-Gandhinagar Highway',           450],
  ['Anna Nagar Conference',  'Chennai',   '2nd Avenue, Anna Nagar',                700],
  ['Indiranagar Pop-Up Desk','Bangalore', '12th Main, Indiranagar',                550],
].map(([name, city, address, price]) => ({
  name,
  type: 'physical',
  duration: 'on-demand',
  city,
  address,
  location: address,
  price,
  priceUnit: '/hour',
  discount: Math.floor(Math.random() * 15),
  rating: 4.4 + Math.random() * 0.6,
  reviews: 20 + Math.floor(Math.random() * 90),
  capacity: 8 + Math.floor(Math.random() * 20),
  image: IMG.office2,
  images: [IMG.office2, IMG.office5, IMG.office6],
  amenities: ['WiFi', 'Whiteboard', 'Tea/Coffee', 'Monitor', 'Video Conferencing', 'AC'],
  description: `Flexible on-demand workspace in ${city}. Book by the hour or day for meetings, interviews and focused work.`,
}));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spacioport');
    console.log('✅ Connected to MongoDB');

    await Promise.all([User.deleteMany({}), Space.deleteMany({}), Booking.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    await User.create({
      name: 'Admin User',
      email: 'admin@spacioport.in',
      password: 'admin123',
      role: 'admin',
    });
    await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123',
      role: 'client',
      phone: '+91 98765 43210',
      company: 'TechStartup India',
    });
    console.log('👤 Users created (admin@spacioport.in / admin123)');

    const all = [...virtualSpaces, ...longTermSpaces, ...onDemandSpaces];
    await Space.insertMany(all);
    console.log(`🏢 ${all.length} spaces created (10 virtual + 10 long-term + 10 on-demand)`);

    console.log('\n✅ Seed complete! You can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
