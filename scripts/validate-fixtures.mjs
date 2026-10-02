import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import Ajv from 'ajv'

const testsDir = join(import.meta.dirname, '../tests')
const schema = JSON.parse(await readFile(join(testsDir, 'fixtures.schema.json'), 'utf8'))
const validate = new Ajv({ allErrors: true }).compile(schema)

const problems = []
for (const category of ['encode', 'decode']) {
  const dir = join(testsDir, 'fixtures', category)
  const files = (await readdir(dir)).filter(name => name.endsWith('.json'))
  for (const file of files) {
    const fixture = JSON.parse(await readFile(join(dir, file), 'utf8'))
    const path = `${category}/${file}`
    if (!validate(fixture))
      problems.push(...validate.errors.map(error => `${path}: ${error.instancePath || '/'} ${error.message}`))
    if (fixture.category !== category)
      problems.push(`${path}: /category is "${fixture.category}", expected "${category}"`)
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log('All fixtures match tests/fixtures.schema.json')
