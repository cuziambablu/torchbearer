/**
 * Portable FTP Deployment Script for InfinityFree
 * Used by local CLI and GitHub Actions 24/7 Cloud Workers
 */

import ftp from 'basic-ftp';
import path from 'path';

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const distDir = path.resolve(process.cwd(), 'dist');

  if (!host || !user || !password) {
    console.warn('⚠️ FTP Deployment skipped: Missing FTP_HOST, FTP_USER, or FTP_PASSWORD environment variables.');
    return;
  }

  try {
    console.log(`Connecting to InfinityFree FTP (${host})...`);
    await client.access({
      host,
      user,
      password,
      secure: false
    });

    console.log(`Uploading ${distDir} to /htdocs...`);
    await client.uploadFromDir(distDir, '/htdocs');
    console.log('✅ Successfully deployed updated build to InfinityFree!');
  } catch (err) {
    console.error('❌ FTP Upload Failed:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
