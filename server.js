const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'hsbs_secret_2024';

app.use(cors({
  origin: [
    "http://localhost:3000"
  ]
}));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
app.use(express.json());

// ─── SRI LANKA CITIES ────────────────────────────────────────────────────────
const CITIES = [
  'Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna',
  'Matara', 'Kurunegala', 'Ratnapura', 'Anuradhapura',
  'Trincomalee', 'Batticaloa', 'Badulla', 'Nuwara Eliya',
  'Hambantota', 'Kalutara'
];

// ─── IN-MEMORY DATA STORE ────────────────────────────────────────────────────
let users = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@hsbs.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    city: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust-001',
    name: 'John Silva',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'customer',
    phone: '+94 77 123 4567',
    address: 'Galle Road, Colombo 03',
    city: 'Colombo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust-002',
    name: 'Amara Perera',
    email: 'amara@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'customer',
    phone: '+94 77 222 3333',
    address: 'Kandy Road, Kandy',
    city: 'Kandy',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cust-003',
    name: 'Ravi Mendis',
    email: 'ravi@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'customer',
    phone: '+94 76 333 4444',
    address: 'Main Street, Galle',
    city: 'Galle',
    createdAt: new Date().toISOString()
  }
];

let providers = [
  {
    id: 'prov-001',
    name: 'Kamal Perera',
    email: 'kamal@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Electrician',
    bio: 'Licensed electrician with 10+ years experience. Specializing in residential wiring, panel upgrades, and smart home installations.',
    phone: '+94 77 987 6543',
    city: 'Colombo',
    experience: 10,
    hourlyRate: 2500,
    rating: 4.8,
    totalReviews: 47,
    status: 'approved',
    services: ['Wiring', 'Panel Upgrade', 'Smart Home', 'Emergency Repair'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-002',
    name: 'Nimal Fernando',
    email: 'nimal@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Plumber',
    bio: 'Expert plumber handling all types of residential and commercial plumbing. Available for emergency calls 24/7.',
    phone: '+94 71 234 5678',
    city: 'Kandy',
    experience: 8,
    hourlyRate: 2000,
    rating: 4.6,
    totalReviews: 35,
    status: 'approved',
    services: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Leak Detection'],
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-003',
    name: 'Suresh Mendis',
    email: 'suresh@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'AC Repair',
    bio: 'Certified HVAC technician with expertise in all major AC brands. Fast and reliable service.',
    phone: '+94 76 345 6789',
    city: 'Galle',
    experience: 6,
    hourlyRate: 3000,
    rating: 4.9,
    totalReviews: 62,
    status: 'approved',
    services: ['AC Installation', 'AC Service', 'Gas Refill', 'Emergency Repair'],
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-004',
    name: 'Priya Jayawardena',
    email: 'priya@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Carpenter',
    bio: 'Master carpenter with extensive experience in custom furniture, cabinetry, and home renovations.',
    phone: '+94 75 456 7890',
    city: 'Negombo',
    experience: 12,
    hourlyRate: 2200,
    rating: 4.7,
    totalReviews: 28,
    status: 'approved',
    services: ['Custom Furniture', 'Cabinet Making', 'Door Repair', 'Flooring'],
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-005',
    name: 'Chamara Wickrama',
    email: 'chamara@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Painter',
    bio: 'Professional painter offering interior and exterior painting with premium finishes.',
    phone: '+94 78 567 8901',
    city: 'Colombo',
    experience: 7,
    hourlyRate: 1800,
    rating: 4.5,
    totalReviews: 41,
    status: 'approved',
    services: ['Interior Painting', 'Exterior Painting', 'Texture Coating', 'Waterproofing'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-006',
    name: 'Dilani Rajapaksa',
    email: 'dilani@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Cleaning Service',
    bio: 'Professional cleaning service for homes and offices. Deep cleaning, regular maintenance, and post-construction cleanup.',
    phone: '+94 72 678 9012',
    city: 'Colombo',
    experience: 5,
    hourlyRate: 1500,
    rating: 4.8,
    totalReviews: 89,
    status: 'approved',
    services: ['Deep Cleaning', 'Regular Cleaning', 'Office Cleaning', 'Post-Construction'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-007',
    name: 'Saman Kumara',
    email: 'saman@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Electrician',
    bio: 'Reliable electrician serving Kandy and surrounding areas for 8 years.',
    phone: '+94 71 111 2222',
    city: 'Kandy',
    experience: 8,
    hourlyRate: 2200,
    rating: 4.6,
    totalReviews: 30,
    status: 'approved',
    services: ['Wiring', 'Emergency Repair', 'Lighting', 'Socket Installation'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-008',
    name: 'Ruwan Bandara',
    email: 'ruwan@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Plumber',
    bio: 'Expert plumber in Colombo with same-day service availability.',
    phone: '+94 77 333 4444',
    city: 'Colombo',
    experience: 5,
    hourlyRate: 1900,
    rating: 4.4,
    totalReviews: 22,
    status: 'approved',
    services: ['Pipe Repair', 'Leak Detection', 'Water Tank', 'Toilet Repair'],
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'prov-009',
    name: 'Tharanga Silva',
    email: 'tharanga@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'provider',
    category: 'Painter',
    bio: 'Quality painter in Galle with experience in luxury homes.',
    phone: '+94 76 555 6666',
    city: 'Galle',
    experience: 9,
    hourlyRate: 2000,
    rating: 4.7,
    totalReviews: 38,
    status: 'pending',
    services: ['Interior Painting', 'Exterior Painting', 'Polish', 'Varnishing'],
    availability: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
    createdAt: new Date().toISOString()
  }
];

let bookings = [
  {
    id: 'book-001',
    customerId: 'cust-001',
    customerName: 'John Silva',
    customerCity: 'Colombo',
    providerId: 'prov-001',
    providerName: 'Kamal Perera',
    providerCity: 'Colombo',
    category: 'Electrician',
    service: 'Wiring',
    date: '2026-03-20',
    time: '10:00 AM',
    address: 'No. 45, Galle Road, Colombo 03',
    notes: 'Need to fix living room wiring',
    status: 'confirmed',
    totalAmount: 5000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-002',
    customerId: 'cust-001',
    customerName: 'John Silva',
    customerCity: 'Colombo',
    providerId: 'prov-005',
    providerName: 'Chamara Wickrama',
    providerCity: 'Colombo',
    category: 'Painter',
    service: 'Interior Painting',
    date: '2026-03-18',
    time: '2:00 PM',
    address: 'No. 45, Galle Road, Colombo 03',
    notes: 'Living room and bedroom',
    status: 'completed',
    totalAmount: 3600,
    createdAt: new Date().toISOString()
  }
];

let reviews = [
  {
    id: 'rev-001',
    bookingId: 'book-002',
    customerId: 'cust-001',
    customerName: 'John Silva',
    providerId: 'prov-005',
    rating: 5,
    comment: 'Excellent work! Very professional and clean.',
    createdAt: new Date().toISOString()
  }
];

const categories = [
  { id: 'cat-1', name: 'Electrician', icon: '⚡', description: 'Wiring, repairs, installations', color: '#F59E0B' },
  { id: 'cat-2', name: 'Plumber', icon: '🔧', description: 'Pipes, drains, water systems', color: '#3B82F6' },
  { id: 'cat-3', name: 'Carpenter', icon: '🪚', description: 'Furniture, cabinets, woodwork', color: '#92400E' },
  { id: 'cat-4', name: 'AC Repair', icon: '❄️', description: 'Installation, service, gas refill', color: '#06B6D4' },
  { id: 'cat-5', name: 'Painter', icon: '🎨', description: 'Interior, exterior, textures', color: '#8B5CF6' },
  { id: 'cat-6', name: 'Cleaning Service', icon: '🧹', description: 'Deep clean, regular, office', color: '#10B981' }
];

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// ─── CITIES ROUTE ─────────────────────────────────────────────────────────────
app.get('/api/cities', (req, res) => res.json(CITIES));

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, address, city } = req.body;
  if (!city) return res.status(400).json({ message: 'Please select your city' });
  if (users.find(u => u.email === email) || providers.find(p => p.email === email))
    return res.status(400).json({ message: 'Email already registered' });
  const user = {
    id: uuidv4(),
    name, email,
    password: await bcrypt.hash(password, 10),
    role: 'customer',
    phone: phone || '',
    address: address || '',
    city,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email, city: user.city }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, city: user.city } });
});

