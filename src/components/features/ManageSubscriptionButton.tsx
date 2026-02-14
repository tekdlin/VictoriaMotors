'use client';

import { Button } from '@/components/ui';
import { CreditCard } from 'lucide-react';
import { useStripePortal } from '@/hooks/api';

export function ManageSubscriptionButton() {
  const portalMutation = useStripePortal();

  const handleClick = async () => {
    try {
      const url = await portalMutation.mutateAsync();
      if (url) window.location.href = url;
    } catch {
      // Error could be shown via toast; for now fail silently or set state
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start"
      onClick={handleClick}
      disabled={portalMutation.isPending}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {portalMutation.isPending ? 'Opening...' : 'Manage Subscription'}
    </Button>
  );
}
