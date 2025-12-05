export interface Chat {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    productId?: string;
    productTitle?: string;
    productImage?: string;
}

export const mockChats: Chat[] = [
    {
        id: '1',
        userId: 'user1',
        userName: 'Jessica M.',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Is the chemistry textbook still available?',
        timestamp: '2025-12-05T10:30:00',
        unread: 2,
        productId: '1',
        productTitle: 'Organic Chemistry Textbook',
        productImage: 'https://picsum.photos/id/24/300/400',
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Daniel R.',
        userAvatar: 'https://i.pravatar.cc/150?img=33',
        lastMessage: 'Can we meet tomorrow to pick it up?',
        timestamp: '2025-12-05T09:15:00',
        unread: 0,
        productId: '2',
        productTitle: 'MacBook Air M2',
        productImage: 'https://picsum.photos/id/0/300/400',
    },
    {
        id: '3',
        userId: 'user3',
        userName: 'Rachel K.',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: 'Would you accept $250 for the headphones?',
        timestamp: '2025-12-04T18:45:00',
        unread: 1,
        productId: '3',
        productTitle: 'Sony WH-1000XM5',
        productImage: 'https://picsum.photos/id/367/300/400',
    },
    {
        id: '4',
        userId: 'user4',
        userName: 'Marcus T.',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        lastMessage: 'Perfect! See you at the library at 3pm',
        timestamp: '2025-12-04T14:20:00',
        unread: 0,
        productId: '4',
        productTitle: 'Patagonia Down Jacket',
        productImage: 'https://picsum.photos/id/835/300/400',
    },
    {
        id: '5',
        userId: 'user5',
        userName: 'Sophie L.',
        userAvatar: 'https://i.pravatar.cc/150?img=45',
        lastMessage: 'Does the desk come with assembly instructions?',
        timestamp: '2025-12-04T11:30:00',
        unread: 0,
        productId: '5',
        productTitle: 'IKEA Standing Desk',
        productImage: 'https://picsum.photos/id/431/300/400',
    },
    {
        id: '6',
        userId: 'user6',
        userName: 'Kevin H.',
        userAvatar: 'https://i.pravatar.cc/150?img=15',
        lastMessage: "I'm interested! Is it in good condition?",
        timestamp: '2025-12-03T20:15:00',
        unread: 3,
        productId: '6',
        productTitle: 'Samsung Galaxy Tab S8',
        productImage: 'https://picsum.photos/id/160/300/400',
    },
    {
        id: '7',
        userId: 'user7',
        userName: 'Emma W.',
        userAvatar: 'https://i.pravatar.cc/150?img=47',
        lastMessage: 'Thanks for the quick response!',
        timestamp: '2025-12-03T16:00:00',
        unread: 0,
        productId: '7',
        productTitle: 'Vintage Leather Backpack',
        productImage: 'https://picsum.photos/id/452/300/400',
    },
    {
        id: '8',
        userId: 'user8',
        userName: 'Tyler B.',
        userAvatar: 'https://i.pravatar.cc/150?img=52',
        lastMessage: 'Can I test ride the bike first?',
        timestamp: '2025-12-03T13:45:00',
        unread: 0,
        productId: '8',
        productTitle: 'Road Bike - Specialized Allez',
        productImage: 'https://picsum.photos/id/146/300/400',
    },
    {
        id: '9',
        userId: 'user9',
        userName: 'Alex P.',
        userAvatar: 'https://i.pravatar.cc/150?img=68',
        lastMessage: 'Hi! Is this still available?',
        timestamp: '2025-12-02T19:30:00',
        unread: 1,
    },
    {
        id: '10',
        userId: 'user10',
        userName: 'Sarah K.',
        userAvatar: 'https://i.pravatar.cc/150?img=20',
        lastMessage: 'Great! I will take it',
        timestamp: '2025-12-02T15:20:00',
        unread: 0,
    },
];

export default mockChats;
