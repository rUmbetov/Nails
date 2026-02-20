import 'server-only';
import type { Viewer } from '@/types/viewer';
import { getViewerFromSession } from './session';

export async function getViewer(): Promise<Viewer | null> {
  return getViewerFromSession();
}
