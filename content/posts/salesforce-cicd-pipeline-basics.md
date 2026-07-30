---
title: "Salesforce CI/CD Pipeline Basics: Where to Start"
description: "An introduction to the core pieces of a CI/CD pipeline for Salesforce projects."
date: 2026-07-18T10:00:00Z
tags: ["salesforce", "ci-cd", "automation", "sfdx"]
categories: ["DevOps", "Salesforce"]
author: "Cam Goodman"
draft: false
---

If you're coming from traditional software development, CI/CD for Salesforce can feel a little different. Metadata instead of binaries, orgs instead of servers — but the goal is the same: **get changes from source control to production automatically and safely.**

Here are the core pieces of a typical Salesforce pipeline.

## 1. Source-driven development

Everything starts in Git. With Salesforce DX, your metadata lives in source control and orgs become disposable environments rather than the source of truth.

```bash
# Authenticate to your Dev Hub
sf org login web --set-default-dev-hub --alias devhub

# Create a scratch org for development
sf org create scratch --definition-file config/project-scratch-def.json --alias feature-x --duration-days 7
```

## 2. Continuous integration

Every pull request should trigger automated checks before it can merge:

- **Validate the deployment** against a scratch org or sandbox
- **Run Apex tests** and enforce code coverage
- **Static analysis** with tools like PMD or Salesforce Code Analyzer

```bash
# Validate without deploying (check-only deploy)
sf project deploy validate --source-dir force-app --target-org ci-org
```

## 3. Continuous delivery

Once merged, changes are promoted through environments — typically integration/testing sandboxes, then staging, then production — using the same validated package each time. No manual clicks in Setup.

## 4. The golden rule

Never deploy to production something you haven't already validated. A check-only deploy against production ahead of time catches most surprises before the real release window.

---

This is just the foundation — in future posts I'll dig into branching strategies, automated testing, and tooling options (GitHub Actions, GitLab CI, Azure DevOps, and more).
