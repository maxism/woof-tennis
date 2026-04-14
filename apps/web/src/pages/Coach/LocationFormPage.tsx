import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createLocation } from '@/api/locations';
import { t } from '@/utils/i18n';

export function LocationFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const save = useMutation({
    mutationFn: () =>
      createLocation({
        name: name.trim(),
        address: address.trim(),
        description: description.trim(),
        website: website.trim(),
      }),
    onSuccess: () => {
      toast.success(t('common', 'save'));
      void qc.invalidateQueries({ queryKey: ['locations', 'mine'] });
      navigate('/coach/locations');
    },
    onError: () => {
      toast.error(t('common', 'retry'));
    },
  });

  return (
    <div>
      <PageHeader
        title={t('location', 'add')}
        right={
          <Button variant="ghost" size="sm" onClick={() => navigate('/coach/locations')}>
            {t('common', 'cancel')}
          </Button>
        }
      />
      <div className="flex flex-col gap-3">
        <Input
          label={t('location', 'name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          autoFocus
        />
        <Input
          label={t('location', 'address')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={500}
        />
        <Input
          label={t('location', 'description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={3000}
        />
        <Input
          label={t('location', 'website')}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          maxLength={500}
        />
        <div className="mt-2 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate('/coach/locations')}
            disabled={save.isPending}
          >
            {t('common', 'cancel')}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => save.mutate()}
            disabled={save.isPending || !name.trim() || !address.trim()}
          >
            {t('location', 'save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
