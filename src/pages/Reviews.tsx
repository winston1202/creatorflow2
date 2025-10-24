import { useState, useEffect } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockAPI } from '@/services/mockAPI';
import { Review } from '@/services/storageManager';
import { Star, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await mockAPI.getReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await mockAPI.submitReview({
        username: user?.username || 'Anonymous',
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        verified: true,
      });

      toast.success('Thank you for your review!');
      setShowForm(false);
      setComment('');
      setRating(5);
      loadReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0
      ? ((reviews.filter(r => r.rating === stars).length / reviews.length) * 100).toFixed(0)
      : '0',
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reviews & Feedback</h1>
          <p className="text-muted-foreground">See what other creators are saying</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {showForm ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Your Rating</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with CreatorFlow..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Share Your Experience</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help other creators by sharing your thoughts
                  </p>
                  <Button onClick={() => setShowForm(true)}>Write a Review</Button>
                </div>
              </Card>
            )}

            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{review.username}</p>
                      {review.verified && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
              <div className="text-center mb-6">
                <p className="text-5xl font-bold mb-2">{avgRating}</p>
                <div className="flex justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(parseFloat(avgRating))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {ratingCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{stars}★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Reviews</span>
                  <span className="font-medium">{reviews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified Users</span>
                  <span className="font-medium">
                    {reviews.filter(r => r.verified).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">5-Star Reviews</span>
                  <span className="font-medium">
                    {reviews.filter(r => r.rating === 5).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
