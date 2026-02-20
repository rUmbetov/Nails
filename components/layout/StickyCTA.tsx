'use client';

import { Button } from '@/components/ui/button';
import { BookingDialog } from '@/components/booking/BookingDialog';

export function StickyCTA() {
  return (
    <div className="bg-background/75 supports-[backdrop-filter]:bg-background/50 fixed inset-x-0 bottom-0 z-50 border-t p-3 backdrop-blur md:hidden">
      <BookingDialog
        trigger={
          <Button size="lg" className="w-full rounded-2xl">
            Записаться
          </Button>
        }
      />
    </div>
  );
}
