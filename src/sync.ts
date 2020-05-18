import path from 'path';
import os from 'os';
import fs from 'fs';
import core from '@actions/core';
import github from '@actions/github';
import libpub from 'libnpmpublish';

import { downloadAsset } from './downloadAsset';

async function run() {
  const registryTo = core.getInput('registry-to');
  const tokenTo = core.getInput('token-to');

  const dist = path.resolve(os.tmpdir(), 'extracted-package-folder');

  try {
    const { url, name } = github.context.payload.release.assets.find(
      (asset: any) => asset.content_type === 'application/zip'
    );

    await downloadAsset({ url, name, dist, token: tokenTo });

    const pacakgeJson = JSON.parse(fs.readFileSync(`${dist}/package.json`, 'utf8'));

    await libpub.publish(dist, pacakgeJson, {
      token: tokenTo,
      registry: registryTo,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
