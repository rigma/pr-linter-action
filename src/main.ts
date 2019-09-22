import { context } from '@actions/github'
import * as core from '@actions/core'
import * as load from '@commitlint/load'
import * as lint from '@commitlint/lint'

async function getPullTitle (): Promise<string> {
  if (!context.payload.pull_request) {
    throw new Error('Missing Pull Request in the current context')
  }

  return context.payload.pull_request.title
}

async function run (): Promise<void> {
  // Setting the default configuration for PR linting
  core.debug('Loading commintlint configuration')
  const lintOptions = await load({
    extends: ['@commitlint/config-conventional']
  })

  // Retrieving current PR title
  let title: string
  try {
    core.debug('Retrieving PR title')
    title = await getPullTitle()
  } catch (err) {
    core.error(err.message)
    core.setFailed('Could not to retrieve Pull Request from your Actions\' context')

    console.log('Could not to retrieve Pull Request from your Actions\' context')
    return
  }

  // Generating linter report
  core.debug('Generating commitlint report')
  const lintReport = await lint(title, lintOptions.rules, {})

  // If linter's report is fine, then it's the end of this action
  if (lintReport.valid) {
    return
  }

  lintReport.errors.forEach(error => {
    core.error(`[${error.name}] ${error.message}`)
  })
  core.setFailed(`"${title}" is not a valid Pull Request title!`)
}

run()
