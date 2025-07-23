// Mock data for testimonials page
export const testimonialsData = {
  // Creator testimonials for carousel
  creators: [
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face",
      niche: "Lifestyle & Fashion",
      followers: "125K",
      quote: "Influbazzar completely transformed my creator journey. From ₹5K to ₹45K monthly earnings in just 6 months!",
      earnings_total: "2,40,000",
      campaign_count: 28,
      avg_engagement: 8.4,
      location: "Mumbai",
      story_long: "My journey with Influbazzar started when I was struggling to monetize my fashion content. I had decent followers but brands weren't approaching me directly. Within the first month of joining, I received 5 campaign offers. The platform's transparent pricing model helped me understand my worth. Now I'm earning consistently and have built long-term partnerships with premium brands.",
      roi_metrics: {
        before_joining: 5000,
        current_monthly: 45000,
        total_campaigns: 28,
        avg_cpm: 180,
        follower_growth: "+32%"
      }
    },
    {
      id: 2,
      name: "Arjun Patel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      niche: "Tech & Gaming",
      followers: "89K",
      quote: "The campaign management tools are incredible. I can track everything from deliverables to payments in one place.",
      earnings_total: "1,85,000",
      campaign_count: 22,
      avg_engagement: 12.1,
      location: "Bangalore",
      story_long: "As a tech content creator, finding relevant brand partnerships was always challenging. Influbazzar's algorithm perfectly matches me with tech brands looking for authentic reviews. The automated contract management and milestone tracking have saved me hours every week. The payment protection gives me confidence to focus on creating quality content.",
      roi_metrics: {
        before_joining: 8000,
        current_monthly: 38000,
        total_campaigns: 22,
        avg_cpm: 205,
        follower_growth: "+28%"
      }
    },
    {
      id: 3,
      name: "Meera Krishnan",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      niche: "Food & Travel",
      followers: "156K",
      quote: "From local food blogger to partnering with international hotel chains - Influbazzar opened doors I never imagined!",
      earnings_total: "3,20,000",
      campaign_count: 35,
      avg_engagement: 9.8,
      location: "Chennai",
      story_long: "I started as a local food blogger in Chennai. Influbazzar's global network connected me with international hotel chains and food delivery apps. The platform's analytics helped me understand which content performs best, and I've optimized my strategy accordingly. The community support and monthly creator meetups have been invaluable for learning new trends.",
      roi_metrics: {
        before_joining: 3000,
        current_monthly: 52000,
        total_campaigns: 35,
        avg_cpm: 165,
        follower_growth: "+45%"
      }
    },
    {
      id: 4,
      name: "Rahul Gupta",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      niche: "Fitness & Health",
      followers: "78K",
      quote: "The automated invoicing and tax support features have made my life so much easier. I can focus on fitness, not paperwork!",
      earnings_total: "1,95,000",
      campaign_count: 26,
      avg_engagement: 11.3,
      location: "Delhi",
      story_long: "Managing finances as a fitness influencer was my biggest pain point. Influbazzar's automated invoicing, GST calculations, and tax document generation have simplified everything. The platform also connected me with supplement brands and fitness equipment companies that align with my values. The payment guarantee means I never worry about delayed payments.",
      roi_metrics: {
        before_joining: 12000,
        current_monthly: 42000,
        total_campaigns: 26,
        avg_cpm: 195,
        follower_growth: "+38%"
      }
    },
    {
      id: 5,
      name: "Kavya Reddy",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      niche: "Beauty & Skincare",
      followers: "203K",
      quote: "Influbazzar's brand vetting process ensures I only work with quality brands. My audience trusts my recommendations more now.",
      earnings_total: "4,50,000",
      campaign_count: 42,
      avg_engagement: 7.9,
      location: "Hyderabad",
      story_long: "Quality over quantity has always been my motto. Influbazzar's strict brand vetting process means I only get matched with reputable beauty brands. The detailed campaign briefs and creative guidelines help me create content that truly resonates with my audience. My engagement rates have improved because my followers trust that I only promote products I genuinely believe in.",
      roi_metrics: {
        before_joining: 15000,
        current_monthly: 75000,
        total_campaigns: 42,
        avg_cpm: 220,
        follower_growth: "+52%"
      }
    },
    {
      id: 6,
      name: "Vikram Singh",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      niche: "Photography",
      followers: "112K",
      quote: "The creative freedom Influbazzar brands give me is amazing. They trust my artistic vision and it shows in the results.",
      earnings_total: "2,80,000",
      campaign_count: 18,
      avg_engagement: 15.2,
      location: "Jaipur",
      story_long: "As a photographer, maintaining my artistic integrity while doing brand work was crucial. Influbazzar connected me with brands that value creativity over rigid guidelines. The platform's portfolio showcase feature has helped me attract premium clients who appreciate my aesthetic. The higher engagement rates I achieve have led to long-term partnerships and repeat collaborations.",
      roi_metrics: {
        before_joining: 18000,
        current_monthly: 55000,
        total_campaigns: 18,
        avg_cpm: 285,
        follower_growth: "+29%"
      }
    }
  ],

  // Brand testimonials
  brands: [
    {
      id: 1,
      brand_name: "Zenith Cosmetics",
      contact_person: "Srinivas V.",
      designation: "Head of Growth",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      quote: "Influbazzar delivered 312% ROI on our latest campaign. The creator quality and campaign management tools are exceptional.",
      campaign_details: {
        duration: "3 months",
        creators_engaged: 45,
        total_reach: "2.8M",
        engagement_rate: "8.4%",
        conversion_rate: "3.2%",
        roi_percentage: 312,
        total_spend: "₹8.5L",
        revenue_generated: "₹26.4L"
      },
      roi_history: [
        { week: 1, roi: 45, spend: 85000, revenue: 123000 },
        { week: 2, roi: 89, spend: 85000, revenue: 160000 },
        { week: 3, roi: 134, spend: 85000, revenue: 199000 },
        { week: 4, roi: 178, spend: 85000, revenue: 236000 },
        { week: 5, roi: 223, spend: 85000, revenue: 275000 },
        { week: 6, roi: 267, spend: 85000, revenue: 312000 },
        { week: 7, roi: 289, spend: 85000, revenue: 331000 },
        { week: 8, roi: 312, spend: 85000, revenue: 350000 }
      ]
    },
    {
      id: 2,
      brand_name: "FitLife Nutrition",
      contact_person: "Anjali Mehta",
      designation: "Marketing Director",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      quote: "The platform's creator matching algorithm is incredible. We found fitness influencers who perfectly aligned with our brand values.",
      campaign_details: {
        duration: "2 months",
        creators_engaged: 28,
        total_reach: "1.9M",
        engagement_rate: "11.2%",
        conversion_rate: "4.1%",
        roi_percentage: 245,
        total_spend: "₹6.2L",
        revenue_generated: "₹15.2L"
      }
    }
  ],

  // Agency testimonials
  agencies: [
    {
      id: 1,
      agency_name: "Yoshitha & Co. Digital",
      contact_person: "Yoshitha Reddy",
      designation: "Founder & CEO",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      team_photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      quote: "Influbazzar's agency tools helped us scale from managing 20 creators to 150+ in just 6 months. The automation is a game-changer.",
      achievements: [
        "Onboarded 100+ creators in 30 days",
        "Reduced deliverable turnaround by 40%",
        "Managed ₹1.2 Cr of payouts error-free",
        "Real-time SLA tracker & audit logs"
      ],
      metrics: {
        creators_managed: 150,
        campaigns_executed: 89,
        client_satisfaction: "98%",
        revenue_growth: "+340%"
      }
    },
    {
      id: 2,
      agency_name: "CreativeHub Agency",
      contact_person: "Rajesh Kumar",
      designation: "Operations Head",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      team_photo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
      quote: "The white-label solution allowed us to offer influencer marketing to our clients seamlessly. Revenue increased by 280%.",
      achievements: [
        "White-label integration in 2 weeks",
        "280% revenue growth in 8 months",
        "Automated reporting for 50+ clients",
        "99.8% payment accuracy rate"
      ],
      metrics: {
        creators_managed: 89,
        campaigns_executed: 156,
        client_satisfaction: "96%",
        revenue_growth: "+280%"
      }
    }
  ],

  // Platform-wide KPIs
  platform_stats: {
    total_creator_earnings: "82,40,00,000",
    campaigns_launched: 12400,
    average_brand_roi: "4.6×",
    agency_delivery_improvement: "40%",
    creators_active: "8500+",
    brands_served: "1200+",
    agencies_partnered: "150+"
  },

  // Quick testimonials for wall of love
  quick_testimonials: [
    {
      id: 1,
      name: "Sneha",
      handle: "@sneha_travels",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Best platform for creators! Genuine brands and timely payments."
    },
    {
      id: 2,
      name: "Dev",
      handle: "@techdev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Finally, a platform that understands creator needs. Love the analytics!"
    },
    {
      id: 3,
      name: "Riya",
      handle: "@riya_makeup",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Tripled my income in 4 months. The brand matching is spot-on!"
    },
    {
      id: 4,
      name: "Aman",
      handle: "@aman_fitness",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "No more chasing payments! Everything is automated and transparent."
    },
    {
      id: 5,
      name: "Lakshmi",
      handle: "@lakshmi_food",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Connected with my dream brands through Influbazzar. Amazing!"
    },
    {
      id: 6,
      name: "Karthik",
      handle: "@karthik_moto",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "The creative freedom and fair pricing make this platform special."
    },
    {
      id: 7,
      name: "Pooja",
      handle: "@pooja_fashion",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "From zero to hero! Influbazzar changed my creator journey completely."
    },
    {
      id: 8,
      name: "Rohit",
      handle: "@rohit_gaming",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Gaming brand partnerships made easy. Love the campaign tracking!"
    },
    {
      id: 9,
      name: "Divya",
      handle: "@divya_dance",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Professional platform with genuine opportunities. Highly recommend!"
    },
    {
      id: 10,
      name: "Aryan",
      handle: "@aryan_vlogs",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      text: "Best decision for my creator career. Quality brands, fair rates!"
    }
  ]
};

