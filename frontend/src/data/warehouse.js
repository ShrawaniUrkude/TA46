// Amazon-style warehouse layout configuration
export const warehouseConfig = {
  width: 900,
  height: 600,
  gridSize: 20, // Each grid cell is 20x20 pixels
  workerStart: { x: 50, y: 550 }, // Starting position (entrance)
};

// Warehouse sections/zones
export const warehouseSections = [
  { id: 'receiving', name: 'Receiving Dock', x: 0, y: 0, width: 180, height: 100, color: '#3B82F6' },
  { id: 'shipping', name: 'Shipping Dock', x: 720, y: 0, width: 180, height: 100, color: '#EF4444' },
  { id: 'packing', name: 'Packing Station', x: 720, y: 500, width: 180, height: 100, color: '#F59E0B' },
  { id: 'entrance', name: 'Worker Entrance', x: 0, y: 500, width: 100, height: 100, color: '#10B981' },
];

// Aisles configuration (vertical corridors between racks)
export const aisles = [
  { id: 'aisle-1', name: 'Aisle 1', x: 100, y: 120, width: 40, height: 360 },
  { id: 'aisle-2', name: 'Aisle 2', x: 240, y: 120, width: 40, height: 360 },
  { id: 'aisle-3', name: 'Aisle 3', x: 380, y: 120, width: 40, height: 360 },
  { id: 'aisle-4', name: 'Aisle 4', x: 520, y: 120, width: 40, height: 360 },
  { id: 'aisle-5', name: 'Aisle 5', x: 660, y: 120, width: 40, height: 360 },
  // Horizontal corridors
  { id: 'corridor-top', name: 'Top Corridor', x: 100, y: 100, width: 600, height: 40 },
  { id: 'corridor-bottom', name: 'Bottom Corridor', x: 100, y: 460, width: 600, height: 40 },
  { id: 'corridor-middle', name: 'Middle Corridor', x: 100, y: 280, width: 600, height: 40 },
];

// Rack/Shelf configurations
export const racks = [
  // Section A - Electronics (between aisle 1 and 2)
  { id: 'A1', section: 'A', x: 140, y: 140, width: 100, height: 60, category: 'Electronics', color: '#8B5CF6' },
  { id: 'A2', section: 'A', x: 140, y: 200, width: 100, height: 80, category: 'Electronics', color: '#8B5CF6' },
  { id: 'A3', section: 'A', x: 140, y: 320, width: 100, height: 60, category: 'Electronics', color: '#8B5CF6' },
  { id: 'A4', section: 'A', x: 140, y: 380, width: 100, height: 80, category: 'Electronics', color: '#8B5CF6' },
  
  // Section B - Home & Kitchen (between aisle 2 and 3)
  { id: 'B1', section: 'B', x: 280, y: 140, width: 100, height: 60, category: 'Home & Kitchen', color: '#EC4899' },
  { id: 'B2', section: 'B', x: 280, y: 200, width: 100, height: 80, category: 'Home & Kitchen', color: '#EC4899' },
  { id: 'B3', section: 'B', x: 280, y: 320, width: 100, height: 60, category: 'Home & Kitchen', color: '#EC4899' },
  { id: 'B4', section: 'B', x: 280, y: 380, width: 100, height: 80, category: 'Home & Kitchen', color: '#EC4899' },
  
  // Section C - Clothing (between aisle 3 and 4)
  { id: 'C1', section: 'C', x: 420, y: 140, width: 100, height: 60, category: 'Clothing', color: '#14B8A6' },
  { id: 'C2', section: 'C', x: 420, y: 200, width: 100, height: 80, category: 'Clothing', color: '#14B8A6' },
  { id: 'C3', section: 'C', x: 420, y: 320, width: 100, height: 60, category: 'Clothing', color: '#14B8A6' },
  { id: 'C4', section: 'C', x: 420, y: 380, width: 100, height: 80, category: 'Clothing', color: '#14B8A6' },
  
  // Section D - Books & Media (between aisle 4 and 5)
  { id: 'D1', section: 'D', x: 560, y: 140, width: 100, height: 60, category: 'Books & Media', color: '#F97316' },
  { id: 'D2', section: 'D', x: 560, y: 200, width: 100, height: 80, category: 'Books & Media', color: '#F97316' },
  { id: 'D3', section: 'D', x: 560, y: 320, width: 100, height: 60, category: 'Books & Media', color: '#F97316' },
  { id: 'D4', section: 'D', x: 560, y: 380, width: 100, height: 80, category: 'Books & Media', color: '#F97316' },
];

