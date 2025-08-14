import { getLastSyncStatus, syncFileBlogs } from '../controllers/sync-file-blogs';

let isInitialSyncRunning = false;
let hasCompletedInitialSync = false;

export async function ensureBlogSync(): Promise<void> {
  // Don't run sync if already running or completed
  if (isInitialSyncRunning || hasCompletedInitialSync) {
    return;
  }

  // Only run in server environment
  if (typeof window !== 'undefined') {
    return;
  }

  try {
    isInitialSyncRunning = true;

    // Check if we need to sync
    const lastSyncStatus = await getLastSyncStatus();

    // If no previous sync or last sync was more than 1 hour ago, trigger sync
    const shouldSync = !lastSyncStatus.lastSync ||
      (new Date().getTime() - new Date(lastSyncStatus.lastSync).getTime()) > 60 * 60 * 1000;

    if (shouldSync) {
      console.log('🔄 Starting automatic blog sync on startup...');
      const result = await syncFileBlogs();

      if (result.success) {
        console.log(`✅ Blog sync completed: ${result.postsProcessed} posts processed, ${result.postsCreated} created, ${result.postsUpdated} updated`);
      } else {
        console.warn('⚠️ Blog sync completed with errors:', result.errors);
      }
    } else {
      console.log('📚 Blog sync skipped - recent sync found');
    }

    hasCompletedInitialSync = true;
  } catch (error) {
    console.error('❌ Startup blog sync failed:', error);
  } finally {
    isInitialSyncRunning = false;
  }
}

// Auto-trigger sync when this module is imported in server environment
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Run sync after a short delay to avoid blocking app startup
  setTimeout(ensureBlogSync, 1000);
}