// Case studies data for CaseStudySection
export const caseStudies = [
  {
    id: 1,
    title: "Beauty Brand Achieves 312% ROI",
    brand: "Zenith Cosmetics",
    campaignType: "Product Launch",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop",
    reach: "2.8M",
    roi: "312%",
    creators: "45",
    engagement: "8.4%",
    results: {
      sales: "₹26.4L",
      brandAwareness: "+89%",
      newCustomers: "12,450"
    }
  },
  {
    id: 2,
    title: "Fitness Brand Scales Nationwide",
    brand: "FitLife Nutrition",
    campaignType: "Brand Awareness",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    reach: "1.9M",
    roi: "245%",
    creators: "28",
    engagement: "11.2%",
    results: {
      sales: "₹15.2L",
      brandAwareness: "+156%",
      newCustomers: "8,920"
    }
  },
  {
    id: 3,
    title: "Tech Startup Goes Viral",
    brand: "InnovateTech",
    campaignType: "Product Demo",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
    reach: "3.2M",
    roi: "428%",
    creators: "32",
    engagement: "15.7%",
    results: {
      sales: "₹18.9L",
      brandAwareness: "+203%",
      newCustomers: "15,600"
    }
  }
];

// Testimonials data for TestimonialsSection
export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "Influbazzar completely transformed my creator journey. From ₹5K to ₹45K monthly earnings in just 6 months! The platform's brand matching is incredible.",
    role: "Fashion Influencer",
    platform: "Instagram",
    followers: "125K"
  },
  {
    id: 2,
    name: "Srinivas V.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "Influbazzar delivered 312% ROI on our latest campaign. The creator quality and campaign management tools are exceptional. Best investment we've made.",
    role: "Head of Growth",
    company: "Zenith Cosmetics",
    campaignsRun: "12"
  },
  {
    id: 3,
    name: "Yoshitha Reddy",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "Influbazzar's agency tools helped us scale from managing 20 creators to 150+ in just 6 months. The automation is a game-changer for our business.",
    role: "Founder & CEO",
    company: "Yoshitha & Co. Digital",
    clientsManaged: "150+"
  },
  {
    id: 4,
    name: "Arjun Patel",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    quote: "The campaign management tools are incredible. I can track everything from deliverables to payments in one place. Finally, a platform built for creators.",
    role: "Tech Reviewer",
    platform: "YouTube",
    followers: "89K"
  },
  {
    id: 5,
    name: "Meera Krishnan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
    rating: 5,
    quote: "From local food blogger to partnering with international hotel chains - Influbazzar opened doors I never imagined! The global network is amazing.",
    role: "Food & Travel Blogger",
    platform: "Instagram & Blog",
    followers: "156K"
  }
];

// Helper function to get random testimonials for wall of love
export const getRandomTestimonials = (count = 10) => {
  const shuffled = [...testimonialsData.quick_testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to simulate API calls (for future backend integration)
export const testimonialsAPI = {
  getCreatorTestimonials: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(testimonialsData.creators), 500);
    });
  },
  
  getBrandTestimonials: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(testimonialsData.brands), 500);
    });
  },
  
  getAgencyTestimonials: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(testimonialsData.agencies), 500);
    });
  },
  
  getPlatformStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(testimonialsData.platform_stats), 500);
    });
  },
  
  getQuickTestimonials: (count = 10) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getRandomTestimonials(count)), 500);
    });
  }
};
