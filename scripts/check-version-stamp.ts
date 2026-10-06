import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const rootDir = join(import.meta.dirname, '..')
const readText = (fileName: string) => readFile(join(rootDir, fileName), 'utf8')

// Runs after bumpp has written the new version, so a release can't ship with the previous version's stamp
const { version } = JSON.parse(await readText('package.json'))
const specVersion = version.split('.').slice(0, 2).join('.')
const stamps: [fileName: string, stamp: string][] = [
  ['SPEC.md', `**Version:** ${specVersion}`],
  ['SPEC.md', `\`toon-spec: ${specVersion}\``],
  ['README.md', `[![SPEC v${specVersion}](https://img.shields.io/badge/spec-v${specVersion}-`],
  ['README.md', `Version ${specVersion}, `],
  ['CHANGELOG.md', `## [${specVersion}] - `],
]

const missingStamps: string[] = []
for (const [fileName, stamp] of stamps) {
  if (!(await readText(fileName)).includes(stamp))
    missingStamps.push(`${fileName}: missing "${stamp}"`)
}

if (missingStamps.length > 0) {
  console.error(missingStamps.join('\n'))
  process.exit(1)
}

console.log(`Spec version ${specVersion} is stamped`)
