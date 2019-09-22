import * as core from '@actions/core'
import { GitHub, context } from '@actions/github'
import { ActionParams } from './types/params'

const params: ActionParams = {
  repositoryToken: core.getInput('repo-token', {
    required: true
  })
}
const client = new GitHub(params.repositoryToken)
