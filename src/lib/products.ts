import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

function multi(...ids: string[]): string[] {
  return ids.map(img);
}

// Fallback demo catalog — used when Firestore `products` collection is empty.
export const DEMO_PRODUCTS: Product[] = [
  // FASHION (women)
  { id: "p-ankara-dress", name: "Handmade Ankara Maxi Dress", price: 18500, description: "Vibrant hand-stitched Ankara dress made by artisans in Lagos. 100% cotton, machine washable.", image: img("1539109136881-3be0616acf4b"), images: multi("1539109136881-3be0616acf4b","1583846783214-7229a91b20ed","1496747611176-843222e1e57c"), category: "Fashion", stock: 24, brand: "Lagos Atelier", rating: 4.8, reviewCount: 142 },
  { id: "p-kente-skirt", name: "Kente Wrap Midi Skirt", price: 13500, description: "Authentic Ghanaian kente wrap skirt, hand-loomed with vibrant geometric patterns.", image: img("1572804013309-59a88b7e92f1"), images: multi("1572804013309-59a88b7e92f1","1485518882345-15568b007705"), category: "Fashion", stock: 30, brand: "Accra Weaves", rating: 4.7, reviewCount: 86 },
  { id: "p-bead-necklace", name: "Maasai Beaded Statement Necklace", price: 9500, description: "Hand-beaded statement necklace crafted by Maasai women's cooperatives in Kenya.", image: img("1535632787350-4e68ef0ac584"), images: multi("1535632787350-4e68ef0ac584","1611591437281-460bfbe1220a"), category: "Fashion", stock: 32, brand: "Maasai Co-op", rating: 4.9, reviewCount: 211 },
  { id: "p-wax-fabric", name: "Premium Wax Print Fabric (6 yards)", price: 22000, description: "Top-quality wax print fabric — perfect for tailoring, head wraps and home decor.", image: img("1605518215584-5bb1a3b3a06d"), category: "Fashion", stock: 15, brand: "Vlisco Inspired", rating: 4.6, reviewCount: 64 },
  { id: "p-kente-clutch", name: "Kente Cloth Clutch Bag", price: 11500, description: "Statement clutch lined with authentic Ghanaian kente. Magnetic close, detachable strap.", image: img("1591561954557-26941169b49e"), category: "Fashion", stock: 22, brand: "Accra Weaves", rating: 4.7, reviewCount: 73 },
  { id: "p-headwrap-set", name: "Ankara Headwrap & Earring Set", price: 5500, description: "Matching headwrap and beaded earrings in bold African print.", image: img("1583846783214-7229a91b20ed"), category: "Fashion", stock: 80, brand: "Lagos Atelier", rating: 4.5, reviewCount: 38 },
  { id: "p-leather-sandals", name: "Hand-stitched Tuareg Leather Sandals", price: 16500, description: "Genuine leather sandals stitched by hand by Tuareg artisans. Built to last decades.", image: img("1543163521-1bf539c55dd2"), category: "Fashion", stock: 18, brand: "Sahara Craft", rating: 4.8, reviewCount: 97 },

  // FASHION (men)
  { id: "p-print-shirt", name: "Men's African Print Shirt", price: 14000, description: "Slim-fit short-sleeve shirt in bold African print. Premium cotton blend.", image: img("1602810318383-e386cc2a3ccf"), images: multi("1602810318383-e386cc2a3ccf","1596755094514-f87e34085b2c"), category: "Fashion", stock: 40, brand: "Naija Threads", rating: 4.6, reviewCount: 124 },
  { id: "p-agbada", name: "Premium Embroidered Agbada Set", price: 65000, description: "Three-piece embroidered Agbada — top, trouser and outer robe. For weddings and special occasions.", image: img("1596755094514-f87e34085b2c"), category: "Fashion", stock: 8, brand: "Royal Tailors", rating: 4.9, reviewCount: 54 },
  { id: "p-dashiki", name: "Classic Embroidered Dashiki", price: 8500, description: "Traditional dashiki with classic neckline embroidery. Unisex fit.", image: img("1521223890158-f9f7c3d5d504"), category: "Fashion", stock: 60, brand: "Naija Threads", rating: 4.4, reviewCount: 88 },

  // BEAUTY
  { id: "p-shea-butter", name: "Raw Unrefined Shea Butter (250g)", price: 4500, description: "Pure, unrefined shea butter sourced from Northern Ghana. Deeply moisturising for skin and hair.", image: img("1556228720-195a672e8a03"), images: multi("1556228720-195a672e8a03","1570194065650-d99fb4bedf0a"), category: "Beauty", stock: 60, brand: "Pure Africa", rating: 4.9, reviewCount: 340 },
  { id: "p-black-soap", name: "African Black Soap Bar (150g)", price: 3200, description: "Traditional black soap with plantain ash and palm kernel oil. Gentle daily cleanser.", image: img("1600857544200-b2f666a9a2ec"), category: "Beauty", stock: 75, brand: "Pure Africa", rating: 4.7, reviewCount: 256 },
  { id: "p-coconut-oil", name: "Cold-Pressed Coconut Oil (500ml)", price: 5500, description: "Virgin cold-pressed coconut oil — cook, moisturise or condition your hair with it.", image: img("1590502593747-42a996133562"), category: "Beauty", stock: 50, brand: "Pure Africa", rating: 4.8, reviewCount: 198 },
  { id: "p-baobab-oil", name: "Baobab Seed Oil Serum (30ml)", price: 7800, description: "Cold-pressed baobab oil rich in omega 3,6,9. Anti-aging facial serum.", image: img("1570194065650-d99fb4bedf0a"), category: "Beauty", stock: 45, brand: "Baobab Co.", rating: 4.7, reviewCount: 132 },
  { id: "p-marula-oil", name: "Pure Marula Face Oil (50ml)", price: 12500, description: "Lightweight marula oil from Southern Africa. Antioxidant-rich, fast absorbing.", image: img("1608248543803-ba4f8c70ae0b"), category: "Beauty", stock: 35, brand: "Marula & Co.", rating: 4.8, reviewCount: 178 },
  { id: "p-argan-oil", name: "Organic Moroccan Argan Oil (100ml)", price: 9500, description: "Cold-pressed argan oil from the Atlas Mountains. For hair, skin and nails.", image: img("1608571423902-eed4a5ad8108"), category: "Beauty", stock: 70, brand: "Atlas Naturals", rating: 4.9, reviewCount: 412 },
  { id: "p-rhassoul-clay", name: "Moroccan Rhassoul Clay Mask (200g)", price: 4200, description: "Mineral-rich rhassoul clay for deep cleansing facial and hair masks.", image: img("1556228578-8c89e6adf883"), category: "Beauty", stock: 90, brand: "Atlas Naturals", rating: 4.6, reviewCount: 95 },
  { id: "p-rosewater", name: "Pure Damascene Rosewater Toner (200ml)", price: 5200, description: "Steam-distilled rosewater toner — soothing and hydrating.", image: img("1571781926291-c477ebfd024b"), category: "Beauty", stock: 55, brand: "Atlas Naturals", rating: 4.7, reviewCount: 87 },

  // HOME
  { id: "p-bolga-basket", name: "Handwoven Bolga Basket", price: 12000, description: "Traditional Bolgatanga basket — perfect for groceries, storage or as home decor.", image: img("1602874801007-aa28cd72bd54"), images: multi("1602874801007-aa28cd72bd54","1493663284031-b7e3aefcae8e"), category: "Home", stock: 18, brand: "Bolga Craft", rating: 4.8, reviewCount: 156 },
  { id: "p-mudcloth-throw", name: "Malian Mudcloth Throw Blanket", price: 24500, description: "Hand-painted bogolan (mudcloth) throw — earthy, statement piece.", image: img("1493663284031-b7e3aefcae8e"), category: "Home", stock: 12, brand: "Bamako Studio", rating: 4.9, reviewCount: 74 },
  { id: "p-rattan-mirror", name: "Round Rattan Wall Mirror", price: 18000, description: "Hand-woven rattan-framed mirror, 60cm diameter. Boho statement piece.", image: img("1586023492125-27b2c045efd7"), category: "Home", stock: 20, brand: "Casa Boho", rating: 4.7, reviewCount: 102 },
  { id: "p-clay-pot", name: "Hand-thrown Terracotta Cooking Pot", price: 8500, description: "Traditional clay pot — adds depth and earthiness to stews and rice.", image: img("1578749556568-bc2c40e68b61"), category: "Home", stock: 25, brand: "Earthworks", rating: 4.5, reviewCount: 43 },
  { id: "p-jute-rug", name: "Handwoven Jute Area Rug (5x7ft)", price: 32000, description: "Natural jute rug, sustainably woven by hand. Adds warmth to any room.", image: img("1493663284031-b7e3aefcae8e"), category: "Home", stock: 10, brand: "Casa Boho", rating: 4.6, reviewCount: 31 },
  { id: "p-soapstone-bowl", name: "Carved Kisii Soapstone Bowl", price: 6500, description: "Hand-carved Kenyan soapstone bowl — perfect for serving or decor.", image: img("1565193566173-7a0ee3dbe261"), category: "Home", stock: 30, brand: "Kisii Carvers", rating: 4.7, reviewCount: 58 },

  // FOOD & PANTRY
  { id: "p-jollof-spice", name: "Authentic Jollof Spice Mix (120g)", price: 2800, description: "A balanced blend of West African spices for the perfect pot of jollof rice.", image: img("1596797038530-2c107229654b"), category: "Food", stock: 100, brand: "Mama's Pantry", rating: 4.8, reviewCount: 234 },
  { id: "p-suya-spice", name: "Suya Pepper Spice Blend (200g)", price: 3500, description: "Smoky, nutty Nigerian suya spice blend — perfect for grilled meats and roasted vegetables.", image: img("1599909533730-c84b29b46d3b"), category: "Food", stock: 90, brand: "Mama's Pantry", rating: 4.9, reviewCount: 312 },
  { id: "p-berbere", name: "Ethiopian Berbere Spice (150g)", price: 3200, description: "Fiery, fragrant berbere — the soul of Ethiopian cooking.", image: img("1599909533730-c84b29b46d3b"), category: "Food", stock: 85, brand: "Addis Spice Co.", rating: 4.8, reviewCount: 167 },
  { id: "p-egusi-seeds", name: "Premium Ground Egusi Seeds (500g)", price: 4500, description: "Stone-ground egusi seeds for authentic egusi soup.", image: img("1596797038530-2c107229654b"), category: "Food", stock: 70, brand: "Mama's Pantry", rating: 4.7, reviewCount: 89 },
  { id: "p-palm-oil", name: "Cold-Pressed Red Palm Oil (1L)", price: 6500, description: "Pure, unrefined red palm oil — essential for West African cooking.", image: img("1559561853-08451507cbe7"), category: "Food", stock: 60, brand: "Mama's Pantry", rating: 4.6, reviewCount: 76 },
  { id: "p-ethiopian-coffee", name: "Single-Origin Ethiopian Yirgacheffe Coffee (250g)", price: 7800, description: "Bright, floral, citrus-forward whole bean coffee from Yirgacheffe.", image: img("1559056199-641a0ac8b55e"), category: "Food", stock: 50, brand: "Addis Roasters", rating: 4.9, reviewCount: 421 },
  { id: "p-kenyan-tea", name: "Kenyan Black Tea Loose Leaf (200g)", price: 3800, description: "Robust loose-leaf black tea from the Kericho highlands.", image: img("1576092768241-dec231879fc3"), category: "Food", stock: 80, brand: "Kericho Estate", rating: 4.7, reviewCount: 145 },
  { id: "p-cocoa-powder", name: "Raw Ghanaian Cacao Powder (300g)", price: 5500, description: "Single-origin cocoa powder from Ghanaian farms. Rich, deep flavor.", image: img("1606312619070-d48b4c652a52"), category: "Food", stock: 65, brand: "Cocoa Origins", rating: 4.8, reviewCount: 198 },

  // ART
  { id: "p-talking-drum", name: "Handcrafted Yoruba Talking Drum", price: 35000, description: "Authentic Yoruba talking drum — carved from solid wood with goat-skin head.", image: img("1516280440614-37939bbacd81"), images: multi("1516280440614-37939bbacd81","1452860606245-08befc0ff44b"), category: "Art", stock: 8, brand: "Yoruba Crafts", rating: 4.9, reviewCount: 41 },
  { id: "p-djembe", name: "Solid Mahogany Djembe Drum (60cm)", price: 78000, description: "Professional djembe carved from a single mahogany trunk. Hand-tuned goat-skin head.", image: img("1452860606245-08befc0ff44b"), category: "Art", stock: 5, brand: "Bamako Drums", rating: 4.9, reviewCount: 67 },
  { id: "p-wood-mask", name: "Hand-carved Senufo Wooden Mask", price: 28000, description: "Ceremonial wooden mask, hand-carved by Senufo artists of Ivory Coast.", image: img("1578922864834-cd5e9eb95cf4"), category: "Art", stock: 10, brand: "Abidjan Studio", rating: 4.8, reviewCount: 29 },
  { id: "p-soapstone-sculpture", name: "Embracing Family Soapstone Sculpture", price: 22500, description: "Smooth soapstone sculpture from Kisii. A timeless piece.", image: img("1565193566173-7a0ee3dbe261"), category: "Art", stock: 12, brand: "Kisii Carvers", rating: 4.8, reviewCount: 52 },
  { id: "p-tingatinga", name: "Original Tingatinga Painting (60x80cm)", price: 45000, description: "Vibrant Tanzanian Tingatinga painting on canvas, signed by the artist.", image: img("1578926375605-eaf7559b1458"), category: "Art", stock: 6, brand: "Tingatinga Studio", rating: 4.9, reviewCount: 23 },

  // TECH & GADGETS
  { id: "p-solar-lantern", name: "Solar-powered LED Lantern", price: 8500, description: "Rechargeable solar lantern — 30 hours runtime, USB phone charging.", image: img("1558002038-1055907df827"), category: "Tech", stock: 100, brand: "BrightLife", rating: 4.6, reviewCount: 287 },
  { id: "p-power-bank", name: "20,000mAh Fast Charge Power Bank", price: 15500, description: "Dual USB-C PD power bank with digital display.", image: img("1609592424823-2dab19ae6f23"), category: "Tech", stock: 60, brand: "Voltage", rating: 4.7, reviewCount: 412 },
  { id: "p-earbuds", name: "Wireless Bluetooth Earbuds Pro", price: 22000, description: "Active noise cancelling earbuds, 30hr battery with case.", image: img("1606220588913-b3aacb4d2f46"), category: "Tech", stock: 80, brand: "Sonix", rating: 4.7, reviewCount: 856 },
  { id: "p-smartwatch", name: "Fitness Smartwatch with Heart Rate Monitor", price: 35000, description: "Tracks heart rate, sleep, 14 sports modes. 7-day battery.", image: img("1546868871-7041f2a55e12"), category: "Tech", stock: 45, brand: "Pulse", rating: 4.6, reviewCount: 523 },

  // BAGS & ACCESSORIES
  { id: "p-leather-tote", name: "Hand-stitched Leather Tote Bag", price: 32000, description: "Full-grain Moroccan leather tote, hand-stitched. Ages beautifully.", image: img("1548036328-c9fa89d128fa"), category: "Bags", stock: 14, brand: "Marrakech Leather", rating: 4.9, reviewCount: 134 },
  { id: "p-canvas-backpack", name: "Waxed Canvas & Leather Backpack", price: 28500, description: "Durable waxed canvas backpack with leather trim and laptop sleeve.", image: img("1553062407-98eeb64c6a62"), category: "Bags", stock: 25, brand: "Sahara Craft", rating: 4.7, reviewCount: 98 },
  { id: "p-woven-fan", name: "Hand-woven Raffia Hand Fan", price: 2500, description: "Decorative and functional hand-woven raffia fan.", image: img("1602874801007-aa28cd72bd54"), category: "Home", stock: 120, brand: "Bolga Craft", rating: 4.5, reviewCount: 44 },
];

