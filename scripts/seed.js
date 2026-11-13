const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/campusmart";

// Define schema directly for standalone execution
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: String,
    condition: String,
    listingType: String,
    images: [String],
    sellerName: String,
    sellerEmail: String,
    sellerPhone: String,
    location: String,
    status: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const sampleProducts = [
  {
    name: "Higher Engineering Mathematics - B.S. Grewal (44th Edition)",
    description: "Standard university textbook for Engineering Mathematics 1 & 2. Clean pages, no torn leaves, minimal pencil underlining in initial chapters. Highly recommended for 1st & 2nd year students.",
    price: 420,
    originalPrice: 850,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Rani Patel",
    sellerEmail: "rani.patel@campus.edu",
    sellerPhone: "+91 98765 43210",
    location: "Girls Hostel 3, Room 204",
    status: "Available",
    isActive: true,
  },
  {
    name: "Casio FX-991EX ClassWiz Scientific Calculator",
    description: "Original Casio FX-991EX with high-res natural textbook display and 552 functions. Solar + battery dual power. Perfect condition, used for two semesters only. Comes with hard protective cover.",
    price: 950,
    originalPrice: 1595,
    category: "Electronics",
    condition: "Like New",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Arjun Sharma",
    sellerEmail: "arjun.sharma@campus.edu",
    sellerPhone: "+91 91234 56789",
    location: "Boys Hostel 1, Block B",
    status: "Available",
    isActive: true,
  },
  {
    name: "Foldable Wooden Study Desk with Cup Holder",
    description: "Engineered wood foldable bed/floor study table with tablet/book groove and cup holder. Sturdy aluminum alloy legs. Very portable, folds flat for hostel room storage.",
    price: 499,
    originalPrice: 999,
    category: "Furniture",
    condition: "Like New",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Sneha Verma",
    sellerEmail: "sneha.verma@campus.edu",
    sellerPhone: "+91 98451 22334",
    location: "Girls Hostel 2, 1st Floor",
    status: "Available",
    isActive: true,
  },
  {
    name: "Engineering Mini Drafter with Sturdy Steel Rods",
    description: "Omega mini drafter for Engineering Graphics / Drawing. Smooth scale pivot, no parallax error. Includes hard carrying case and drawing sheet clips. Must have for 1st year engineering.",
    price: 350,
    originalPrice: 750,
    category: "Stationery",
    condition: "Good",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1581291518655-9523c932deb8?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Rani Patel",
    sellerEmail: "rani.patel@campus.edu",
    sellerPhone: "+91 98765 43210",
    location: "Girls Hostel 3, Room 204",
    status: "Available",
    isActive: true,
  },
  {
    name: "Hero Sprint 26T Mountain Bicycle (Single Speed)",
    description: "Black and neon green Hero Sprint bicycle. Smooth tires, dual disc brakes, front suspension. Great for commuting between hostel and lecture halls. Includes combination lock cable.",
    price: 3200,
    originalPrice: 6500,
    category: "Other",
    condition: "Good",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Arjun Sharma",
    sellerEmail: "arjun.sharma@campus.edu",
    sellerPhone: "+91 91234 56789",
    location: "Cycle Stand near Library",
    status: "Available",
    isActive: true,
  },
  {
    name: "Boat Rockerz 450 Wireless On-Ear Headphones",
    description: "Matte black on-ear Bluetooth headphones with 40mm drivers. Up to 15 hours playback. Super comfortable padded earcups for long study sessions. Comes with aux cable and type-C charging cable.",
    price: 799,
    originalPrice: 1499,
    category: "Electronics",
    condition: "Like New",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Sneha Verma",
    sellerEmail: "sneha.verma@campus.edu",
    sellerPhone: "+91 98451 22334",
    location: "Main Cafeteria",
    status: "Available",
    isActive: true,
  },
  {
    name: "Introduction to Algorithms (CLRS 3rd Edition)",
    description: "The gold standard book for Data Structures & Algorithms by Cormen, Leiserson, Rivest, Stein. Paperback edition. Binding is intact, clean notes inside.",
    price: 750,
    originalPrice: 1350,
    category: "Books",
    condition: "Good",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1532012164546-f432f2e37257?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Rani Patel",
    sellerEmail: "rani.patel@campus.edu",
    sellerPhone: "+91 98765 43210",
    location: "Girls Hostel 3, Room 204",
    status: "Available",
    isActive: true,
  },
  {
    name: "Prestige 1.5L Stainless Steel Electric Kettle",
    description: "1500-watt electric kettle with auto shut-off. Perfect for making instant noodles, coffee, and tea in hostel room. Sparkling clean inside, heating element works 100%.",
    price: 450,
    originalPrice: 995,
    category: "Other",
    condition: "Good",
    listingType: "For Sale",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    ],
    sellerName: "Arjun Sharma",
    sellerEmail: "arjun.sharma@campus.edu",
    sellerPhone: "+91 91234 56789",
    location: "Boys Hostel 1, Block B",
    status: "Available",
    isActive: true,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // Clear existing sample items to prevent infinite duplicates
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} old products`);

    // Insert sample items
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} campus products into database!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error running seed script:", error);
    process.exit(1);
  }
}

seed();
