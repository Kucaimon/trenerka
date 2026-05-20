import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const zipPath = path.join(root, '..', 'production-build.zip')

if (!fs.existsSync(dist)) {
  console.error('dist/ not found — run vite build first')
  process.exit(1)
}

for (const name of fs.readdirSync(dist)) {
  if (name.endsWith('.map') || name === '.DS_Store') {
    fs.rmSync(path.join(dist, name), { recursive: true, force: true })
  }
}

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath)

execSync(
  `cd "${dist}" && zip -r "${zipPath}" . -x "*.map" -x ".DS_Store"`,
  { stdio: 'inherit' },
)

console.log(`\nCreated ${zipPath}`)
