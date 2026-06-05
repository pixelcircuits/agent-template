# Agent Template

Reusable repository scaffolding for agent-oriented development workflows.

## Intended Workflow

All items in this repo are intended to support the following workflow:

### Step 0: Define [Codex]

Define the issue at hand and create a proper `issue.md` file for workers to reference. This will typically involve talking to an agent who has access to JIRA, Github Issues, Emails, Meeting Notes, etc. to summarize the latest issue at hand, any replication steps obeserved and established requirements and expectations that would make this issue considered as "resolved".

### Step 1: Plan [Codex]

Plan out the implementation for progress on the issue, splitting things out into manageable phases if necessary. Establishes a `plan.md` file for workers to reference.

### Step 2: Execute [Codex]

Executes phases of the plan. The plan is allowed to change during execution. The end of execution step should include working tests, running any linters and baseline evaluations if possible (ex. playwright).

### Step 3: Check [Human]

This step allows a human to check on the progress of the work. This can invlove asking the still open execution agent why they did what they did, asking it to make small revisions, or making revisions themselves. The human has the option to move things back to Step 2 (Execute) by wiping all changes and asking the previous execution agent to add new expectations to the `plan.md` along with any notes about this last attempt and why it was not adequate. The goal is not for the human to review the full code yet, but to check in and explore in case things are too off.

### Step 4: Review [Claude/Human]

The goal of this step is to do a final pass on the code before a PR. It involves a first pass with a reviewer agent using a different model than the executor. Finally, it ends with the human doing a final code review asking both the reviewer agent and executor agent for notes and/or tips.

### Step 5: Spec Updates [Codex/Claude]

The final step is to update/add/remove the `spec.md` files. This can be done with any model, but should be done in a fresh context analyzing the changes. These spec files are important to help future agents get an understanding of code expectations without needed to consume the entire codebase. The `spec.md` files are also used to establish used patterns that should be matched when executing future issues.

## Skills

The `skills/` folder contains portable skills that can be installed into agent tool
directories.

### Installing Skills

Use the root install script to copy every skill from `skills/` into the local agent skill directories:

```bash
./install-skills.sh
```

By default, the script installs skills into:

- `.codex/skills`
- `.claude/skills`
- `.agents/skills`

To install from a different source directory, pass the path as the first argument:

```bash
./install-skills.sh ./skills
```


## AGENTS.md

`AGENTS.md` contains a reusable repo-level guidance for agents. It outlines the process for spec driven development, including how `spec.md` files should be interpreted and which roles or workflows should pay attention to them.