
export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'past';
  thumbnail: string;
  description: string;
  members: Member[];
  comments?: {
    id: string;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
  }[];
  privacy: 'public' | 'private';
}

export interface Member {
  user_id: string;
  username: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  description: string;
  category: 'activity' | 'transportation' | 'accommodation' | 'food';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  paidBy: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'essentials' | 'clothing' | 'toiletries' | 'electronics' | 'documents';
}

// Trips mock data
export const trips: Trip[] = [
  {
    id: '1',
    name: 'Summer in Paris',
    destination: 'Paris, France',
    startDate: '2025-06-15',
    endDate: '2025-06-25',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    description: 'A romantic getaway to the city of lights. Explore the Eiffel Tower, Louvre Museum, and enjoy French cuisine.',
    members: [
      { id: 'm1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', role: 'admin' },
      { id: 'm2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=5', role: 'member' },
      { id: 'm3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=8', role: 'member' }
    ],
    privacy: 'public'
  },
  {
    id: '2',
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2025-08-10',
    endDate: '2025-08-20',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    description: 'Discover the blend of traditional and modern Japan in Tokyo. Visit temples, technology districts, and try authentic cuisine.',
    members: [
      { id: 'm1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', role: 'member' },
      { id: 'm4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=4', role: 'admin' }
    ],
    privacy: 'private'
  },
  {
    id: '3',
    name: 'New York Weekend',
    destination: 'New York, USA',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    status: 'past',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    description: 'Quick weekend trip to the Big Apple. Explored Central Park, Times Square, and enjoyed Broadway shows.',
    members: [
      { id: 'm1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', role: 'admin' },
      { id: 'm2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=5', role: 'member' }
    ],
    privacy: 'private'
  }
];

// Itinerary mock data (for trip id: 1)
export const itineraryItems: ItineraryItem[] = [
  {
    id: 'i1',
    day: 1,
    time: '09:00',
    title: 'Arrival at Charles de Gaulle Airport',
    location: 'CDG Airport',
    description: 'Land at CDG and take a taxi to the hotel',
    category: 'transportation'
  },
  {
    id: 'i2',
    day: 1,
    time: '13:00',
    title: 'Lunch at Le Petit Café',
    location: 'Le Petit Café, Montmartre',
    description: 'Traditional French cuisine in a cozy café',
    category: 'food'
  },
  {
    id: 'i3',
    day: 1,
    time: '15:00',
    title: 'Explore Montmartre',
    location: 'Montmartre',
    description: 'Walk around the artistic neighborhood of Montmartre',
    category: 'activity'
  },
  {
    id: 'i4',
    day: 2,
    time: '10:00',
    title: 'Visit the Eiffel Tower',
    location: 'Champ de Mars',
    description: 'Go up to the top of the Eiffel Tower for a panoramic view of Paris',
    category: 'activity'
  },
  {
    id: 'i5',
    day: 2,
    time: '14:00',
    title: 'Louvre Museum',
    location: 'Rue de Rivoli',
    description: 'Explore one of the world\'s largest art museums',
    category: 'activity'
  }
];

// Comments mock data (for trip id: 1)
export const comments: Comment[] = [
  {
    id: 'c1',
    userId: 'm1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    text: 'I\'m so excited for this trip! I\'ve always wanted to visit Paris.',
    timestamp: '2025-05-10T14:30:00Z'
  },
  {
    id: 'c2',
    userId: 'm2',
    userName: 'Jane Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    text: 'I found a great restaurant near our hotel. We should check it out on the first night.',
    timestamp: '2025-05-11T09:45:00Z'
  },
  {
    id: 'c3',
    userId: 'm3',
    userName: 'Mike Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    text: 'Has anyone booked tickets for the Louvre yet?',
    timestamp: '2025-05-12T16:20:00Z'
  }
];

// Expenses mock data (for trip id: 1)
export const expenses: Expense[] = [
  {
    id: 'e1',
    category: 'Accommodation',
    amount: 1200,
    description: 'Hotel booking for 10 nights',
    paidBy: 'John Doe'
  },
  {
    id: 'e2',
    category: 'Transportation',
    amount: 800,
    description: 'Flight tickets',
    paidBy: 'Jane Smith'
  },
  {
    id: 'e3',
    category: 'Food',
    amount: 300,
    description: 'Estimated food expenses',
    paidBy: 'Mike Johnson'
  },
  {
    id: 'e4',
    category: 'Activities',
    amount: 250,
    description: 'Museum tickets and tours',
    paidBy: 'John Doe'
  },
  {
    id: 'e5',
    category: 'Other',
    amount: 150,
    description: 'Souvenirs and miscellaneous',
    paidBy: 'Jane Smith'
  }
];

// Checklist mock data (for trip id: 1)
export const checklistItems: ChecklistItem[] = [
  { id: 'cl1', text: 'Passport', completed: true, category: 'documents' },
  { id: 'cl2', text: 'Travel insurance', completed: true, category: 'documents' },
  { id: 'cl3', text: 'Flight tickets', completed: false, category: 'documents' },
  { id: 'cl4', text: 'Hotel reservation', completed: true, category: 'documents' },
  { id: 'cl5', text: 'Power adapter', completed: false, category: 'electronics' },
  { id: 'cl6', text: 'Camera', completed: false, category: 'electronics' },
  { id: 'cl7', text: 'Phone charger', completed: true, category: 'electronics' },
  { id: 'cl8', text: 'Comfortable shoes', completed: false, category: 'clothing' },
  { id: 'cl9', text: 'Weather appropriate clothing', completed: false, category: 'clothing' },
  { id: 'cl10', text: 'Toiletries', completed: false, category: 'toiletries' },
  { id: 'cl11', text: 'Medication', completed: false, category: 'essentials' },
  { id: 'cl12', text: 'Credit cards', completed: false, category: 'essentials' }
];
