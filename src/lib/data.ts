export interface Part {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  compatibility: string[];
  manufacturer: string;
  stock: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  sku: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    partId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const generateParts = (): Part[] => {
  const categories = ['Engine', 'Transmission', 'Suspension', 'Brakes', 'Electrical', 'Interior', 'Exterior', 'HVAC'];
  const manufacturers = ['OEM Solutions', 'TechPart', 'AutoElite', 'MechaWorks', 'PrimeDrive', 'VehiclePro'];
  const carBrands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia'];
  
  const carModels: Record<string, string[]> = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
    'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Focus'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
    'Mercedes': ['C-Class', 'E-Class', 'GLC', 'S-Class', 'GLE'],
    'Audi': ['A4', 'Q5', 'A6', 'Q7', 'A3'],
    'Volkswagen': ['Golf', 'Jetta', 'Tiguan', 'Passat', 'Atlas'],
    'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Murano'],
    'Hyundai': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona'],
    'Kia': ['Sorento', 'Sportage', 'Forte', 'Telluride', 'Soul']
  };
  
  const partDescriptions: Record<string, string[]> = {
    'Engine': [
      'High-performance air filter for improved airflow and engine protection',
      'Premium synthetic oil filter with extended life and superior filtration',
      'Precision-engineered camshaft with optimized valve timing for improved performance',
      'Heavy-duty timing belt with reinforced construction for long service life',
      'Direct replacement fuel injector with improved atomization for better efficiency'
    ],
    'Transmission': [
      'Synthetic transmission fluid formulated for smooth shifts and wear protection',
      'Precision transmission filter designed for maximum fluid flow and contaminant capture',
      'Heavy-duty clutch kit engineered for durability and consistent engagement',
      'Reinforced transmission mount designed to reduce vibration and maintain alignment',
      'Direct-fit transmission cooler for optimal operating temperatures'
    ],
    'Suspension': [
      'Performance shock absorbers with precision valving for improved handling',
      'Heavy-duty coil springs designed for stability and load support',
      'Premium control arms with enhanced bushings for reduced noise and vibration',
      'Reinforced sway bar links for improved cornering and stability',
      'Direct-fit strut assembly with pre-assembled components for easy installation'
    ],
    'Brakes': [
      'Ceramic brake pads engineered for low noise and dust with excellent stopping power',
      'Premium brake rotors with anti-corrosion coating for extended life',
      'High-performance brake fluid with high boiling point for fade resistance',
      'Stainless steel brake lines for improved pedal feel and consistent performance',
      'Pre-assembled brake calipers with brackets for direct replacement'
    ],
    'Electrical': [
      'High-output alternator designed for increased electrical demand and reliability',
      'Premium AGM battery with enhanced cycle life and deep discharge recovery',
      'Direct-fit oxygen sensor with fast response time for optimal fuel efficiency',
      'High-performance ignition coils for improved spark energy and engine performance',
      'Enhanced starter motor with upgraded components for reliable cold starts'
    ],
    'Interior': [
      'Custom-fit floor mats with reinforced heel pad and water-resistant construction',
      'Direct replacement dashboard with OEM-matching finish and texture',
      'Enhanced steering wheel controls with improved tactile response',
      'Premium seat covers designed for exact fit and long-lasting durability',
      'Upgraded HVAC control module for improved climate control performance'
    ],
    'Exterior': [
      'Direct-fit headlight assemblies with improved light output and beam pattern',
      'Reinforced bumper covers with OEM-matching finish and mounting points',
      'Weather-resistant door handles with improved mechanism for long-term reliability',
      'Enhanced side mirrors with integrated turn signals and blind spot indicators',
      'Premium windshield wipers with silicone blade technology for clear visibility'
    ],
    'HVAC': [
      'High-capacity A/C compressor designed for improved cooling performance',
      'Enhanced heater core with optimized flow for faster cabin heating',
      'Direct-fit cabin air filter with activated carbon for odor filtration',
      'Premium blower motor with balanced operation for reduced noise',
      'Optimized condenser with corrosion-resistant coating for extended service life'
    ]
  };
  
  const categoryImages: Record<string, string[]> = {
    'Engine': [
      '/images/engine-1.jpg',
      '/images/engine-2.jpg',
      '/images/engine-3.jpg'
    ],
    'Transmission': [
      '/images/transmission-1.jpg',
      '/images/transmission-2.jpg',
      '/images/transmission-3.jpg'
    ],
    'Suspension': [
      '/images/suspension-1.jpg',
      '/images/suspension-2.jpg',
      '/images/suspension-3.jpg'
    ],
    'Brakes': [
      '/images/brakes-1.jpg',
      '/images/brakes-2.jpg',
      '/images/brakes-3.jpg'
    ],
    'Electrical': [
      '/images/electrical-1.jpg',
      '/images/electrical-2.jpg',
      '/images/electrical-3.jpg'
    ],
    'Interior': [
      '/images/interior-1.jpg',
      '/images/interior-2.jpg',
      '/images/interior-3.jpg'
    ],
    'Exterior': [
      '/images/exterior-1.jpg',
      '/images/exterior-2.jpg',
      '/images/exterior-3.jpg'
    ],
    'HVAC': [
      '/images/hvac-1.jpg',
      '/images/hvac-2.jpg',
      '/images/hvac-3.jpg'
    ]
  };
  
  const parts: Part[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
    const models = carModels[brand];
    
    const numModels = Math.floor(Math.random() * 3) + 1;
    const compatibility: string[] = [];
    
    for (let j = 0; j < numModels; j++) {
      const modelIndex = Math.floor(Math.random() * models.length);
      const yearStart = 2010 + Math.floor(Math.random() * 10);
      const yearEnd = yearStart + Math.floor(Math.random() * 5) + 1;
      const compatString = `${brand} ${models[modelIndex]} (${yearStart}-${yearEnd})`;
      
      if (!compatibility.includes(compatString)) {
        compatibility.push(compatString);
      }
    }
    
    const descriptions = partDescriptions[category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    let name = '';
    switch (category) {
      case 'Engine':
        name = ['Air Filter', 'Oil Filter', 'Camshaft', 'Timing Belt', 'Fuel Injector'][Math.floor(Math.random() * 5)];
        break;
      case 'Transmission':
        name = ['Transmission Fluid', 'Transmission Filter', 'Clutch Kit', 'Transmission Mount', 'Transmission Cooler'][Math.floor(Math.random() * 5)];
        break;
      case 'Suspension':
        name = ['Shock Absorber', 'Coil Spring', 'Control Arm', 'Sway Bar Link', 'Strut Assembly'][Math.floor(Math.random() * 5)];
        break;
      case 'Brakes':
        name = ['Brake Pads', 'Brake Rotor', 'Brake Fluid', 'Brake Line', 'Brake Caliper'][Math.floor(Math.random() * 5)];
        break;
      case 'Electrical':
        name = ['Alternator', 'Battery', 'Oxygen Sensor', 'Ignition Coil', 'Starter Motor'][Math.floor(Math.random() * 5)];
        break;
      case 'Interior':
        name = ['Floor Mats', 'Dashboard', 'Steering Wheel Controls', 'Seat Covers', 'HVAC Control Module'][Math.floor(Math.random() * 5)];
        break;
      case 'Exterior':
        name = ['Headlight Assembly', 'Bumper Cover', 'Door Handle', 'Side Mirror', 'Windshield Wipers'][Math.floor(Math.random() * 5)];
        break;
      case 'HVAC':
        name = ['A/C Compressor', 'Heater Core', 'Cabin Air Filter', 'Blower Motor', 'Condenser'][Math.floor(Math.random() * 5)];
        break;
    }
    
    name = `${manufacturer} ${name}`;
    
    let basePrice = 0;
    switch (category) {
      case 'Engine':
        basePrice = 50 + Math.floor(Math.random() * 450);
        break;
      case 'Transmission':
        basePrice = 100 + Math.floor(Math.random() * 900);
        break;
      case 'Suspension':
        basePrice = 80 + Math.floor(Math.random() * 320);
        break;
      case 'Brakes':
        basePrice = 40 + Math.floor(Math.random() * 260);
        break;
      case 'Electrical':
        basePrice = 60 + Math.floor(Math.random() * 340);
        break;
      case 'Interior':
        basePrice = 30 + Math.floor(Math.random() * 270);
        break;
      case 'Exterior':
        basePrice = 50 + Math.floor(Math.random() * 350);
        break;
      case 'HVAC':
        basePrice = 70 + Math.floor(Math.random() * 330);
        break;
    }
    
    const sku = `${category.substring(0, 3).toUpperCase()}-${manufacturer.substring(0, 3).toUpperCase()}-${i.toString().padStart(5, '0')}`;
    
    const categoryImagesArr = categoryImages[category] || ['/placeholder.svg'];
    const imageUrl = categoryImagesArr[i % categoryImagesArr.length];
    
    parts.push({
      id: `part-${i}`,
      name,
      description,
      price: basePrice,
      category,
      compatibility,
      manufacturer,
      stock: Math.floor(Math.random() * 100),
      imageUrl,
      rating: 3 + Math.random() * 2,
      reviews: Math.floor(Math.random() * 500),
      sku
    });
  }
  
  return parts;
};

