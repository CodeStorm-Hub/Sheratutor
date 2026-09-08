<!-- Title: Product and capability map | Category: Product and capability map | URL: concepts/capabilities -->

---
layout: Conceptual
title: Microsoft Foundry product and capability map - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/concepts/capabilities
breadcrumb_path: ../../breadcrumb/azure-ai/toc.json
feedback_help_link_url: https://learn.microsoft.com/answers/tags/133/azure
feedback_help_link_type: get-help-at-qna
feedback_product_url: https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4
feedback_system: Standard
permissioned-type: public
recommendations: true
recommendation_types:
- Training
- Certification
uhfHeaderId: azure-ai-foundry
ms.suite: office
author: sdgilley
learn_banner_products:
- azure
manager: mcleans
ms.author: sgilley
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Find where to start in Microsoft Foundry. Match your goal to a starting point, then compare the major products and capabilities and who each one is for.
ms.reviewer: sgilley
ms.subservice: foundry-platform
ms.topic: concept-article
ms.date: 2026-08-12T00:00:00.0000000Z
ai-usage: ai-assisted
locale: en-us
document_id: a84a1a74-5c71-265e-a271-88277260c23f
document_version_independent_id: 38d75537-0816-984f-1d9c-d55ac618a8dc
updated_at: 2026-08-27T17:28:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/concepts/capabilities.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/28571bf088a701b56e9846456c912746e39de7ab/articles/foundry/concepts/capabilities.md
git_commit_id: 28571bf088a701b56e9846456c912746e39de7ab
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 919
asset_id: foundry/concepts/capabilities
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/concepts/capabilities.md
platformId: 728f7c37-192a-571d-7284-97cb76bc108d
---

# Microsoft Foundry product and capability map - Microsoft Foundry | Microsoft Learn

Microsoft Foundry covers a wide range of features, and the hardest part is often knowing where to start. This article maps common goals to a starting point, then summarizes the major Foundry products and capabilities so you can tell them apart.

