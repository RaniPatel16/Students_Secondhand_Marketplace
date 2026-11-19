# CampusMart – Student Second-Hand Marketplace 🎓📦

A full-stack second-hand marketplace web application built for college students to buy, sell, and exchange used textbooks, scientific calculators, stationery, and hostel essentials.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **MongoDB / Mongoose**.

---

## 📁 Project Structure

```text
campusmart/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.js              # GET all (filter/search), POST create product
│   │   │   └── [id]/
│   │   │       └── route.js          # GET single, PUT update, DELETE product
│   │   ├── favorites/
│   │   │   ├── route.js              # GET user favorites, POST add favorite
│   │   │   └── [id]/
│   │   │       └── route.js          # DELETE favorite
│   │   └── enquiries/
│   │       ├── route.js              # GET enquiries, POST create enquiry/offer
│   │       └── [id]/
│   │           └── route.js          # PATCH status (Accept/Reject), DELETE enquiry
│   ├── marketplace/
│   │   ├── page.js                   # Marketplace grid, search, filter & sort
│   │   └── [id]/
│   │       ├── page.js               # Product details, seller info & enquiry modal
│   │       └── edit/
│   │           └── page.js           # Edit listing page
│   ├── sell/
│   │   └── page.js                   # Post new product listing page
│   ├── my-listings/
│   │   └── page.js                   # Dashboard (My Listings, Received Offers, Sent Offers)
│   ├── favorites/
│   │   └── page.js                   # Bookmarked / saved items page
│   ├── layout.js                     # Root layout with Navbar, Footer & Toaster
│   ├── page.js                       # Home landing page
│   └── globals.css                   # Custom theme & styling
├── components/
│   ├── Navbar.jsx                    # Navigation header with demo profile switcher
│   ├── Footer.jsx                    # Footer component
│   ├── ProductCard.jsx               # Reusable product card with favorite button
│   ├── ProductGrid.jsx               # Responsive product grid & empty state
│   ├── ProductForm.jsx               # Reusable create/edit form with file upload
│   ├── SearchBar.jsx                 # Live search input bar
│   ├── CategoryFilter.jsx            # Sidebar & mobile filters (Category, Condition, Price)
│   ├── EnquiryModal.jsx              # Buyer enquiry and counter-offer modal
│   └── LoadingSkeleton.jsx           # Loading skeletons for products and details
├── models/
│   ├── Product.js                    # Mongoose product schema
│   ├── Favorite.js                   # Mongoose favorite/wishlist schema
│   └── Enquiry.js                    # Mongoose enquiry & offer schema
├── lib/
│   ├── mongodb.js                    # Cached MongoDB connection helper
│   ├── utils.js                      # Price formatting & date helpers
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

## 🚀 Features

- **Product Listings**: Create, edit, and delete listings with title, description, price, condition, category, and images.
- **Item Discovery & Search**: Live keyword search across title and description.
- **Filters & Sorting**: Filter by Category (Books, Electronics, Furniture, Stationery, Other), Condition (New, Like New, Good, Fair), and Price Range (₹ Min - Max). Sort by Newest or Price.
- **Product Details & Similar Items**: Detailed view with multiple photos, discount calculation, and category recommendations.
- **Seller Profiles & Direct Filter**: View seller contact info and click *"Browse other items by this seller"* to view all products listed by that student.
- **Enquiries & Price Offers**: Buyers can contact sellers and make counter-offers. Sellers can **Accept** or **Reject** offers.
- **Buyer Sent Offers Tab**: Students can track the status of all offers they sent to other sellers directly from the dashboard.
- **Favorites / Wishlist**: Save items to review later with status indicators (Available, Sold, Reserved).
- **Student Dashboard (`/my-listings`)**: 3 tabs to manage active listings (mark Available/Reserved/Sold), review received offers, and track sent offers.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React icons
- **Backend**: Next.js API Route Handlers
- **Database**: MongoDB with Mongoose
- **Notifications**: React Hot Toast

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/RaniPatel16/Students_Secondhand_Marketplace.git
cd Students_Secondhand_Marketplace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env.local` file in the root folder:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/campusmart
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Or use your MongoDB Atlas connection string)*

### 4. (Optional) Seed sample data
```bash
npm run seed
```

### 5. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Demo Student Profiles

Use the profile switcher in the navigation bar to test buyer and seller workflows:
- `rani.patel@campus.edu` (Rani Patel)
- `arjun.sharma@campus.edu` (Arjun Sharma)
- `sneha.verma@campus.edu` (Sneha Verma)
