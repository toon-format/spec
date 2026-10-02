import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import Ajv from 'ajv'

const testsDir = join(import.meta.dirname, '../tests')
const schema = JSON.parse(await readFile(join(testsDir, 'fixtures.schema.json'), 'utf8'))
const validate = new Ajv({ allErrors: true }).compile(schema)

const fixtureErrors: string[] = []
for (const category of ['encode', 'decode']) {
  const categoryDir = join(testsDir, 'fixtures', category)
  const fileNames = (await readdir(categoryDir)).filter(fileName => fileName.endsWith('.json'))
  for (const fileName of fileNames) {
    const fixture = JSON.parse(await readFile(join(categoryDir, fileName), 'utf8'))
    const fixturePath = `${category}/${fileName}`
    if (!validate(fixture))
      fixtureErrors.push(...validate.errors!.map(error => `${fixturePath}: ${error.instancePath || '/'} ${error.message}`))
    if (fixture.category !== category)
      fixtureErrors.push(`${fixturePath}: /category is "${fixture.category}", expected "${category}"`)
  }
}

if (fixtureErrors.length > 0) {
  console.error(fixtureErrors.join('\n'))
  process.exit(1)
}

console.log('All fixtures match tests/fixtures.schema.json')