For an exhaustive list of everything in Foundry, see the [capability reference](https://learn.microsoft.com/en-us/azure/foundry/capability-reference).

## Start with your goal

Find the row closest to what you're trying to do.

| I want to | Start here | Why |
| --- | --- | --- |
| Send a prompt to a model, with no agent or tools | [Build with models and agents](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code) | The shortest path to a working call. Add an agent later only if you need tools or orchestration. |
| Build my first agent | [Choose how to build](what-is-foundry.md#start-by-building-an-agent) | Decides prompt agent versus hosted agent before you invest in either. That choice shapes everything after it. |
| Host an agent I already wrote | [Deploy a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/quickstart-hosted-agent) | Runs your existing code or container with a managed endpoint, scaling, and identity. |
| Use an open-source framework with Foundry | [Frameworks for hosted agents](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/framework-hosted-agents) | Shows how LangGraph, Microsoft Agent Framework, and Semantic Kernel map onto Foundry hosting. |
| Evaluate agent quality | [Evaluate generative AI apps](https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluate-generative-ai-app) | Establishes a baseline score first, so later changes are measurable rather than anecdotal. |
| Add observability | [Foundry Observability](https://learn.microsoft.com/en-us/azure/foundry/observability) | Tracing, monitoring, and evaluation share one data model, so set them up together. |
| Deploy and operate an application | [Set up CI/CD for agents](https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/set-up-cicd-hosted-agent) | Gets a repeatable release path before you scale. For fleet-wide governance, see the [control plane](control-plane__overview.md). |

## Major products and capabilities

Each row names one decision-level entry point. The **When to use it** column states the fit first, then the boundary where another option is a better match.

| Product or capability | What it is | When to use it | Who it's for |
| --- | --- | --- | --- |
| [Foundry portal](https://learn.microsoft.com/en-us/azure/foundry/general-availability) | Web experience for models, agents, evaluations, and resources. | Use to explore and prototype without writing code. If you need repeatable builds, move to the SDKs or CLI. | Anyone evaluating Foundry |
| [Prompt agents](agents__quickstarts__prompt-agent.md) | Declarative agents defined by instructions, a model, and tools. | Use when you want an agent with no runtime to manage. If you need custom code or a container, use hosted agents instead. | Agent developer |
| [Hosted agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents) | Your own agent code or framework, run by Foundry. | Use when you need full control of agent logic and dependencies. If instructions and tools are enough, prompt agents are simpler. | Agent developer |
| [Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models-overview) | Catalog of models from Microsoft, OpenAI, Anthropic, Meta, and others. | Use to choose and deploy the model behind your app or agent. If a model needs your domain data, consider fine-tuning. | Application developer |
| [Fine-tuning](https://learn.microsoft.com/en-us/azure/foundry/fine-tuning/fine-tune-cli) | Customization of a model on your own data. | Use when prompting and retrieval can't reach the quality you need. If the gap is missing context, use retrieval instead. | ML engineer |
| [Toolbox](agents__concepts__toolbox-overview.md) | Managed endpoint that packages the tools an agent can call. | Use to give an agent actions and to govern tools centrally. If the agent only needs your own data, start with Foundry IQ. | Agent developer |
| [Foundry IQ](agents__concepts__what-is-foundry-iq.md) | Agentic retrieval over a knowledge base. | Use to ground answers in your content. If you only need a few uploaded files, file search is lighter weight. | Agent developer |
| [Memory](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-memory) (preview) | Persistent agent recall across sessions. | Use when an agent must remember prior turns or user context. If each request stands alone, skip it. | Agent developer |
| [Workflows](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow) | Orchestration of multiple agents and steps. | Use when one task spans several agents or stages. If a single agent with tools can finish the job, stay simpler. | Agent developer |
| [Microsoft Foundry SDKs](how-to__develop__sdk-overview.md) | Client libraries for Python, C#, JavaScript, and Java. | Use to build Foundry into an application. If you're scaffolding and deploying agent projects, add the Azure Developer CLI. | Application developer |
| [Azure Developer CLI (azd)](agents__concepts__cli-agent-development.md) | Command-line scaffolding, deployment, and environment management. | Use to create, run, and ship agent projects repeatably. If you only call models from an app, the SDKs are enough. | Platform engineer |
| [Visual Studio Code extension](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/get-started-projects-vs-code) | Foundry projects, models, and agents inside the editor. | Use to build and debug without leaving VS Code. If you want an AI assistant to drive Foundry, use coding agents. | Application developer |
| [Coding agents and MCP](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/use-microsoft-foundry-skill) | Model Context Protocol access to Foundry for coding agents. | Use to let GitHub Copilot or Claude Code work against Foundry. If you prefer direct authoring, use the VS Code extension. | Application developer |
| [LangChain and LangGraph](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/langchain) | Integration of Foundry models, tools, memory, and tracing. | Use when your team already builds on LangChain or LangGraph. If you're starting fresh, native agents need less glue code. | Agent developer |
| [Foundry Observability](https://learn.microsoft.com/en-us/azure/foundry/observability) | Tracing, monitoring, and dashboards for agents and models. | Use to see what agents actually did in production. If you're comparing versions before release, start with evaluations. | AI quality engineer |
| [Evaluations](https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluate-generative-ai-app) | Scoring for generative AI apps and agents. | Use to measure quality and catch regressions before release. If you need adversarial coverage, add AI red teaming. | AI quality engineer |
| [AI red teaming](https://learn.microsoft.com/en-us/azure/foundry/ai-red-teaming-agent) | Automated adversarial scans against a model or agent. | Use to probe for unsafe or exploitable behavior. If you're measuring everyday quality, evaluations fit better. | Security administrator |
| [Guardrails and controls](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview) | Content filters and safety controls for models and agents. | Use to enforce safety at run time. If you're testing safety before release, pair it with AI red teaming. | Security administrator |
| [Foundry control plane](control-plane__overview.md) | Governance for agents, models, and tools across your estate. | Use to set limits, policy, and oversight across many projects. If you're governing a single project, project settings are enough. | Platform engineer |