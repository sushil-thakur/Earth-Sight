import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

// Simple recursive directory copy (small, explicit implementation to avoid extra deps)
import { statSync, readdirSync as rd, mkdirSync as mk, copyFileSync as cp } from 'fs'

function copyDir(src, dest) {
  if (!existsSync(src)) throw new Error('Source not found: ' + src)
  if (!existsSync(dest)) mk(dest, { recursive: true })
  const items = rd(src)
  for (const it of items) {
    const s = join(src, it)
    const d = join(dest, it)
    const st = statSync(s)
    if (st.isDirectory()) copyDir(s, d)
    else cp(s, d)
  }
}

const root = process.cwd()
const src = join(root, 'node_modules', 'cesium', 'Build', 'Cesium')
const dest = join(root, 'public', 'Cesium')

try {
  console.log('Copying Cesium from', src, 'to', dest)
  copyDir(src, dest)
  console.log('Copy complete')
} catch (e) {
  console.error('Failed to copy Cesium:', e.message)
  process.exit(1)
}