app.post('/api/auth/register-provider', async (req, res) => {
  const { name, email, password, phone, category, bio, city, experience, hourlyRate } = req.body;
  if (!city) return res.status(400).json({ message: 'Please select your city' });
  if (users.find(u => u.email === email) || providers.find(p => p.email === email))
    return res.status(400).json({ message: 'Email already registered' });
  const provider = {
    id: uuidv4(),
    name, email,
    password: await bcrypt.hash(password, 10),
    role: 'provider',
    category, bio,
    phone: phone || '',
    city,
    experience: parseInt(experience) || 0,
    hourlyRate: parseInt(hourlyRate) || 0,
    rating: 0,
    totalReviews: 0,
    status: 'pending',
    services: [],
    availability: [],
    createdAt: new Date().toISOString()
  };
  providers.push(provider);
  const token = jwt.sign({ id: provider.id, role: 'provider', name: provider.name, email: provider.email, city: provider.city }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: provider.id, name: provider.name, email: provider.email, role: 'provider', city: provider.city, status: provider.status } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  let user = users.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email, city: user.city }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, city: user.city } });
  }
  let provider = providers.find(p => p.email === email);
  if (provider && await bcrypt.compare(password, provider.password)) {
    const token = jwt.sign({ id: provider.id, role: 'provider', name: provider.name, email: provider.email, city: provider.city }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: provider.id, name: provider.name, email: provider.email, role: 'provider', city: provider.city, status: provider.status } });
  }
  res.status(401).json({ message: 'Invalid email or password' });
});

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => res.json(categories));

