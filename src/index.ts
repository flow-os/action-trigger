import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch from "node-fetch";
import { Buffer } from "buffer";

import inputs, { validateInputs } from "./inputs";
import log from "./log";

async function main() {
    log.info("Running new version");
    log.info("inputs", inputs);

    validateInputs();

    const { repo, owner, message, eventType } = inputs;

    log.info("dispatching trigger for destination", { repo, owner });

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
    const AUTH_HEADER = Buffer.from(inputs.token).toString('base64');
    const token_response = await fetch('https://europe-west3-fos-sessions-dev.cloudfunctions.net/github-token', { method: 'POST', headers: { 'Authorization': `Basic ${AUTH_HEADER}` } });
    // AUTH_HEADER=$(echo -n "x-api-key:$SESSIONS_OPS_KEY" | base64)
    // export GH_TOKEN=$(curl -X POST 'https://europe-west3-fos-sessions-dev.cloudfunctions.net/github-token' -H "Authorization: Basic $AUTH_HEADER")
    const token = await token_response.text();
    log.info("created client payload", JSON.stringify(clientPayload, null, 2));
    log.info("Auth Key:", AUTH_HEADER, "Created Token: ", token);
    const client = github.getOctokit(token);
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