function mapDoc(d: any): Product {
  const data = d.data() as any;
  return {
    id: d.id,
    name: data.name ?? "Unnamed",
    price: Number(data.price ?? 0),
    description: data.description ?? "",
    image: data.image ?? "",
    images: data.images,
    category: data.category ?? "General",
    stock: Number(data.stock ?? data.stockQuantity ?? 0),
    brand: data.brand,
    rating: data.rating,
    reviewCount: data.reviewCount,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) return DEMO_PRODUCTS;
    return snap.docs.map(mapDoc);
  } catch {
    return DEMO_PRODUCTS;
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const demo = DEMO_PRODUCTS.find((p) => p.id === id);
  try {
    const snap = await getDoc(doc(db, "products", id));
    if (snap.exists()) return mapDoc(snap);
  } catch {
    /* ignore */
  }
  return demo ?? null;
}

export function getRelatedProducts(p: Product, n = 6): Product[] {
  return DEMO_PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category).slice(0, n);
}

// Recently-viewed (localStorage)
const RV_KEY = "afribuy:recently-viewed";
export function pushRecentlyViewed(id: string) {
  if (typeof window === "undefined") return;
  try {
    const list: string[] = JSON.parse(localStorage.getItem(RV_KEY) ?? "[]");
    const next = [id, ...list.filter((x) => x !== id)].slice(0, 12);
    localStorage.setItem(RV_KEY, JSON.stringify(next));
  } catch {}
}
export function getRecentlyViewed(excludeId?: string, n = 6): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const list: string[] = JSON.parse(localStorage.getItem(RV_KEY) ?? "[]");
    return list
      .filter((id) => id !== excludeId)
      .map((id) => DEMO_PRODUCTS.find((p) => p.id === id))
      .filter((x): x is Product => !!x)
      .slice(0, n);
  } catch {
    return [];
  }
}

