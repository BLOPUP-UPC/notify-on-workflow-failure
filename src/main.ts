import * as core from '@actions/core'
import {getLastJobStatus} from './github-client'
import {sendMessage} from './google-chat-client'

async function run(): Promise<void> {
  try {
    const lastJobStatus = await getLastJobStatus()
    const currentJobStatus = core.getInput('job-status', {required: true})

    core.info(
      `The last job status was ${lastJobStatus} and the current job status is ${currentJobStatus}.`
    )

    if (currentJobStatus === 'failure') {
      core.info('The pipeline is broken, notifying.')
      await sendMessage(false)
    } else if (
      currentJobStatus === 'success' &&
      lastJobStatus !== currentJobStatus
    ) {
      core.info('The pipeline has been fixed, notifying.')
      await sendMessage()
    } else {
      core.info(
        'There are no changes in the pipeline status. Notification not needed.'
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
