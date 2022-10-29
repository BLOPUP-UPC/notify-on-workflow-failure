import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'

async function getMessage(
  actor: string,
  pipelineFixed: boolean
): Promise<object> {
  const message = pipelineFixed
    ? `<font color="#008200">${actor} fixed the pipeline!</font>`
    : `<font color="#820000">${actor} broke the pipeline!</font>`
  const icon = pipelineFixed
    ? 'https://cdn.iconscout.com/icon/free/png-256/like-605-761613.png'
    : 'https://cdn.iconscout.com/icon/free/png-256/bomb-108-444520.png'
  const owner = github.context.repo.owner
  const repo = github.context.repo.repo
  const runId = github.context.runId

  return {
    cardsV2: [
      {
        card: {
          header: {
            title: repo,
            imageUrl: icon
          },
          sections: [
            {
              widgets: [
                {
                  decoratedText: {
                    text: message
                  }
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: 'Go to pipeline',
                        onClick: {
                          openLink: {
                            url: `https://github.com/${owner}/${repo}/actions/runs/${runId}`
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
}

export async function sendMessage(pipelineFixed = true): Promise<void> {
  const actor = core.getInput('actor', {required: true})
  const webhook = core.getInput('webhook', {required: true})

  const body = await getMessage(actor, pipelineFixed)
  const response = await axios.post(webhook, body)

  core.info('Sending google chat message.')

  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}`
    )
  }

  core.info('Message sent.')
}
