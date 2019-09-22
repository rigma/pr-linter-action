import * as core from '@actions/core'
import { GitHub, context } from '@actions/github'

const params = {
  repoToken: core.getInput('repo-token', {
    required: true
  })
}
const client = new GitHub(params.repoToken)
