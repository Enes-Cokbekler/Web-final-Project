// Product Data for ElectroMart
const products = [
    // HES Cables - 1.5mm²
    { id: 1, name: "HES Cable 1.5mm² Brown", brand: "HES", category: "cables", thickness: "1.5mm²", color: "Brown", price: 45.00, image: "images/hes 1.5 kahverengi.jpg", description: "High-quality HES brand electrical cable, 1.5mm² cross-section, brown color. 100 meter roll. Ideal for residential and commercial installations.", stock: 50, unit: "roll", badge: null, rating: 4.8 },
    { id: 2, name: "HES Cable 1.5mm² Red", brand: "HES", category: "cables", thickness: "1.5mm²", color: "Red", price: 45.00, image: "images/hes 1.5 kırmızı .jpg", description: "High-quality HES brand electrical cable, 1.5mm² cross-section, red color. 100 meter roll. Perfect for phase wiring.", stock: 45, unit: "roll", badge: "popular", rating: 4.9 },
    { id: 3, name: "HES Cable 1.5mm² Blue", brand: "HES", category: "cables", thickness: "1.5mm²", color: "Blue", price: 45.00, image: "images/hes 1.5 mavi--4c86-.jpg", description: "High-quality HES brand electrical cable, 1.5mm² cross-section, blue color. 100 meter roll. Standard for neutral connections.", stock: 48, unit: "roll", badge: null, rating: 4.7 },
    { id: 4, name: "HES Cable 1.5mm² Yellow-Green", brand: "HES", category: "cables", thickness: "1.5mm²", color: "Yellow-Green", price: 45.00, image: "images/hes 1.5 sarı yeşil.jpg", description: "High-quality HES brand electrical cable, 1.5mm² cross-section, yellow-green color. 100 meter roll. Essential for grounding.", stock: 40, unit: "roll", badge: null, rating: 4.8 },
    { id: 5, name: "HES Cable 1.5mm² Black", brand: "HES", category: "cables", thickness: "1.5mm²", color: "Black", price: 45.00, image: "images/hes 1.5 siyah .jpg", description: "High-quality HES brand electrical cable, 1.5mm² cross-section, black color. 100 meter roll. Versatile for various applications.", stock: 52, unit: "roll", badge: null, rating: 4.6 },

    // HES Cables - 2.5mm²
    { id: 6, name: "HES Cable 2.5mm² Brown", brand: "HES", category: "cables", thickness: "2.5mm²", color: "Brown", price: 75.00, image: "images/hes 2.5 kahverengi.jpg", description: "Premium HES brand electrical cable, 2.5mm² cross-section, brown color. 100 meter roll. Suitable for higher current applications.", stock: 35, unit: "roll", badge: null, rating: 4.9 },
    { id: 7, name: "HES Cable 2.5mm² Red", brand: "HES", category: "cables", thickness: "2.5mm²", color: "Red", price: 75.00, image: "images/hes 2.5 kırmızı .jpg", description: "Premium HES brand electrical cable, 2.5mm² cross-section, red color. 100 meter roll. Ideal for power circuits.", stock: 32, unit: "roll", badge: "popular", rating: 4.9 },
    { id: 8, name: "HES Cable 2.5mm² Blue", brand: "HES", category: "cables", thickness: "2.5mm²", color: "Blue", price: 75.00, image: "images/hes 2.5 mavi .jpg", description: "Premium HES brand electrical cable, 2.5mm² cross-section, blue color. 100 meter roll. Professional grade quality.", stock: 38, unit: "roll", badge: null, rating: 4.8 },
    { id: 9, name: "HES Cable 2.5mm² Yellow-Green", brand: "HES", category: "cables", thickness: "2.5mm²", color: "Yellow-Green", price: 75.00, image: "images/hes 2.5 sarı yeşil.jpg", description: "Premium HES brand electrical cable, 2.5mm² cross-section, yellow-green for grounding. 100 meter roll.", stock: 30, unit: "roll", badge: null, rating: 4.7 },
    { id: 10, name: "HES Cable 2.5mm² Black", brand: "HES", category: "cables", thickness: "2.5mm²", color: "Black", price: 75.00, image: "images/hes 2.5 siyah .jpg", description: "Premium HES brand electrical cable, 2.5mm² cross-section, black color. 100 meter roll. Heavy-duty performance.", stock: 34, unit: "roll", badge: "new", rating: 4.8 },

    // ÖZNUR Cables - 1.5mm²
    { id: 11, name: "ÖZNUR Cable 1.5mm² Brown", brand: "ÖZNUR", category: "cables", thickness: "1.5mm²", color: "Brown", price: 42.00, image: "images/öznur 1.5 kahverengi.jpg", description: "ÖZNUR brand electrical cable, 1.5mm² cross-section, brown color. 100 meter roll. Reliable and affordable.", stock: 60, unit: "roll", badge: null, rating: 4.5 },
    { id: 12, name: "ÖZNUR Cable 1.5mm² Red", brand: "ÖZNUR", category: "cables", thickness: "1.5mm²", color: "Red", price: 42.00, image: "images/öznur 1.5 kırmızı.webp", description: "ÖZNUR brand electrical cable, 1.5mm² cross-section, red color. 100 meter roll. Cost-effective solution.", stock: 55, unit: "roll", badge: null, rating: 4.6 },
    { id: 13, name: "ÖZNUR Cable 1.5mm² Blue", brand: "ÖZNUR", category: "cables", thickness: "1.5mm²", color: "Blue", price: 42.00, image: "images/öznur 1.5 mavi--4c86-.jpg", description: "ÖZNUR brand electrical cable, 1.5mm² cross-section, blue color. 100 meter roll. Quality certified.", stock: 58, unit: "roll", badge: null, rating: 4.5 },
    { id: 14, name: "ÖZNUR Cable 1.5mm² Yellow-Green", brand: "ÖZNUR", category: "cables", thickness: "1.5mm²", color: "Yellow-Green", price: 42.00, image: "images/öznur 1.5 sarı yeşil.jpg", description: "ÖZNUR brand electrical cable, 1.5mm² cross-section, yellow-green for earth. 100 meter roll.", stock: 50, unit: "roll", badge: null, rating: 4.4 },
    { id: 15, name: "ÖZNUR Cable 1.5mm² Black", brand: "ÖZNUR", category: "cables", thickness: "1.5mm²", color: "Black", price: 42.00, image: "images/öznur 1.5 siyah .jpg", description: "ÖZNUR brand electrical cable, 1.5mm² cross-section, black color. 100 meter roll. Great value.", stock: 62, unit: "roll", badge: "sale", rating: 4.5 },

    // ÖZNUR Cables - 2.5mm²
    { id: 16, name: "ÖZNUR Cable 2.5mm² Brown", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Brown", price: 68.00, image: "images/öznur 2.5 kahverengi.jpg", description: "ÖZNUR brand electrical cable, 2.5mm² cross-section, brown color. 100 meter roll. Durable and reliable.", stock: 40, unit: "roll", badge: null, rating: 4.6 },
    { id: 17, name: "ÖZNUR Cable 2.5mm² Red", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Red", price: 68.00, image: "images/öznur 2.5 kırmızı.jpg", description: "ÖZNUR brand electrical cable, 2.5mm² cross-section, red color. 100 meter roll. Professional choice.", stock: 38, unit: "roll", badge: null, rating: 4.7 },
    { id: 18, name: "ÖZNUR Cable 2.5mm² Blue", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Blue", price: 68.00, image: "images/öznur 2.5 mavi--4c86-.jpg", description: "ÖZNUR brand electrical cable, 2.5mm² cross-section, blue color. 100 meter roll. Industry standard.", stock: 42, unit: "roll", badge: null, rating: 4.6 },
    { id: 19, name: "ÖZNUR Cable 2.5mm² Yellow-Green", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Yellow-Green", price: 68.00, image: "images/öznur 2.5 sarı yeşil.jpg", description: "ÖZNUR brand electrical cable, 2.5mm² cross-section, yellow-green grounding wire. 100 meter roll.", stock: 36, unit: "roll", badge: null, rating: 4.5 },
    { id: 20, name: "ÖZNUR Cable 2.5mm² Black", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Black", price: 68.00, image: "images/öznur 2.5 siyah .jpg", description: "ÖZNUR brand electrical cable, 2.5mm² cross-section, black color. 100 meter roll. Excellent performance.", stock: 44, unit: "roll", badge: null, rating: 4.6 },
    { id: 21, name: "ÖZNUR Cable 2.5mm² Complete Set", brand: "ÖZNUR", category: "cables", thickness: "2.5mm²", color: "Mixed", price: 320.00, image: "images/öznur 2.5 set.webp", description: "Complete ÖZNUR cable set with all colors, 2.5mm² cross-section. 5 rolls included. Perfect starter kit.", stock: 20, unit: "set", badge: "popular", rating: 4.9 },

    // Circuit Breakers
    { id: 22, name: "Miniature Circuit Breaker 16A", brand: "Generic", category: "breakers", price: 12.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=MCB+16A", description: "16 Amp miniature circuit breaker for residential use. DIN rail mounting.", stock: 200, unit: "piece", badge: "popular", rating: 4.7 },
    { id: 23, name: "Miniature Circuit Breaker 20A", brand: "Generic", category: "breakers", price: 13.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=MCB+20A", description: "20 Amp miniature circuit breaker. Reliable overload protection.", stock: 180, unit: "piece", badge: null, rating: 4.6 },
    { id: 24, name: "Miniature Circuit Breaker 32A", brand: "Generic", category: "breakers", price: 15.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=MCB+32A", description: "32 Amp miniature circuit breaker for heavy loads.", stock: 150, unit: "piece", badge: null, rating: 4.8 },
    { id: 25, name: "RCD 30mA 2-Pole", brand: "Generic", category: "breakers", price: 35.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=RCD+30mA", description: "Residual current device 30mA sensitivity, 2-pole. Essential safety device.", stock: 100, unit: "piece", badge: "new", rating: 4.9 },

    // Outlets & Switches
    { id: 26, name: "Double Socket Outlet White", brand: "Generic", category: "outlets", price: 8.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Socket+White", description: "Double grounded socket outlet, white color. Modern design.", stock: 300, unit: "piece", badge: null, rating: 4.5 },
    { id: 27, name: "Single Light Switch", brand: "Generic", category: "switches", price: 4.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Switch+1G", description: "Single gang light switch, white. Smooth operation.", stock: 400, unit: "piece", badge: null, rating: 4.4 },
    { id: 28, name: "Double Light Switch", brand: "Generic", category: "switches", price: 6.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Switch+2G", description: "Double gang light switch, white. Control two lights.", stock: 350, unit: "piece", badge: null, rating: 4.5 },
    { id: 29, name: "Dimmer Switch", brand: "Generic", category: "switches", price: 18.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Dimmer", description: "LED compatible dimmer switch. Adjust brightness smoothly.", stock: 120, unit: "piece", badge: "new", rating: 4.7 },

    // LED Bulbs
    { id: 30, name: "LED Bulb 9W E27 Warm", brand: "Generic", category: "lighting", price: 3.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=LED+9W", description: "9W LED bulb, E27 base, warm white 3000K. Energy efficient.", stock: 500, unit: "piece", badge: null, rating: 4.6 },
    { id: 31, name: "LED Bulb 12W E27 Daylight", brand: "Generic", category: "lighting", price: 4.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=LED+12W", description: "12W LED bulb, E27 base, daylight 6500K. Bright illumination.", stock: 450, unit: "piece", badge: "popular", rating: 4.7 },
    { id: 32, name: "LED Panel 18W Square", brand: "Generic", category: "lighting", price: 22.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Panel+18W", description: "18W square LED panel light. Slim design for modern spaces.", stock: 80, unit: "piece", badge: null, rating: 4.8 },

    // Tools & Accessories
    { id: 33, name: "Electrical Tape Black", brand: "Generic", category: "accessories", price: 1.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Tape+Black", description: "PVC electrical insulation tape, black. 19mm x 20m.", stock: 1000, unit: "piece", badge: null, rating: 4.3 },
    { id: 34, name: "Wire Connectors Set", brand: "Generic", category: "accessories", price: 8.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Connectors", description: "Assorted wire connectors set, various sizes. 100 pieces.", stock: 200, unit: "set", badge: null, rating: 4.5 },
    { id: 35, name: "Junction Box 100x100mm", brand: "Generic", category: "accessories", price: 5.50, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Junction+Box", description: "IP54 rated junction box, 100x100mm. Weatherproof.", stock: 250, unit: "piece", badge: null, rating: 4.4 },
    { id: 36, name: "Digital Multimeter", brand: "Generic", category: "tools", price: 28.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Multimeter", description: "Digital multimeter with auto-ranging. Essential testing tool.", stock: 75, unit: "piece", badge: "popular", rating: 4.8 },
    { id: 37, name: "Cable Stripper Tool", brand: "Generic", category: "tools", price: 12.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Stripper", description: "Automatic wire stripper for various cable sizes.", stock: 100, unit: "piece", badge: null, rating: 4.6 },
    { id: 38, name: "Screwdriver Set Electrician", brand: "Generic", category: "tools", price: 25.00, image: "https://placehold.co/400x400/2d2d44/ffffff?text=Screwdrivers", description: "Insulated screwdriver set for electrical work. 7 pieces.", stock: 60, unit: "set", badge: "new", rating: 4.9 }
];

// Category definitions
const categories = [
    { id: "all", name: "All Products", icon: "📦" },
    { id: "cables", name: "Cables", icon: "🔌" },
    { id: "breakers", name: "Circuit Breakers", icon: "⚡" },
    { id: "outlets", name: "Outlets", icon: "🔲" },
    { id: "switches", name: "Switches", icon: "💡" },
    { id: "lighting", name: "Lighting", icon: "💡" },
    { id: "accessories", name: "Accessories", icon: "🔧" },
    { id: "tools", name: "Tools", icon: "🛠️" }
];

// Brand definitions
const brands = [
    { id: "all", name: "All Brands" },
    { id: "HES", name: "HES" },
    { id: "ÖZNUR", name: "ÖZNUR" },
    { id: "Generic", name: "Generic" }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, categories, brands };
}
