'use client';

import { useSyncExternalStore, useTransition } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

/**
 * Minimal toast system for the admin panel.
 *
 * Row actions (delete, publish toggle) run as Server Actions inside a
 * transition. Previously a failed action was swallowed by `.catch(() => {})`,
 * so a delete that the database rejected looked like nothing happened. This
 * surfaces those failures: `useRowAction` runs the action and, on rejection,
 * shows a toast with the error's own message.
 *
 * State lives in a module-level store (no context provider to thread through
 * every admin page); <Toaster /> is mounted once in the panel layout and
 * subscribes via useSyncExternalStore.
 */

type ToastKind = 'error' | 'success';
type Toast = { id: number; message: string; kind: ToastKind };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
/** Stable snapshot references so useSyncExternalStore doesn't loop. */
function getSnapshot() {
  return toasts;
}
const EMPTY: Toast[] = [];
function getServerSnapshot() {
  return EMPTY;
}

/** Show a toast. Auto-dismisses after 5s; errors linger a little longer. */
export function pushToast(message: string, kind: ToastKind = 'error') {
  const id = nextId++;
  toasts = [...toasts, { id, message, kind }];
  emit();
  setTimeout(
    () => {
      toasts = toasts.filter((t) => t.id !== id);
      emit();
    },
    kind === 'error' ? 6000 : 4000,
  );
}

/**
 * Run a Server Action from a row control with a pending flag and automatic
 * error surfacing. Replaces the old `startTransition(() => action().catch(()=>{}))`
 * pattern — a rejected action now raises a toast instead of failing silently.
 */
export function useRowAction() {
  const [pending, startTransition] = useTransition();
  const run = (action: () => Promise<unknown>) =>
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        pushToast(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
    });
  return { pending, run };
}

/** Mounted once in the admin panel layout; renders the active toasts. */
export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13.5px] font-medium shadow-card',
            t.kind === 'error'
              ? 'border-[#f3c2c2] bg-[#fdecec] text-[#a3282a]'
              : 'border-[#bfe6cd] bg-[#e8f5ee] text-[#1b6e3d]',
          )}
        >
          <Icon name={t.kind === 'error' ? 'close' : 'check'} size={16} className="mt-0.5 flex-none" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
