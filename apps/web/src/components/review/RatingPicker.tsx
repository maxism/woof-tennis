import { t } from '@/utils/i18n';

export type RatingVisual = 'poop' | 'star';

export function RatingPicker({
  value,
  style,
  onChangeValue,
  onChangeStyle,
}: {
  value: number | null;
  style: RatingVisual;
  onChangeValue: (v: number) => void;
  onChangeStyle: (s: RatingVisual) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm text-tg-hint">{t('review', 'ratingStyle')}</p>
        <div className="flex gap-2" role="group" aria-label={t('review', 'ratingStyle')}>
          <button
            type="button"
            aria-pressed={style === 'poop'}
            className={`flex-1 rounded-xl border py-3 text-lg ${
              style === 'poop'
                ? 'border-woof-accent bg-woof-accent/10'
                : 'border-woof-border'
            }`}
            onClick={() => onChangeStyle('poop')}
          >
            {t('review', 'ratingStylePoop')} 💩
          </button>
          <button
            type="button"
            aria-pressed={style === 'star'}
            className={`flex-1 rounded-xl border py-3 text-lg ${
              style === 'star'
                ? 'border-woof-accent bg-woof-accent/10'
                : 'border-woof-border'
            }`}
            onClick={() => onChangeStyle('star')}
          >
            {t('review', 'ratingStyleStar')} ⭐
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-tg-hint">{t('review', 'ratingValue')}</p>
        <div className="flex gap-2" role="radiogroup" aria-label={t('review', 'ratingValue')}>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              className={`flex-1 rounded-xl border py-3 text-lg font-semibold ${
                value === n
                  ? 'border-woof-accent bg-woof-accent text-white'
                  : 'border-woof-border text-tg-text'
              }`}
              onClick={() => onChangeValue(n)}
            >
              {style === 'poop' ? (n === 1 ? '💩' : n === 2 ? '💩💩' : '💩💩💩') : '★'.repeat(n)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
