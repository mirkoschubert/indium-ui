#!/usr/bin/env node

/**
 * Release Script for Indium UI
 *
 * Automates the release process:
 * 1. Reads CHANGELOG.md and extracts latest version and release notes
 * 2. Updates package.json with the new version
 * 3. Creates git commit and tag
 * 4. Pushes to GitHub
 * 5. Creates GitHub Release with changelog notes
 * 6. Publishes to npm
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`✗ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

function warn(message) {
  log(`⚠ ${message}`, 'yellow');
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (err) {
    if (!options.ignoreError) {
      error(`Command failed: ${command}\n${err.message}`);
    }
    return null;
  }
}

/**
 * Extract version and release notes from CHANGELOG.md
 */
function parseChangelog() {
  const changelogPath = join(rootDir, 'CHANGELOG.md');

  try {
    const changelog = readFileSync(changelogPath, 'utf-8');

    // Match first version header: ## [X.Y.Z] - YYYY-MM-DD
    const versionMatch = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m);
    if (!versionMatch) {
      error('Could not find version in CHANGELOG.md. Expected format: ## [X.Y.Z] - YYYY-MM-DD');
    }

    const version = versionMatch[1];

    // Extract content between first and second ## headers
    const lines = changelog.split('\n');
    const firstHeaderIndex = lines.findIndex(line => line.startsWith('## ['));
    const secondHeaderIndex = lines.findIndex((line, i) =>
      i > firstHeaderIndex && line.startsWith('## ')
    );

    const notesLines = secondHeaderIndex > 0
      ? lines.slice(firstHeaderIndex + 1, secondHeaderIndex)
      : lines.slice(firstHeaderIndex + 1);

    const notes = notesLines.join('\n').trim();

    if (!notes) {
      error('No release notes found in CHANGELOG.md');
    }

    return { version, notes };
  } catch (err) {
    error(`Failed to read CHANGELOG.md: ${err.message}`);
  }
}

/**
 * Update package.json version
 */
function updatePackageVersion(version) {
  const packagePath = join(rootDir, 'package.json');

  try {
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    const oldVersion = pkg.version;

    if (oldVersion === version) {
      warn(`package.json already at version ${version}`);
      return false;
    }

    pkg.version = version;
    writeFileSync(packagePath, JSON.stringify(pkg, null, '\t') + '\n');

    success(`Updated package.json: ${oldVersion} → ${version}`);
    return true;
  } catch (err) {
    error(`Failed to update package.json: ${err.message}`);
  }
}

/**
 * Check if gh CLI is installed
 */
function checkGhCli() {
  const result = exec('gh --version', { silent: true, ignoreError: true });
  if (!result) {
    error('GitHub CLI (gh) is not installed. Install it from https://cli.github.com/');
  }
}

/**
 * Check if there are uncommitted changes
 */
function checkGitStatus() {
  const status = exec('git status --porcelain', { silent: true });
  if (status && status.trim()) {
    warn('You have uncommitted changes:');
    console.log(status);
    error('Please commit or stash your changes before releasing');
  }
}

/**
 * Main release process
 */
async function release() {
  log('\n🚀 Starting release process...\n', 'cyan');

  // 1. Check prerequisites
  info('Checking prerequisites...');
  checkGhCli();
  checkGitStatus();
  success('Prerequisites checked');

  // 2. Parse CHANGELOG
  info('Reading CHANGELOG.md...');
  const { version, notes } = parseChangelog();
  success(`Found version: ${version}`);

  // 3. Update package.json
  info('Updating package.json...');
  const updated = updatePackageVersion(version);

  // 4. Git commit and tag
  if (updated) {
    info('Creating git commit and tag...');
    exec(`git add package.json`);
    exec(`git commit -m "chore: release v${version}"`);
    success('Created commit');
  }

  exec(`git tag -a v${version} -m "Release v${version}"`);
  success(`Created tag v${version}`);

  // 5. Push to GitHub
  info('Pushing to GitHub...');
  exec('git push');
  exec('git push --tags');
  success('Pushed to GitHub');

  // 6. Create GitHub Release
  info('Creating GitHub Release...');
  const notesFile = join(rootDir, '.release-notes-temp.md');
  writeFileSync(notesFile, notes);

  exec(`gh release create v${version} --title "v${version}" --notes-file "${notesFile}"`);
  exec(`rm "${notesFile}"`);
  success(`Created GitHub Release: v${version}`);

  // 7. Publish to npm
  info('Publishing to npm...');
  exec('pnpm publish --access public --no-git-checks');
  success('Published to npm');

  log('\n✨ Release complete!\n', 'green');
  log(`Version: ${version}`, 'cyan');
  log(`GitHub: https://github.com/mirkoschubert/indium-ui/releases/tag/v${version}`, 'cyan');
  log(`npm: https://www.npmjs.com/package/indium-ui/v/${version}\n`, 'cyan');
}

// Run release
release().catch(err => {
  error(`Release failed: ${err.message}`);
});
