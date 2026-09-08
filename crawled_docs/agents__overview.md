<!-- Title: Foundry Agent Service Overview | URL: agents/overview -->

---
layout: Conceptual
title: What is Microsoft Foundry Agent Service? - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/agents/overview
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
author: aahill
learn_banner_products:
- azure
manager: mcleans
ms.author: aahi
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn about Microsoft Foundry Agent Service capabilities, agent types, tools, and runtime features for building AI agents.
ms.subservice: foundry-agent-service
ms.topic: overview
ms.date: 2026-08-19T00:00:00.0000000Z
ms.custom: azure-ai-agents, pilot-ai-workflow-jan-2026, doc-kit-assisted
ai-usage: ai-assisted
keywords:
- Foundry Agent Service
- AI agents
- agent orchestration
- tool calling
- content filters
- agent observability
- Hosted agents
- prompt agents
- Microsoft Foundry
- agent development lifecycle
locale: en-us
document_id: 8507fba1-d0f1-5528-4751-7d5bc38a2b79
document_version_independent_id: cc937667-f212-1a08-24c5-6c426443ef19
updated_at: 2026-08-27T06:04:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/agents/overview.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/98b7b1700c3cf43ecb2c8c80f728ff55c355ff8d/articles/foundry/agents/overview.md
git_commit_id: 98b7b1700c3cf43ecb2c8c80f728ff55c355ff8d
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1892
asset_id: foundry/agents/overview
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/agents/overview.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/cbd33d8f-e9af-440e-8f1e-fc69e07b902b
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/12ed19f9-ebdf-4c8a-8bcd-7a681836774d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/57eae307-c3a1-4cac-b645-1a899934bac8
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3820371b-086e-47fb-9d1f-b215f569127a
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3a764584-4f97-452b-8f1d-36f19b12f6ae
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ee561821-1ac7-45a8-9409-6ba5eb7a5b97
platformId: 5db29ad3-30b9-c79f-60f2-5e1197ad72b4
---

# What is Microsoft Foundry Agent Service? - Microsoft Foundry | Microsoft Learn