// Product inventory with locations
export const products = [
  // Electronics - Section A
  { id: 'SKU-001', name: 'iPhone 15 Pro', category: 'Electronics', rack: 'A1', shelf: 1, quantity: 45, x: 160, y: 155 },
  { id: 'SKU-002', name: 'Samsung Galaxy S24', category: 'Electronics', rack: 'A1', shelf: 2, quantity: 32, x: 180, y: 170 },
  { id: 'SKU-003', name: 'MacBook Pro 16"', category: 'Electronics', rack: 'A2', shelf: 1, quantity: 18, x: 160, y: 220 },
  { id: 'SKU-004', name: 'Dell XPS 15', category: 'Electronics', rack: 'A2', shelf: 2, quantity: 24, x: 180, y: 240 },
  { id: 'SKU-005', name: 'Sony WH-1000XM5', category: 'Electronics', rack: 'A2', shelf: 3, quantity: 67, x: 200, y: 260 },
  { id: 'SKU-006', name: 'AirPods Pro 2', category: 'Electronics', rack: 'A3', shelf: 1, quantity: 120, x: 160, y: 340 },
  { id: 'SKU-007', name: 'iPad Air', category: 'Electronics', rack: 'A3', shelf: 2, quantity: 38, x: 180, y: 360 },
  { id: 'SKU-008', name: 'Nintendo Switch', category: 'Electronics', rack: 'A4', shelf: 1, quantity: 56, x: 160, y: 400 },
  { id: 'SKU-009', name: 'PS5 Controller', category: 'Electronics', rack: 'A4', shelf: 2, quantity: 89, x: 180, y: 420 },
  { id: 'SKU-010', name: 'Xbox Series X', category: 'Electronics', rack: 'A4', shelf: 3, quantity: 22, x: 200, y: 440 },
  
  // Home & Kitchen - Section B
  { id: 'SKU-011', name: 'Instant Pot Duo', category: 'Home & Kitchen', rack: 'B1', shelf: 1, quantity: 34, x: 300, y: 155 },
  { id: 'SKU-012', name: 'Ninja Blender', category: 'Home & Kitchen', rack: 'B1', shelf: 2, quantity: 28, x: 320, y: 170 },
  { id: 'SKU-013', name: 'KitchenAid Mixer', category: 'Home & Kitchen', rack: 'B2', shelf: 1, quantity: 15, x: 300, y: 220 },
  { id: 'SKU-014', name: 'Dyson V15 Vacuum', category: 'Home & Kitchen', rack: 'B2', shelf: 2, quantity: 42, x: 320, y: 240 },
  { id: 'SKU-015', name: 'Keurig Coffee Maker', category: 'Home & Kitchen', rack: 'B2', shelf: 3, quantity: 53, x: 340, y: 260 },
  { id: 'SKU-016', name: 'Air Fryer XL', category: 'Home & Kitchen', rack: 'B3', shelf: 1, quantity: 76, x: 300, y: 340 },
  { id: 'SKU-017', name: 'Cast Iron Skillet Set', category: 'Home & Kitchen', rack: 'B3', shelf: 2, quantity: 44, x: 320, y: 360 },
  { id: 'SKU-018', name: 'Vitamix Blender', category: 'Home & Kitchen', rack: 'B4', shelf: 1, quantity: 19, x: 300, y: 400 },
  { id: 'SKU-019', name: 'Robot Vacuum', category: 'Home & Kitchen', rack: 'B4', shelf: 2, quantity: 31, x: 320, y: 420 },
  { id: 'SKU-020', name: 'Espresso Machine', category: 'Home & Kitchen', rack: 'B4', shelf: 3, quantity: 27, x: 340, y: 440 },
  
  // Clothing - Section C
  { id: 'SKU-021', name: 'Nike Air Max', category: 'Clothing', rack: 'C1', shelf: 1, quantity: 156, x: 440, y: 155 },
  { id: 'SKU-022', name: 'Adidas Ultraboost', category: 'Clothing', rack: 'C1', shelf: 2, quantity: 134, x: 460, y: 170 },
  { id: 'SKU-023', name: 'Levi\'s 501 Jeans', category: 'Clothing', rack: 'C2', shelf: 1, quantity: 89, x: 440, y: 220 },
  { id: 'SKU-024', name: 'North Face Jacket', category: 'Clothing', rack: 'C2', shelf: 2, quantity: 67, x: 460, y: 240 },
  { id: 'SKU-025', name: 'Champion Hoodie', category: 'Clothing', rack: 'C2', shelf: 3, quantity: 203, x: 480, y: 260 },
  { id: 'SKU-026', name: 'Ray-Ban Sunglasses', category: 'Clothing', rack: 'C3', shelf: 1, quantity: 78, x: 440, y: 340 },
  { id: 'SKU-027', name: 'Fossil Watch', category: 'Clothing', rack: 'C3', shelf: 2, quantity: 45, x: 460, y: 360 },
  { id: 'SKU-028', name: 'Herschel Backpack', category: 'Clothing', rack: 'C4', shelf: 1, quantity: 92, x: 440, y: 400 },
  { id: 'SKU-029', name: 'Under Armour Shorts', category: 'Clothing', rack: 'C4', shelf: 2, quantity: 187, x: 460, y: 420 },
  { id: 'SKU-030', name: 'Carhartt Beanie', category: 'Clothing', rack: 'C4', shelf: 3, quantity: 234, x: 480, y: 440 },
  
  // Books & Media - Section D
  { id: 'SKU-031', name: 'Atomic Habits', category: 'Books & Media', rack: 'D1', shelf: 1, quantity: 89, x: 580, y: 155 },
  { id: 'SKU-032', name: 'The Psychology of Money', category: 'Books & Media', rack: 'D1', shelf: 2, quantity: 67, x: 600, y: 170 },
  { id: 'SKU-033', name: 'Dune (Hardcover)', category: 'Books & Media', rack: 'D2', shelf: 1, quantity: 45, x: 580, y: 220 },
  { id: 'SKU-034', name: 'Harry Potter Box Set', category: 'Books & Media', rack: 'D2', shelf: 2, quantity: 34, x: 600, y: 240 },
  { id: 'SKU-035', name: 'Kindle Paperwhite', category: 'Books & Media', rack: 'D2', shelf: 3, quantity: 78, x: 620, y: 260 },
  { id: 'SKU-036', name: 'Taylor Swift Vinyl', category: 'Books & Media', rack: 'D3', shelf: 1, quantity: 156, x: 580, y: 340 },
  { id: 'SKU-037', name: 'Bluetooth Speaker', category: 'Books & Media', rack: 'D3', shelf: 2, quantity: 89, x: 600, y: 360 },
  { id: 'SKU-038', name: 'Board Game Collection', category: 'Books & Media', rack: 'D4', shelf: 1, quantity: 43, x: 580, y: 400 },
  { id: 'SKU-039', name: 'LEGO Star Wars Set', category: 'Books & Media', rack: 'D4', shelf: 2, quantity: 67, x: 600, y: 420 },
  { id: 'SKU-040', name: 'Puzzle 1000 Pieces', category: 'Books & Media', rack: 'D4', shelf: 3, quantity: 112, x: 620, y: 440 },
];

// Category colors for legend
export const categoryColors = {
  'Electronics': '#8B5CF6',
  'Home & Kitchen': '#EC4899',
  'Clothing': '#14B8A6',
  'Books & Media': '#F97316',
};
