import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { t } from '@/utils/i18n';

export function InviteLinkShare({ inviteLink }: { inviteLink: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success(t('playSession', 'share'));
    } catch {
      toast.error(t('common', 'retry'));
    }
  }

  function shareTg() {
    window.Telegram?.WebApp?.openTelegramLink?.(
      `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(t('playSession', 'inviteText'))}`,
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="break-all rounded-xl border border-woof-border bg-tg-secondary-bg/40 px-3 py-2 text-xs text-tg-hint">
        {inviteLink}
      </p>
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1" onClick={copy}>
          {t('playSession', 'share')}
        </Button>
        {window.Telegram?.WebApp?.openTelegramLink ? (
          <Button variant="secondary" className="flex-1" onClick={shareTg}>
            Telegram
          </Button>
        ) : null}
      </div>
    </div>
  );
}
