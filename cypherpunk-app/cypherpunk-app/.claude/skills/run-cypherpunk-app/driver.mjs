#!/usr/bin/env node
// Driver for the CYPHERPUNK App (Next.js static export). Builds the app,
// serves `out/` on a plain HTTP server (no `next start` — this is a static
// export), and drives it with Playwright: screenshot, exercise the waitlist
// form, walk the admin passphrase -> GitHub-token gate.
//
// Usage (from the app root, i.e. two levels up from this file):
//   node .claude/skills/run-cypherpunk-app/driver.mjs <command> [args]
//
// Commands:
//   build                          next build (static export into out/)
//   serve [port]                   serve out/ (default port 4173), prints PID
//   stop [port]                    kill the server started by `serve`
//   shot <path> <outfile>          screenshot a served path, e.g. /admin/
//   waitlist <email> <outfile>     fill+submit the waitlist form, screenshot
//   admin-login <passphrase> <outfile>   type passphrase, click Enter, screenshot
//   all                            build -> serve -> shot public+admin -> stop
//
// Requires `npm install` once inside this skill directory (installs
// Playwright + its own browser). If PLAYWRIGHT_BROWSERS_PATH is already set
// to a shared Chromium install (this sandbox has one at /opt/pw-browsers),
// export it before `npm install` to skip re-downloading Chromium.

import { chromium } from 'playwright';
import { createServer } from 'http';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '../../..'); // .claude/skills/run-cypherpunk-app -> app root
const OUT_DIR = path.join(APP_ROOT, 'out');
const PID_FILE = (port) => path.join(__dirname, `.server-${port}.pid`);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain',
};

function cmdBuild() {
  console.log('[build] next build (static export) in', APP_ROOT);
  execSync('npm run build', { cwd: APP_ROOT, stdio: 'inherit' });
}

function cmdServe(port = 4173) {
  if (!fs.existsSync(OUT_DIR)) {
    console.error('out/ does not exist — run `build` first.');
    process.exit(1);
  }
  const child = spawn(process.execPath, ['-e', `
    const {createServer} = require('http');
    const fs = require('fs');
    const path = require('path');
    const root = ${JSON.stringify(OUT_DIR)};
    const mime = ${JSON.stringify(MIME)};
    createServer((req,res)=>{
      let p = req.url.split('?')[0];
      if (p==='/') p='/index.html';
      let fp = path.join(root, p);
      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp,'index.html');
      if (!fs.existsSync(fp) && fs.existsSync(fp+'.html')) fp = fp+'.html';
      if (!fs.existsSync(fp)) { res.writeHead(404); res.end('not found: '+p); return; }
      const ext = path.extname(fp);
      res.writeHead(200, {'Content-Type': mime[ext]||'application/octet-stream'});
      fs.createReadStream(fp).pipe(res);
    }).listen(${port}, ()=>console.log('serving on ${port}'));
  `], { detached: true, stdio: 'ignore' });
  child.unref();
  fs.writeFileSync(PID_FILE(port), String(child.pid));
  console.log(`[serve] pid ${child.pid} on http://localhost:${port}`);
}

function cmdStop(port = 4173) {
  const pf = PID_FILE(port);
  if (!fs.existsSync(pf)) { console.log('[stop] no pid file for port', port); return; }
  const pid = parseInt(fs.readFileSync(pf, 'utf8'), 10);
  try { process.kill(pid); console.log('[stop] killed', pid); } catch (e) { console.log('[stop]', e.message); }
  fs.unlinkSync(pf);
}

// This sandbox pins a shared Chromium at /opt/pw-browsers/chromium that may
// not match this package's expected revision — launch against it directly
// instead of letting Playwright download its own (the CDN is blocked by
// this environment's egress allowlist). Elsewhere, unset PW_CHROMIUM_PATH
// (or don't set it) to let Playwright use its own managed browser normally.
const PW_CHROMIUM_PATH = process.env.PW_CHROMIUM_PATH || '/opt/pw-browsers/chromium';

async function withBrowser(fn, viewport = { width: 1280, height: 900 }) {
  const launchOpts = { headless: true };
  if (fs.existsSync(PW_CHROMIUM_PATH)) launchOpts.executablePath = PW_CHROMIUM_PATH;
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({ viewport });
  try { await fn(page); } finally { await browser.close(); }
}

async function cmdShot(urlPath, outfile, port = 4173, viewport) {
  await withBrowser(async (page) => {
    await page.goto(`http://localhost:${port}${urlPath}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outfile, fullPage: true });
    console.log(`[shot] ${urlPath} -> ${outfile} (title: ${await page.title()})`);
  }, viewport);
}

async function cmdWaitlist(email, outfile, port = 4173) {
  await withBrowser(async (page) => {
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    await page.fill('#waitlist-email', email);
    await page.click('button:has-text("Join waitlist")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: outfile, fullPage: true });
    console.log(`[waitlist] submitted ${email}, screenshot -> ${outfile}`);
  });
}

async function cmdAdminLogin(passphrase, outfile, port = 4173) {
  await withBrowser(async (page) => {
    await page.goto(`http://localhost:${port}/admin/`, { waitUntil: 'networkidle' });
    await page.fill('input[type="password"], input', passphrase);
    await page.click('text=Enter');
    await page.waitForTimeout(500);
    await page.screenshot({ path: outfile, fullPage: true });
    const bodyHasError = await page.locator('text=Incorrect passphrase').count();
    console.log(`[admin-login] ${bodyHasError ? 'REJECTED' : 'ACCEPTED'} -> ${outfile}`);
  });
}

async function cmdAll() {
  cmdBuild();
  cmdServe(4173);
  await new Promise((r) => setTimeout(r, 800));
  await cmdShot('/', '/tmp/cypherpunk-public.png');
  await cmdShot('/admin/', '/tmp/cypherpunk-admin-gate.png');
  cmdStop(4173);
}

const [, , cmd, ...args] = process.argv;
switch (cmd) {
  case 'build': cmdBuild(); break;
  case 'serve': cmdServe(args[0] ? Number(args[0]) : undefined); break;
  case 'stop': cmdStop(args[0] ? Number(args[0]) : undefined); break;
  case 'shot': {
    // shot <path> <outfile> [port] [widthxheight]
    const port = args[2] ? Number(args[2]) : undefined;
    let viewport;
    if (args[3]) {
      const [w, h] = args[3].split('x').map(Number);
      viewport = { width: w, height: h || 900 };
    }
    await cmdShot(args[0], args[1], port, viewport);
    break;
  }
  case 'waitlist': await cmdWaitlist(args[0], args[1], args[2] ? Number(args[2]) : undefined); break;
  case 'admin-login': await cmdAdminLogin(args[0], args[1], args[2] ? Number(args[2]) : undefined); break;
  case 'all': await cmdAll(); break;
  default:
    console.error('Usage: driver.mjs <build|serve|stop|shot|waitlist|admin-login|all> [args]');
    process.exit(1);
}
