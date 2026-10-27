const { db, testConnection } = require("../config/db");
const FoodItem = require("./FoodItem");
const Order = require("./Order");

const initialFoodItems = [
  {
    name: "Wood-Fired Margherita Pizza",
    description: "Authentic Neapolitan pizza topped with San Marzano tomatoes, fresh mozzarella, basil, and a drizzle of extra virgin olive oil.",
    price: 12.99,
    category: "Burgers & Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "15-20 min",
    rating: 4.8,
    spiceLevel: "Mild",
    calories: 680,
  },
  {
    name: "Classic Gourmet Cheeseburger",
    description: "Juicy flame-grilled beef patty, melted cheddar, crisp lettuce, heirloom tomato, and secret house aioli on a toasted brioche bun.",
    price: 10.49,
    category: "Burgers & Pizzas",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    isVegetarian: false,
    isAvailable: true,
    prepTime: "15-20 min",
    rating: 4.7,
    spiceLevel: "Medium",
    calories: 750,
  },
  {
    name: "Creamy Butter Chicken with Butter Naan",
    description: "Tender tandoori chicken cooked in a rich, buttery, spiced tomato gravy, served with fluffy garlic butter naan.",
    price: 14.99,
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
    isVegetarian: false,
    isAvailable: true,
    prepTime: "20-25 min",
    rating: 4.9,
    spiceLevel: "Medium",
    calories: 820,
  },
  {
    name: "Royal Paneer Dum Biryani",
    description: "Fragrant basmati rice layered with marinated spiced cottage cheese cubes, caramelized onions, saffron, and aromatic herbs.",
    price: 13.5,
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "20-25 min",
    rating: 4.8,
    spiceLevel: "Spicy",
    calories: 650,
  },
  {
    name: "Crispy Peri-Peri Chicken Wings",
    description: "Crispy deep-fried chicken wings tossed in a spicy, tangy African peri-peri glaze, served with blue cheese dip.",
    price: 8.99,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    isVegetarian: false,
    isAvailable: true,
    prepTime: "12-15 min",
    rating: 4.6,
    spiceLevel: "Extra Spicy",
    calories: 520,
  },
  {
    name: "Crispy Tandoori Paneer Tikka",
    description: "Smoked paneer cubes marinated in yogurt and spices, skewered with bell peppers and onions, roasted over open fire.",
    price: 9.49,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "15 min",
    rating: 4.7,
    spiceLevel: "Medium",
    calories: 410,
  },
  {
    name: "Molten Chocolate Lava Cake",
    description: "Warm Belgian chocolate cake with a molten chocolate center that flows with every spoon, paired with vanilla bean gelato.",
    price: 6.99,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "10 min",
    rating: 4.9,
    spiceLevel: "Mild",
    calories: 490,
  },
  {
    name: "New York Strawberry Cheesecake",
    description: "Velvety smooth cream cheese filling over a buttery graham cracker crust, topped with fresh strawberry compote.",
    price: 7.25,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "5 min",
    rating: 4.8,
    spiceLevel: "Mild",
    calories: 440,
  },
  {
    name: "Fresh Mint & Lime Mojito",
    description: "Sparkling crushed ice cooler with freshly muddled mint sprigs, zesty key lime, and raw cane sugar.",
    price: 4.99,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "5 min",
    rating: 4.6,
    spiceLevel: "Mild",
    calories: 140,
  },
  {
    name: "Iced Caramel Macchiato",
    description: "Rich espresso layered with creamy whole milk, vanilla syrup, and drizzled with buttery caramel sauce.",
    price: 5.49,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
    isVegetarian: true,
    isAvailable: true,
    prepTime: "5 min",
    rating: 4.7,
    spiceLevel: "Mild",
    calories: 210,
  },
];

const initialOrders = [
  {
    orderNumber: "ORD-8921",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@example.com",
    customerPhone: "+1 (555) 234-5678",
    deliveryAddress: "742 Evergreen Terrace, Apt 4B, Springfield",
    items: [
      {
        id: 1,
        name: "Wood-Fired Margherita Pizza",
        price: 12.99,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: 9,
        name: "Fresh Mint & Lime Mojito",
        price: 4.99,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 35.96,
    tax: 2.88,
    deliveryFee: 2.99,
    totalAmount: 41.83,
    paymentMethod: "Credit Card",
    orderStatus: "Preparing",
    specialInstructions: "Please ring doorbell twice. Extra napkins please!",
  },
  {
    orderNumber: "ORD-8920",
    customerName: "Alex Johnson",
    customerEmail: "alex.j@example.com",
    customerPhone: "+1 (555) 876-5432",
    deliveryAddress: "124 Baker Street, Suite 12, West End",
    items: [
      {
        id: 2,
        name: "Classic Gourmet Cheeseburger",
        price: 10.49,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: 7,
        name: "Molten Chocolate Lava Cake",
        price: 6.99,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
      },
    ],
    subtotal: 17.48,
    tax: 1.4,
    deliveryFee: 2.99,
    totalAmount: 21.87,
    paymentMethod: "Cash on Delivery",
    orderStatus: "Out for Delivery",
    specialInstructions: "Leave near front porch.",
  },
];

const syncAndSeedDatabase = async () => {
  await testConnection();
  await db.sync({ alter: true });

  const foodCount = await FoodItem.count();
  if (foodCount === 0) {
    console.log("[Database] Seeding initial food items...");
    await FoodItem.bulkCreate(initialFoodItems);
    console.log(`[Database] Seeded ${initialFoodItems.length} food items.`);
  }

  const orderCount = await Order.count();
  if (orderCount === 0) {
    console.log("[Database] Seeding sample customer orders...");
    await Order.bulkCreate(initialOrders);
    console.log(`[Database] Seeded ${initialOrders.length} sample orders.`);
  }
};

module.exports = {
  db,
  FoodItem,
  Order,
  syncAndSeedDatabase,
};