// Providers — filtered by city if provided
app.get('/api/providers', (req, res) => {
  const { category, city, search } = req.query;
  let result = providers.filter(p => p.status === 'approved');
  // City filter — REQUIRED for location-based system
  if (city) result = result.filter(p => p.city === city);
  if (category) result = result.filter(p => p.category === category);
  if (search) result = result.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.bio.toLowerCase().includes(search.toLowerCase())
  );
  res.json(result.map(p => ({ ...p, password: undefined })));
});

app.get('/api/providers/:id', (req, res) => {
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  const providerReviews = reviews.filter(r => r.providerId === req.params.id);
  res.json({ ...provider, password: undefined, reviews: providerReviews });
});

// City stats — how many providers per city
app.get('/api/cities/stats', (req, res) => {
  const stats = {};
  CITIES.forEach(city => {
    stats[city] = providers.filter(p => p.city === city && p.status === 'approved').length;
  });
  res.json(stats);
});

// ─── BOOKING ROUTES ───────────────────────────────────────────────────────────
app.post('/api/bookings', authMiddleware, (req, res) => {
  const { providerId, service, date, time, address, notes } = req.body;
  const provider = providers.find(p => p.id === providerId);
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  const customer = users.find(u => u.id === req.user.id);
  // City match check
  if (customer && provider.city !== customer.city) {
    return res.status(400).json({ message: `This provider only serves ${provider.city}. Your city is ${customer.city}.` });
  }
  const booking = {
    id: uuidv4(),
    customerId: req.user.id,
    customerName: req.user.name,
    customerCity: req.user.city || customer?.city,
    providerId,
    providerName: provider.name,
    providerCity: provider.city,
    category: provider.category,
    service,
    date,
    time,
    address,
    notes: notes || '',
    status: 'pending',
    totalAmount: provider.hourlyRate * 2,
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  res.json(booking);
});

app.get('/api/bookings/my', authMiddleware, (req, res) => {
  const userBookings = bookings.filter(b => b.customerId === req.user.id);
  res.json(userBookings);
});

app.get('/api/bookings/provider', authMiddleware, (req, res) => {
  const providerBookings = bookings.filter(b => b.providerId === req.user.id);
  res.json(providerBookings);
});

app.patch('/api/bookings/:id/status', authMiddleware, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.status = req.body.status;
  res.json(booking);
});

