import os from 'os';
import util from 'util';
import stream from 'stream';
import fs from 'fs';
import fetch from 'node-fetch';
import unzipper from 'unzipper';

const streamPipeline = util.promisify(stream.pipeline);

export async function downloadAsset({ url, name, dist, token }: DownloadParams) {
  const assetPath = `${os.tmpdir()}/${name}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/octet-stream',
    },
  });
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

  await streamPipeline(response.body, fs.createWriteStream(assetPath));

  await fs.createReadStream(assetPath).pipe(unzipper.Extract({ path: dist }));
}

interface DownloadParams {
  url: string;
  name: string;
  dist: string;
  token: string;
}
