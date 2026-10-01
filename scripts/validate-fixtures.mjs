import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv'

const testsDir = fileURLToPath(new URL('../tests/', import.meta.url))
const schema = JSON.parse(readFileSync(join(testsDir, 'fixtures.schema.json'), 'utf8'))
const validate = new Ajv({ allErrors: true }).compile(schema)

let failed = 0
for (const category of ['encode', 'decode']) {
  const dir = join(testsDir, 'fixtures', category)
  for (const file of readdirSync(dir).filter(name => name.endsWith('.json'))) {
    const fixture = JSON.parse(readFileSync(join(dir, file), 'utf8'))
    const problems = []
    if (!validate(fixture))
      problems.push(...validate.errors.map(error => `${error.instancePath || '/'} ${error.message}`))
    if (fixture.category !== category)
      problems.push(`/category is "${fixture.category}", expected "${category}"`)
    for (const problem of problems)
      console.error(`${category}/${file}: ${problem}`)
    failed += problems.length
  }
}

if (failed > 0)
  process.exit(1)
console.log('All fixtures match tests/fixtures.schema.json')