// Mock reviews keyed by product id
const REVIEW_AUTHORS = ["Chioma A.", "Tunde O.", "Amaka E.", "Kwame B.", "Sade I.", "Ibrahim K.", "Ngozi U.", "Femi A.", "Ada N.", "Yemi S."];
const REVIEW_SNIPPETS = [
  "Excellent quality, exactly as described. Will definitely order again!",
  "Fast delivery, well-packaged. Very happy with my purchase.",
  "Authentic and beautifully made. Worth every naira.",
  "The colors are even more vibrant in person. Love it!",
  "Great value for the price. Highly recommend.",
  "Beautiful craftsmanship. You can tell it was made with care.",
  "Came earlier than expected. Quality is top tier.",
  "My friends keep asking where I got it. Great purchase.",
  "Solid build, looks premium. Five stars.",
  "Met all my expectations. Will be a returning customer.",
];

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export function getReviews(productId: string): Review[] {
  const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = 4 + (seed % 5);
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 7) % REVIEW_AUTHORS.length;
    const sIdx = (seed + i * 11) % REVIEW_SNIPPETS.length;
    const rating = 4 + ((seed + i) % 2);
    const daysAgo = (i + 1) * 3 + (seed % 7);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    reviews.push({
      id: `${productId}-r${i}`,
      author: REVIEW_AUTHORS[idx],
      rating,
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      text: REVIEW_SNIPPETS[sIdx],
      verified: i % 3 !== 0,
    });
  }
  return reviews;
}
