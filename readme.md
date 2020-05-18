## GitHub action sync

Synchronizes published GitHub package with `npm`.

### Usage

You need to checkout this repository from within your GitHub job and use it as a local one. Example:

```yml
name: Sync packages
on:
  release:
    types: [published]
jobs:
  sync_packages:
    runs-on: ubuntu-latest
    steps:
      - name: Sync packages
        uses: LexSwed/npm-package-sync
        with:
          registry-to: 'https://npm.pkg.github.com'
          token-to: ${{ secrets.GITHUB_TOKEN }}
```
