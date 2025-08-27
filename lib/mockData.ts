export interface MockArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  slug: string;
}

export const mockArticles: MockArticle[] = [
  // Health Articles
  {
    id: "1",
    title: "10 Essential Vitamins for Daily Wellness",
    excerpt: "Discover the key vitamins your body needs every day and how to incorporate them into your diet naturally.",
    category: "health",
    author: "Dr. Sarah Johnson",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "essential-vitamins-wellness"
  },
  {
    id: "2",
    title: "Understanding Blood Pressure: A Complete Guide",
    excerpt: "Learn about blood pressure ranges, risk factors, and natural ways to maintain healthy levels.",
    category: "health",
    author: "Dr. Michael Chen",
    publishedAt: "2024-01-12",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "blood-pressure-complete-guide"
  },
  {
    id: "3",
    title: "Sleep Hygiene: Transform Your Nightly Routine",
    excerpt: "Expert tips and techniques to improve your sleep quality and establish healthy sleep patterns.",
    category: "health",
    author: "Dr. Emily Rodriguez",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "sleep-hygiene-nightly-routine"
  },

  // Fitness Articles
  {
    id: "4",
    title: "30-Day Home Workout Challenge",
    excerpt: "Transform your fitness with this comprehensive home workout plan that requires no equipment.",
    category: "fitness",
    author: "Coach Alex Thompson",
    publishedAt: "2024-01-14",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "30-day-home-workout-challenge"
  },
  {
    id: "5",
    title: "Strength Training for Beginners",
    excerpt: "Start your strength training journey with these fundamental exercises and proper form techniques.",
    category: "fitness",
    author: "Coach Maria Santos",
    publishedAt: "2024-01-11",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "strength-training-beginners"
  },
  {
    id: "6",
    title: "Cardio vs. Strength: Finding Your Balance",
    excerpt: "Learn how to balance cardiovascular and strength training for optimal fitness results.",
    category: "fitness",
    author: "Coach David Wilson",
    publishedAt: "2024-01-08",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "cardio-vs-strength-balance"
  },

  // Nutrition Articles
  {
    id: "7",
    title: "Meal Prep Sunday: Your Weekly Nutrition Game Plan",
    excerpt: "Master the art of meal prepping with these time-saving strategies and delicious recipe ideas.",
    category: "nutrition",
    author: "Nutritionist Lisa Park",
    publishedAt: "2024-01-13",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "meal-prep-sunday-weekly-nutrition"
  },
  {
    id: "8",
    title: "Superfoods: Fact vs. Fiction",
    excerpt: "Separate the truth from marketing hype when it comes to superfoods and their health benefits.",
    category: "nutrition",
    author: "Dr. James Miller",
    publishedAt: "2024-01-09",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "superfoods-fact-vs-fiction"
  },
  {
    id: "9",
    title: "Plant-Based Diet: Getting Started",
    excerpt: "A beginner's guide to transitioning to a plant-based diet with practical tips and meal ideas.",
    category: "nutrition",
    author: "Chef Amanda Green",
    publishedAt: "2024-01-06",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "plant-based-diet-getting-started"
  },

  // Sex & Intimacy Articles
  {
    id: "20",
    title: "Building Intimacy: Communication in Relationships",
    excerpt: "Learn effective communication strategies to strengthen intimacy and connection in your relationships.",
    category: "sex",
    author: "Relationship Counselor Dr. Sarah Williams",
    publishedAt: "2024-01-14",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "building-intimacy-communication-relationships"
  },
  {
    id: "21",
    title: "Sexual Health: A Comprehensive Guide",
    excerpt: "Essential information about sexual health, safety, and wellness for adults of all ages.",
    category: "sex",
    author: "Sexual Health Specialist Dr. Michael Rodriguez",
    publishedAt: "2024-01-11",
    readTime: "10 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "sexual-health-comprehensive-guide"
  },

  // Beauty Articles
  {
    id: "10",
    title: "Skincare Routine for Every Skin Type",
    excerpt: "Build the perfect skincare routine tailored to your specific skin type and concerns.",
    category: "beauty",
    author: "Esthetician Rachel Kim",
    publishedAt: "2024-01-12",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "skincare-routine-every-skin-type"
  },
  {
    id: "11",
    title: "Natural Beauty: DIY Face Masks",
    excerpt: "Create effective face masks at home using natural ingredients from your kitchen.",
    category: "beauty",
    author: "Beauty Expert Sofia Martinez",
    publishedAt: "2024-01-09",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "natural-beauty-diy-face-masks"
  },

  // Fashion Articles
  {
    id: "22",
    title: "Sustainable Fashion: Building a Conscious Wardrobe",
    excerpt: "Discover how to create a sustainable and ethical wardrobe that reflects your personal style.",
    category: "fashion",
    author: "Fashion Stylist Emma Thompson",
    publishedAt: "2024-01-13",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "sustainable-fashion-conscious-wardrobe"
  },
  {
    id: "23",
    title: "Capsule Wardrobe: Less is More",
    excerpt: "Learn how to create a versatile capsule wardrobe with fewer pieces and more outfit combinations.",
    category: "fashion",
    author: "Minimalist Fashion Blogger Jessica Chen",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "capsule-wardrobe-less-is-more"
  },

  // Lifestyle Articles
  {
    id: "12",
    title: "Digital Detox: Reclaiming Your Time",
    excerpt: "Learn how to reduce screen time and create a healthier relationship with technology.",
    category: "lifestyle",
    author: "Wellness Coach Tom Anderson",
    publishedAt: "2024-01-11",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "digital-detox-reclaiming-time"
  },
  {
    id: "13",
    title: "Mindfulness Meditation: A Beginner's Guide",
    excerpt: "Start your mindfulness journey with simple meditation techniques for daily practice.",
    category: "lifestyle",
    author: "Meditation Teacher Grace Lee",
    publishedAt: "2024-01-08",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "mindfulness-meditation-beginners-guide"
  },

  // Travel Articles
  {
    id: "14",
    title: "Budget Travel: See the World for Less",
    excerpt: "Smart strategies to travel more while spending less, from accommodation to transportation.",
    category: "travel",
    author: "Travel Blogger Carlos Mendez",
    publishedAt: "2024-01-10",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "budget-travel-world-for-less"
  },
  {
    id: "15",
    title: "Solo Travel Safety: Essential Tips",
    excerpt: "Stay safe while exploring the world alone with these essential solo travel safety guidelines.",
    category: "travel",
    author: "Adventure Guide Sarah Williams",
    publishedAt: "2024-01-07",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "solo-travel-safety-essential-tips"
  },

  // Decor Articles
  {
    id: "24",
    title: "Home Organization: Declutter Your Space",
    excerpt: "Transform your living space with these practical home organization and decluttering techniques.",
    category: "decor",
    author: "Interior Designer Maria Garcia",
    publishedAt: "2024-01-12",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "home-organization-declutter-space"
  },
  {
    id: "25",
    title: "Minimalist Interior Design Principles",
    excerpt: "Learn the key principles of minimalist interior design to create a calm and functional home.",
    category: "decor",
    author: "Minimalist Designer Alex Johnson",
    publishedAt: "2024-01-09",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "minimalist-interior-design-principles"
  },

  // Parenting Articles
  {
    id: "16",
    title: "Positive Parenting: Building Strong Relationships",
    excerpt: "Learn positive parenting techniques that strengthen your bond with your children.",
    category: "parenting",
    author: "Child Psychologist Dr. Jennifer Brown",
    publishedAt: "2024-01-09",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "positive-parenting-strong-relationships"
  },
  {
    id: "17",
    title: "Screen Time Guidelines for Kids",
    excerpt: "Evidence-based recommendations for managing children's screen time in the digital age.",
    category: "parenting",
    author: "Family Therapist Dr. Robert Davis",
    publishedAt: "2024-01-06",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "screen-time-guidelines-kids"
  },

  // Productivity Articles
  {
    id: "18",
    title: "Time Management: The Pomodoro Technique",
    excerpt: "Master the Pomodoro Technique to boost your productivity and focus throughout the day.",
    category: "productivity",
    author: "Productivity Coach Mark Johnson",
    publishedAt: "2024-01-08",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "time-management-pomodoro-technique"
  },
  {
    id: "19",
    title: "Goal Setting: From Dreams to Reality",
    excerpt: "Transform your dreams into achievable goals with this proven goal-setting framework.",
    category: "productivity",
    author: "Life Coach Anna Rodriguez",
    publishedAt: "2024-01-05",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    slug: "goal-setting-dreams-to-reality"
  }
];

export const getArticlesByCategory = (category: string) => {
  return mockArticles.filter(article => article.category === category);
};

export const getFeaturedArticles = () => {
  return mockArticles.slice(0, 6); // Return first 6 articles as featured
};
