import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  likes: number;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'r1', productId: '1', author: 'Alex Morgan', rating: 5, date: '3 days ago',
    title: 'Exceeded all my expectations!',
    comment: 'The build quality is exceptional. Very happy with my purchase, delivery was super fast too!',
    likes: 12,
  },
  {
    id: 'r2', productId: '1', author: 'David Chen', rating: 5, date: '1 week ago',
    title: 'Sleek, durable, and worth every penny.',
    comment: 'Matches the description perfectly. Premium feel and beautiful packaging.',
    likes: 8,
  },
  {
    id: 'r3', productId: '2', author: 'Sarah Jenkins', rating: 4, date: '2 weeks ago',
    title: 'Great sound quality',
    comment: 'Noise cancellation is amazing. Battery life is as advertised. Would recommend.',
    likes: 5,
  },
  {
    id: 'r4', productId: '9', author: 'Mike Thompson', rating: 5, date: '5 days ago',
    title: 'Best yoga mat ever!',
    comment: 'Non-slip grip is incredible, even during hot yoga. Great thickness too.',
    likes: 7,
  },
  {
    id: 'r5', productId: '11', author: 'Emma Wilson', rating: 5, date: '1 week ago',
    title: 'Must-read for developers',
    comment: 'Clear, concise, and filled with practical examples. Changed how I write code.',
    likes: 15,
  },
  {
    id: 'r6', productId: '13', author: 'Lisa Park', rating: 5, date: '3 days ago',
    title: 'Amazing hydration!',
    comment: 'My skin has never felt so plump and hydrated. A little goes a long way.',
    likes: 9,
  },
];

interface ReviewStore {
  reviews: Review[];
  addReview: (productId: string, author: string, rating: number, comment: string) => Review;
  getReviewsForProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
  likeReview: (reviewId: string) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: SEED_REVIEWS,
      addReview: (productId, author, rating, comment) => {
        const review: Review = {
          id: `rev-${Date.now()}`,
          productId,
          author,
          rating,
          date: 'Just now',
          title: 'Verified Customer Review',
          comment,
          likes: 0,
        };
        set((state) => ({ reviews: [review, ...state.reviews] }));
        return review;
      },
      getReviewsForProduct: (productId) => get().reviews.filter((r) => r.productId === productId),
      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter((r) => r.productId === productId);
        if (productReviews.length === 0) return 0;
        return Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
      },
      likeReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
          ),
        }));
      },
    }),
    {
      name: 'craft-reviews',
    }
  )
);
