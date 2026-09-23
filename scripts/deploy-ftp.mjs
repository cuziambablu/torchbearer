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

    // Detect target directory: check if specific domain folder exists
    let targetDir = process.env.FTP_DIR;
    if (!targetDir) {
      const rootList = await client.list('/');
      const domainFolder = rootList.find(item => item.name === 'torchbearer.free.nf');
      if (domainFolder) {
        targetDir = '/torchbearer.free.nf/htdocs';
      } else {
        targetDir = '/htdocs';
      }
    }

    console.log(`Targeting remote directory: ${targetDir}`);
    await client.ensureDir(targetDir);
    console.log(`Uploading ${distDir} to ${targetDir}...`);
    await client.uploadFromDir(distDir, targetDir);
    console.log(`✅ Successfully deployed updated build to InfinityFree (${targetDir}) for torchbearer.free.nf!`);
  } catch (err) {
    console.error('❌ FTP Upload Failed:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
