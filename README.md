# CampusMart – Student Second-Hand Marketplace 🎓📦

> **Buy Smart. Sell Easy. Reuse More.**  
> A modern, full-stack campus peer-to-peer marketplace built with **Next.js (App Router)**, **Tailwind CSS**, and **MongoDB / Mongoose**. Designed specifically for university students to trade textbooks, scientific calculators, stationery, hostel furniture, and campus essentials safely.

---

## 🎨 Theme & Color Palette

Designed according to modern marketplace guidelines with a refined Oxford Green and Champagne Gold aesthetic:

| Element | Hex Code | Visual Tone |
| :--- | :---: | :--- |
| **Primary Brand** | `#0F3A2E` | Deep British Forest Emerald / Oxford Green |
| **Accent & Highlights** | `#C5A059` | Warm Champagne Gold |
| **Background Canvas** | `#FBF9F5` | Alabaster Ivory |
| **Cards & Surfaces** | `#FFFFFF` | Pure White |
| **Borders & Dividers** | `#E7E2D6` | Warm Parchment |
| **Main Typography** | `#13221C` | Deep Pine Charcoal |
| **Muted Typography** | `#617169` | Muted Sage Slate |

---

## 🚀 Key Features

### 1. 🏠 Marketplace Landing Page (`/`)
- Hero section with quick search and CTA buttons.
- Category shortcuts (Books, Electronics, Hostel Furniture, Stationery, Other).
- **Featured Campus Listings** and **Recently Added Items** dynamically loaded from MongoDB.
- Value proposition highlights (Zero commission, Student discounts, Campus safety).

### 2. 🔍 Marketplace Exploration (`/marketplace`)
- Live search across product names and descriptions.
- Multi-faceted filter sidebar:
  - **Category**: Filter by Books, Electronics, Furniture, Stationery, Other.
  - **Condition**: New, Like New, Good, Fair.
  - **Price Range**: Custom minimum and maximum price in Indian Rupees (₹).
- Sorting options:
  - Newest Listed
  - Price: Low to High
  - Price: High to Low
  - Oldest First
- Responsive grid with loading skeletons and empty states.

### 3. 📄 Product Details View (`/marketplace/[id]`)
- Product photo gallery with primary view and thumbnail selection.
- Clear pricing, original price strike-through, and calculated savings discount badge.
- Verified student seller information card (name, hostel location, phone, email).
- Direct **"Contact Seller / Make Counter Offer"** modal.
- Persistent **"Add to Favorites"** toggle button.
- Related products in the same category.

### 4. ➕ Sell Item Form (`/sell`)
- Comprehensive item creation form with client and server-side validation.
- Fields: Title, Category, Condition, Listing Type (For Sale / Free / Exchange), Price, Original Price, Description, Seller Details (Name, Email, Phone, Location).
- Support for image upload from local device (base64) or direct image URL.
- Live photo preview and image deletion prior to posting.

### 5. 📦 Seller Center Dashboard (`/my-listings`)
- View all products listed under the current student profile.
- **Product Status Management**: Instant update between `Available`, `Reserved`, and `Sold`.
- **Visibility Toggle**: Hide/show listings without deleting them.
- **Edit Listing**: Edit price, description, images, and details (`/marketplace/[id]/edit`).
- **Delete Listing**: Cascade delete removing product, associated enquiries, and favorites.
- **Buyer Offers & Enquiries Inbox**: View buyer messages and counter-offers; accept or decline offers in real-time.

### 6. ❤️ Saved Items Wishlist (`/favorites`)
- Persistent MongoDB-backed wishlist tied to student profile.
- Quick remove from favorites.
- Direct navigation back to product details.

### 7. 👤 Demo Profile Switcher
- Easy top-bar demo student switcher:
  - `rani.patel@campus.edu` (Rani Patel)
  - `arjun.sharma@campus.edu` (Arjun Sharma)
  - `sneha.verma@campus.edu` (Sneha Verma)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **ODM**: Mongoose
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

---

## 📁 Project Structure

```text
campusmart/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.js              # GET all (filter/search), POST create
│   │   │   └── [id]/
│   │   │       └── route.js          # GET single, PUT update, DELETE product
│   │   ├── favorites/
│   │   │   ├── route.js              # GET user favorites, POST add
│   │   │   └── [id]/
│   │   │       └── route.js          # DELETE favorite
│   │   └── enquiries/
│   │       ├── route.js              # GET enquiries, POST create
│   │       └── [id]/
│   │           └── route.js          # PATCH status, DELETE enquiry
│   ├── marketplace/
│   │   ├── page.js                   # Marketplace grid & filters
│   │   └── [id]/
│   │       ├── page.js               # Product details & enquiry modal
│   │       └── edit/
│   │           └── page.js           # Edit product page
│   ├── sell/
│   │   └── page.js                   # Sell product form
│   ├── my-listings/
│   │   └── page.js                   # Seller dashboard & enquiry manager
│   ├── favorites/
│   │   └── page.js                   # Wishlist page
│   ├── layout.js                     # Root layout with Navbar, Footer & Toaster
│   ├── page.js                       # Landing page
│   └── globals.css                   # Custom theme & utility CSS
├── components/
│   ├── Navbar.jsx                    # Header with profile switcher & mobile menu
│   ├── Footer.jsx                    # CampusMart footer
│   ├── ProductCard.jsx               # Reusable product card
│   ├── ProductGrid.jsx               # Grid container & empty states
│   ├── ProductForm.jsx               # Reusable create / edit listing form
│   ├── SearchBar.jsx                 # Search input with clear button
│   ├── CategoryFilter.jsx            # Category, condition & price sidebar
│   ├── EnquiryModal.jsx              # Buyer enquiry and counter-offer modal
│   └── LoadingSkeleton.jsx           # Animated loading placeholders
├── models/
│   ├── Product.js                    # Mongoose product schema
│   ├── Favorite.js                   # Mongoose favorite schema
│   └── Enquiry.js                    # Mongoose enquiry schema
├── lib/
│   ├── mongodb.js                    # Cached MongoDB connection helper
│   ├── utils.js                      # Currency formatting & date helpers
│   └── validations.js                # Form validation functions
├── scripts/
│   └── seed.js                       # Sample seed data with campus items
├── .env.example
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Clone the repository
```bash
git clone https://github.com/RaniPatel16/Students_Secondhand_Marketplace.git
cd Students_Secondhand_Marketplace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusmart?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(You can also use a local MongoDB instance: `mongodb://127.0.0.1:27017/campusmart`)*

### 4. Seed Sample Student Data
Populate the database with sample textbooks, calculators, furniture, and bicycles:
```bash
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Checklist

- [x] **Landing Page**: Verified Hero, categories, featured and recent product sections.
- [x] **Search & Multi-Filtering**: Tested category, condition, min/max price filters and search keyword queries.
- [x] **Product Creation**: Tested form validation, photo preview, and MongoDB insertion via `/sell`.
- [x] **Product Details**: Tested gallery selection, seller info display, and similar products.
- [x] **Edit & Delete**: Verified updates and cascade deletions from My Listings.
- [x] **Favorites**: Verified saving, removing, and database persistence across browser refreshes.
- [x] **Buyer Enquiries**: Tested offer submission and seller accept/decline buttons.
- [x] **Responsive UI**: Tested across mobile, tablet, and desktop breakpoints.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import `Students_Secondhand_Marketplace`.
4. In Environment Variables, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
5. Click **Deploy**. Vercel will build and launch the site automatically.