Foundry Agent Service is a managed platform for building, deploying, and scaling AI agents. Build with any framework, any [supported model](https://ai.azure.com/catalog/models?capabilities=agentsv2&amp;cid=learnDocs) from the Foundry model catalog, and a single entry point for model inference and tools.

Foundry meets you anywhere on the spectrum from declarative to full code: define a **prompt agent** and let Foundry run it, package your own code as a **hosted agent**, or call the **Responses API** from an agent you already run elsewhere. Choose how to build covers each path.

## Agent Service at a glance

| Component | What it does |
| --- | --- |
| **[Agent Runtime](concepts/runtime-components)** | Hosts and scales prompt agents and Hosted agents. Manages conversations, tool calls, and agent lifecycle. |
| **[Toolboxes](concepts/toolbox-overview)** | Curate a set of tools once, such as: web search, file search, code interpreter, MCP servers, and custom functions. Then share them across agents through a single managed MCP endpoint with centralized authentication, governance, and versioning. |
| **[Models](https://ai.azure.com/catalog/models?capabilities=agentsv2&amp;cid=learnDocs)** | Works with many models from the Foundry model catalog, such as GPT-4o, Llama, and DeepSeek. Swap models without changing your agent code. |
| **[Observability](../observability/concepts/trace-agent-concept)** | End-to-end tracing, metrics, evaluations, and Application Insights integration. See every decision your agent makes and measure its quality. |
| **[Optimization](concepts/agent-optimizer-overview)** | Agent optimizer (preview) evaluates agent behavior and automatically generates better instructions, skills, tool descriptions, and model selections for prompt agents and Hosted agents. |
| **[Identity & Security](concepts/agent-identity)** | Microsoft Entra identity, RBAC, content filters, and virtual network isolation. Enterprise-grade trust built in. |
| **[Publishing](how-to/publish-copilot)** | Version agents, create stable endpoints, and share through Microsoft Teams, Microsoft 365 Copilot, and the Entra Agent Registry. |

## Choose how to build

Tip

Building your first agent? Start with a prompt agent using either the [Foundry portal](https://ai.azure.com/?cid=learnDocs), or the quickstart for [creating a prompt agent with code](quickstarts/prompt-agent).

Foundry gives you several ways to build, from a single model call to a fully containerized agent. Choose your path based on what you're trying to do:

- **Want the least to manage?**[Start with a prompt agent](quickstarts/prompt-agent). Configure instructions, a model, and tools; Foundry runs it with no code or infrastructure.
- **Want full control in Foundry?**[Deploy a hosted agent](quickstarts/quickstart-hosted-agent). Bring your own code and framework as a container; Foundry runs it with a managed endpoint, scaling, and identity.
- **Already run agent code elsewhere?**[Call the Responses API](quickstarts/responses-api) directly to use Foundry models and tools, with no agent resource to manage.

Prompt agents and hosted agents are the two agent types in Foundry. The next section breaks down the value of each so you can choose with confidence.

## Agent types

Agent Service offers two agent types. Your choice sets how much you build versus how much Foundry manages:

- **Prompt agents**: the fastest path. Define instructions, a model, and tools, and Foundry runs the agent for you with no code or infrastructure to manage.
- **Hosted agents**: the most control. Bring your own code and framework, and Foundry runs it as a container with a managed endpoint, scaling, and identity.

### Prompt agents

You define prompt agents entirely through configuration, including instructions, model selection, and tools. Author them in the Foundry portal for a quick start, or define them programmatically with the SDKs or REST API to integrate with your CI/CD workflows. Either way, Foundry runs the agent for you. There's no application code to maintain, and no containers or packages to optimize, scale, or monitor for security.

Two paths to get started:

- **Portal-first**: create an agent interactively in the Foundry portal, test it in the playground, then call it from your application code.
- **Code-first**: define the agent using the SDK or REST API in your deployment pipeline, enabling version control, code review, and automated rollout.

**Best for**: Getting started fast, internal tools, production agents that don't need custom orchestration logic, and teams that want a managed runtime without infrastructure overhead.

### Hosted agents

[Hosted agents](concepts/hosted-agents) are code-based agents you build with [Agent Framework](https://github.com/microsoft/agent-framework), [LangGraph](https://github.com/langchain-ai/langgraph), the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python), the [Anthropic Agent SDK](https://github.com/anthropics/anthropic-sdk-python), the [GitHub Copilot SDK](https://github.com/github/copilot-sdk), or your own code. Ship your agent as either a container image or a .zip file of your source code (Foundry builds the image for you when you bring a .zip file), and Foundry runs it with a managed endpoint, automatic scaling, a dedicated Microsoft Entra identity, session-level state persistence, and end-to-end observability.

Under the hood, your agent code calls your Foundry project endpoint for model inference and tool orchestration, which gives you access to Foundry models from the catalog and a unified set of platform tools: standard tools like file search, code interpreter, and web search, plus additional tools like SharePoint, WorkIQ, and Fabric IQ.

**Best for**: Agents that call into your own custom code; secondarily, custom orchestration logic, multi-agent systems, and custom protocols (webhooks, voice, AG-UI) where you want full control over agent logic while letting Foundry handle hosting, scaling, and identity.

### Compare agent types

| - | Prompt agents | Hosted agents |
| --- | --- | --- |
| **Authoring surface** | Portal, SDK, or REST | Agent Framework, LangGraph, OpenAI Agents SDK, Anthropic Agent SDK, GitHub Copilot SDK, custom code |
| **Foundry models + platform tools** | Yes | Yes (via the Responses API on the Foundry project endpoint) |
| **Skill support** | Yes | Yes |
| **Runtime code to maintain** | None | Yes, your agent logic |
| **Compute to manage** | None, fully managed | Container compute, Foundry-managed |
| **Managed endpoint** | Yes | Yes |
| **Autoscale** | Automatic, Foundry-managed; scales with request volume | Automatic, Foundry-managed; scales container instances per session and request volume |
| **Agent identity (Entra)** | Yes | Automatic, dedicated per agent |
| **Cost model** | Per-call inference + tool usage | Per-call inference + tool usage + container compute |
| **Best for** | Fast start, production agents without custom orchestration | Agents that call into custom code; secondarily, custom orchestration logic |

### Use the Responses API for ephemeral agents

When you call the Responses API directly from your own code, you build an *ephemeral agent*: the agent's definition (instructions, tools, and model) lives in your application code instead of as a persisted resource in Foundry. Each call assembles the agent in your process and runs it against the Responses API, so there's no agent to create, update, or delete in Foundry.

Use this pattern when you want:

- **Agent logic that ships with your app.** The definition versions alongside the rest of your code through source control and code review, instead of as a separate Foundry resource that someone has to keep in sync with the app.
- **Foundry capabilities without the resource overhead.** You still get catalog models, platform tools, project-scoped data, On-Behalf-Of authentication, and project-level observability and governance. All through your Foundry project endpoint.

See [Quickstart: Use the Responses API](quickstarts/responses-api) for information.

## Model support

Agent Service works with many models available in the Foundry model catalog. For the full list, see the [Foundry portal](https://ai.azure.com/catalog/models?capabilities=agentsv2&amp;cid=learnDoc).

## Tools and toolboxes

Agents act on the world through **tools**. Foundry offers built-in tools such as web search, file search, code interpreter, and memory, while also letting you add custom tools through functions, OpenAPI specs, and MCP servers. For the full set, see the [toolbox overview](concepts/toolbox-overview#supported-tools).

A **toolbox** groups those tools into a single, reusable unit. You curate the tools once, and Foundry exposes them behind one managed MCP-compatible endpoint that any agent or runtime can consume, regardless of framework. Toolboxes centralize authentication, governance, and versioning, so you update tools in one place instead of rewiring every agent. Create a new version, test it, and promote it to default when you're ready. To learn more, see [What is Toolbox in Foundry?](concepts/toolbox-overview).

### Connect and authenticate to MCP remote servers

Foundry supports remote MCP servers that you can add to your agent, such as the [Azure DevOps MCP Server](/en-us/azure/devops/mcp-server/mcp-server-overview). Connect your Azure DevOps organization to enable agent access, and configure a subset of available tools to control which actions agents can perform. You can also connect custom MCP servers hosted on Azure Functions using the Functions MCP webhook endpoint (`/runtime/webhooks/mcp`) to expose custom tools to your agents.

Supported authentication options for MCP servers and other tool connections include:

- Key-based access
- Microsoft Entra (using the agent's managed identity or the project's managed identity)
- OAuth identity passthrough (On-Behalf-Of)
- Unauthenticated access, where appropriate

These authentication options also apply when connecting remote MCP servers, with credentials and scopes managed in the tool configuration.

## Development lifecycle

Agent Service supports the full build-test-deploy-monitor workflow:

1. **Create**: Define a prompt agent in the portal or with the SDK, or write a Hosted agent that calls the Responses API.
2. **Test**: Chat with your agent in the [agents playground](../concepts/concept-playgrounds) or run locally. MCP server integrations, including custom MCP servers hosted on Azure Functions, can be exercised directly in the playground to validate tool connectivity, permissions, and behavior before publishing.
3. **Trace**: Inspect every model call, tool invocation, and decision with [agent tracing](../observability/concepts/trace-agent-concept).
4. **Evaluate**: Run evaluations to measure quality and catch regressions.
5. **Optimize**: Automatically improve your hosted agent's instructions using the [agent optimizer](concepts/agent-optimizer-overview).
6. **Publish**: [Promote your agent](how-to/agent-applications) to a managed resource with a stable endpoint.
7. **Monitor**: Track performance and reliability with [service metrics](../observability/how-to/how-to-monitor-agents-dashboard) and dashboards.

For a detailed walkthrough, see [Agent development lifecycle](concepts/development-lifecycle).

## Enterprise capabilities

Agent Service provides enterprise-grade infrastructure for every agent you deploy:

- **[Agent identity](concepts/agent-identity)**: Each agent can have a dedicated Microsoft Entra identity, enabling secure, scoped access to resources and APIs without sharing credentials. Agent identities can authenticate to external MCP servers, including those hosted on Azure Functions, and OAuth On-Behalf-Of (OBO) passthrough is supported when configured.
- **[Private networking](how-to/virtual-networks)**: Run agents within your Azure virtual network for full network isolation and compliance with data residency requirements. Private networking is available for prompt agents. Hosted agents support bring-your-own Azure Virtual Network (BYO VNet), where each session runs in a VM-isolated sandbox connected to your VNet.
- **Role-based access control**: Fine-grained permissions through Microsoft Entra and Azure RBAC. Control who can create, invoke, and manage agents.
- **Content safety**: Integrated content filters help mitigate prompt injection risks (including cross-prompt injection) and prevent unsafe outputs.

For environment setup instructions, see [Set up your environment](environment-setup).

## Publishing and sharing

Agent Service provides built-in versioning and publishing so your agents can move from development to production with confidence.

- **Versioning**: As you iterate on your agent, versions are automatically snapshotted. Roll back to any previous version or compare changes between versions.
- **[Publishing](how-to/agent-applications)**: Promote an agent to a managed resource with a stable endpoint. Published agents inherit the enterprise identity and access controls configured for your project and can be invoked programmatically.
- **Distribution**: Share published agents through [Microsoft 365 Copilot and Teams](how-to/publish-copilot) and the Entra Agent Registry, putting your agents where your users already work. Foundry Agent Service supports the OpenResponses and Activity Protocols for Microsoft 365 publishing, an Invocations protocol for flexible endpoint integration with custom apps and services, and the [A2A protocol (preview)](how-to/enable-agent-to-agent-endpoint) for agent-to-agent communication.

## Security, privacy, and compliance

Agent Service is designed for enterprise workloads where you need strong controls over identity, networking, data handling, and safety.

- **Safety controls**: Use integrated [guardrails](../guardrails/guardrails-overview) to help reduce unsafe outputs and mitigate prompt injection risks, including cross-prompt injection attacks (XPIA).
- **Network isolation and data residency controls**: Use [virtual networks](how-to/virtual-networks) and bring-your-own resources to meet your requirements.
- **Bring your own resources**: Use your own Azure resources (for example, storage, Azure AI Search, and Azure Cosmos DB for conversation state) to meet compliance and operational needs. See [Use your own resources](how-to/use-your-own-resources).
- **Responsible AI guidance**: For a broader set of recommendations and governance resources, see [Responsible AI for Microsoft Foundry](../responsible-use-of-ai-overview).