export const parts = generateParts();

export const sampleApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Development API Key',
    key: 'sk_dev_' + Math.random().toString(36).substring(2, 15),
    created: '2023-06-12T10:24:35Z',
    lastUsed: '2023-06-15T14:35:22Z',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Production API Key',
    key: 'sk_prod_' + Math.random().toString(36).substring(2, 15),
    created: '2023-07-03T09:12:18Z',
    lastUsed: null,
    status: 'inactive'
  }
];

export const sampleOrders: Order[] = [
  {
    id: 'ORD-12345',
    date: '2023-06-10T14:23:10Z',
    status: 'delivered',
    items: [
      {
        partId: 'part-12',
        quantity: 2,
        price: 129.99
      },
      {
        partId: 'part-35',
        quantity: 1,
        price: 79.50
      }
    ],
    total: 339.48,
    trackingNumber: 'TRK-987654321',
    estimatedDelivery: '2023-06-14T00:00:00Z'
  },
  {
    id: 'ORD-12346',
    date: '2023-06-18T09:45:22Z',
    status: 'shipped',
    items: [
      {
        partId: 'part-8',
        quantity: 1,
        price: 249.99
      }
    ],
    total: 249.99,
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2023-06-22T00:00:00Z'
  },
  {
    id: 'ORD-12347',
    date: '2023-06-20T16:12:05Z',
    status: 'processing',
    items: [
      {
        partId: 'part-42',
        quantity: 4,
        price: 34.50
      },
      {
        partId: 'part-17',
        quantity: 1,
        price: 129.99
      },
      {
        partId: 'part-53',
        quantity: 2,
        price: 45.75
      }
    ],
    total: 290.49
  }
];
