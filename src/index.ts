import * as core from "@actions/core";
import * as github from "@actions/github";

import inputs, {validateInputs} from "./inputs";
import log from "./log";

async function main() {
    log.info("inputs", inputs);

    validateInputs();

    const {repo, owner, message, eventType} = inputs;

    log.info("dispatching trigger for destination", {repo, owner});

    const clientPayload = {
        trigger: {
            repo,
            owner,
            eventType,
        },
        source: {
            fullName: github.context.payload.repository?.full_name,
            owner: github.context.payload.repository?.owner,
            repo: github.context.payload.repository?.name,
            ref: github.context.ref,
            sha: github.context.sha,
        },
        event: github.context.payload,
        message,
    };

    log.info("created client payload", JSON.stringify(clientPayload, null, 2));

    const client = github.getOctokit(inputs.token);
    const result = await client.request("POST /repos/{owner}/{repo}/dispatches", {
        owner,
        repo,
        event_type: eventType,
        client_payload: clientPayload,
    });

    console.log(`Dispatched ${eventType} to ${owner}/${repo}.`);

    log.info("dispatch result", JSON.stringify(result, null, 2));
}

main().catch((err) => {
    core.setFailed(err.message ?? "Failed to run Trigger Action");
    log.error("exit_error", err);
});
