import * as core from "@actions/core";

export type ActionInputs = {
    debug: boolean;
    token: string;
    repo: string;
    owner: string;
    eventType: string;
    message: Object;
};

const inputs: ActionInputs = {
    debug: core.getBooleanInput("debug"),
    token: core.getInput("token"),
    repo: core.getInput("repo"),
    owner: core.getInput("owner"),
    eventType: core.getInput("event_type"),
    message: JSON.parse(core.getInput("message") || "{}"),
};

export function validateInputs() {
    if (
        !inputs.token ||
        inputs.token.trim().length == 0 ||
        !inputs.repo ||
        inputs.repo.trim().length == 0 ||
        !inputs.owner ||
        inputs.owner.trim().length == 0 ||
        !inputs.eventType ||
        inputs.eventType.trim().length == 0
    ) {
        throw new Error("Invalid configuration provided. token, repo, owner, and event_type are required.");
    }
}

export default inputs;
