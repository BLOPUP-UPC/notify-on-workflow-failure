import * as core from '@actions/core'
import * as github from '@actions/github'

export async function getLastJobStatus(): Promise<string> {
  const token: string = core.getInput('token', {required: true})
  const workflowId: string = core.getInput('workflow-file', {required: true})

  const octokit = github.getOctokit(token)

  core.info('Retrieving last workflow run.')

  const response = await octokit.rest.actions.listWorkflowRuns({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    workflow_id: workflowId,
    status: 'completed',
    per_page: 1
  })

  if (response.status !== 200) {
    throw new Error(
      `Connection to github failed. response status=${response.status}`
    )
  }

  core.startGroup('Last workflow run response.')
  core.debug(JSON.stringify(response.data))
  core.endGroup()

  return response.data.workflow_runs[0].conclusion
    ? response.data.workflow_runs[0].conclusion
    : ''
}
