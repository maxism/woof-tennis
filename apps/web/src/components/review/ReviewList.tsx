import type { Review } from '@wooftennis/shared';
import { ReviewCard } from './ReviewCard';

export function ReviewList({ items }: { items: Review[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((r) => (
        <li key={r.id}>
          <ReviewCard review={r} />
        </li>
      ))}
    </ul>
  );
}