// ─── REVIEW ROUTES ────────────────────────────────────────────────────────────
app.post('/api/reviews', authMiddleware, (req, res) => {
  const { bookingId, providerId, rating, comment } = req.body;
  const existing = reviews.find(r => r.bookingId === bookingId && r.customerId === req.user.id);
  if (existing) return res.status(400).json({ message: 'Review already submitted' });
  const review = {
    id: uuidv4(),
    bookingId, providerId,
    customerId: req.user.id,
    customerName: req.user.name,
    rating: parseInt(rating),
    comment,
    createdAt: new Date().toISOString()
  };
  reviews.push(review);
  const providerReviews = reviews.filter(r => r.providerId === providerId);
  const provider = providers.find(p => p.id === providerId);
  if (provider) {
    provider.totalReviews = providerReviews.length;
    provider.rating = parseFloat((providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1));
  }
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) booking.reviewed = true;
  res.json(review);
});

// ─── PROVIDER PROFILE ROUTES ─────────────────────────────────────────────────
app.get('/api/provider/profile', authMiddleware, (req, res) => {
  const provider = providers.find(p => p.id === req.user.id);
  if (!provider) return res.status(404).json({ message: 'Profile not found' });
  res.json({ ...provider, password: undefined });
});

app.patch('/api/provider/profile', authMiddleware, (req, res) => {
  const provider = providers.find(p => p.id === req.user.id);
  if (!provider) return res.status(404).json({ message: 'Profile not found' });
  const { bio, phone, city, hourlyRate, services, availability } = req.body;
  if (bio) provider.bio = bio;
  if (phone) provider.phone = phone;
  if (city) provider.city = city;
  if (hourlyRate) provider.hourlyRate = parseInt(hourlyRate);
  if (services) provider.services = services;
  if (availability) provider.availability = availability;
  res.json({ ...provider, password: undefined });
});

// ─── CUSTOMER CITY UPDATE ─────────────────────────────────────────────────────
app.patch('/api/customer/city', authMiddleware, (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ message: 'City required' });
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.city = city;
  res.json({ ...user, password: undefined });
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', authMiddleware, adminOnly, (req, res) => {
  const cityBreakdown = {};
  CITIES.forEach(city => {
    cityBreakdown[city] = {
      providers: providers.filter(p => p.city === city && p.status === 'approved').length,
      customers: users.filter(u => u.city === city && u.role === 'customer').length,
      bookings: bookings.filter(b => b.providerCity === city).length,
    };
  });
  res.json({
    totalUsers: users.filter(u => u.role === 'customer').length,
    totalProviders: providers.length,
    approvedProviders: providers.filter(p => p.status === 'approved').length,
    pendingProviders: providers.filter(p => p.status === 'pending').length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.status === 'completed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0),
    cityBreakdown,
    cities: CITIES
  });
});

app.get('/api/admin/users', authMiddleware, adminOnly, (req, res) => {
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.get('/api/admin/providers', authMiddleware, adminOnly, (req, res) => {
  const { city } = req.query;
  let result = providers;
  if (city) result = result.filter(p => p.city === city);
  res.json(result.map(p => ({ ...p, password: undefined })));
});

app.patch('/api/admin/providers/:id/status', authMiddleware, adminOnly, (req, res) => {
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  provider.status = req.body.status;
  res.json({ ...provider, password: undefined });
});

app.delete('/api/admin/users/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(idx, 1);
  res.json({ message: 'User deleted' });
});

app.delete('/api/admin/providers/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = providers.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Provider not found' });
  providers.splice(idx, 1);
  res.json({ message: 'Provider deleted' });
});

app.get('/api/admin/bookings', authMiddleware, adminOnly, (req, res) => {
  const { city } = req.query;
  let result = bookings;
  if (city) result = result.filter(b => b.providerCity === city);
  res.json(result);
});

app.get('/api/admin/categories', authMiddleware, adminOnly, (req, res) => {
  res.json(categories);
});

app.listen(PORT, () => console.log(`HSBS Backend running on port ${PORT}`));
