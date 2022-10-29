# notify-on-workflow-failure

This action sends a message to a google chat when a workflow fails or is fixed.

[![Tests](https://github.com/BLOPUP-UPC/notify-on-workflow-failure/workflows/build-test/badge.svg)](https://github.com/BLOPUP-UPC/notify-on-workflow-failure/actions/workflows/test.yml)

## Usage

Create a workflow `.yml` file in your repositories `.github/workflows` directory and add a new job to it that depends on your normal job and uses this action. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

The job using this action needs to run always, so you have to add an `if` condition to it set to `always()`.

### Inputs

* `token` - The GitHub token available in the `secrets.GITHUB_TOKEN` secret.
* `workflow-file` - The name of the yml file for the workflow you want to be notified of.
* `job-status` - The job status of the job you depend on. It is available in the `needs.<job-name>.result` variable.
* `webhook` - The google chat group webhook to send the notification. Don't forget to add a `threadId` to the end of the webhook, so all notifications are sent to the same thread in the group. It is recommended that you store the webhook in a secret.
* `actor` - The user who triggered the worfklow run, available in the `github.actor` variable.

### Example workflow

```yaml
name: A workflow

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run tests
        run: |
          my-command-for-testing

  notify:
    needs: build
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: BLOPUP-UPC/notify-on-workflow-failure@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          workflow-file: name-of-the-workflow-file.yml
          job-status: ${{ needs.build.result }}
          webhook: ${{ secrets.MY_SECRET_WITH_GOOGLE_CHAT_WEBHOOK }}
          actor: ${{ github.actor }}
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)