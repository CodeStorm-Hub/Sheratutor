<!-- Title: Add tools and knowledge with Toolbox | Category: Get started/What do you want to build?/Add tools and knowledge with Toolbox | URL: agents/concepts/toolbox-overview -->

---
layout: Conceptual
title: What is Toolbox in Microsoft Foundry? - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview
breadcrumb_path: ../../../breadcrumb/azure-ai/toc.json
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
author: mattwojo
learn_banner_products:
- azure
manager: mcleans
ms.author: mattwoj
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how a toolbox packages agent tools behind a single managed MCP endpoint in Microsoft Foundry, with centralized authentication, tool search, and skills.
reviewer: lindazqli
ms.reviewer: zhuoqunli
ms.date: 2026-07-28T00:00:00.0000000Z
ms.manager: mcleans
ms.topic: concept-article
ms.subservice: foundry-agent-service
ms.custom: pilot-ai-workflow-jan-2026, doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: 9c68a4ca-e5e2-b31b-13c4-beae06d10286
document_version_independent_id: 8f5421cf-5672-cda2-64a4-d22d9ccb7f24
updated_at: 2026-07-31T06:04:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/agents/concepts/toolbox-overview.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/dffcfbd944883ddaad8530dbadb99e5cb3d9a949/articles/foundry/agents/concepts/toolbox-overview.md
git_commit_id: dffcfbd944883ddaad8530dbadb99e5cb3d9a949
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1227
asset_id: foundry/agents/concepts/toolbox-overview
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/agents/concepts/toolbox-overview.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/63959238-cb90-4871-a33d-4a5519097e47
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/12ed19f9-ebdf-4c8a-8bcd-7a681836774d
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/78d87f42-5582-4a6b-90be-7db2f12b34e6
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3a764584-4f97-452b-8f1d-36f19b12f6ae
platformId: f94ea1ac-71bc-a806-c7be-ada84607a34e
---

# What is Toolbox in Microsoft Foundry? - Microsoft Foundry | Microsoft Learn

As organizations adopt AI agents, managing tools across agents can become increasingly complex. Agents often connect directly to tools, APIs, MCP servers, and other services, requiring separate configuration, authentication, and governance for each implementation. This approach can lead to duplicated effort, inconsistent behavior, fragile production deployments, and additional operational overhead as the number of agents grows.

Toolbox provides a centralized way to manage and share tools in Microsoft Foundry. With Toolbox, you define a curated set of tools once and expose them through a single MCP-compatible endpoint that agents can consume across frameworks and runtimes. Toolbox helps simplify tool integration while enabling centralized credential management, governance, observability, and access control. Instead of configuring tools independently for every agent, teams can manage tools in one place, reuse them across multiple agents, and update tool implementations without requiring changes to agent code. This approach helps organizations scale agent development while maintaining consistent security and operational practices.

This article explains how Toolbox works, its core concepts and architecture, and how to create and manage toolboxes in Microsoft Foundry.

## Why use a toolbox?

Consider an agent that helps onboard new employees. A single request might require the agent to:

- Retrieve onboarding guidance using a **knowledge base**.
- Create a Microsoft Entra ID account using a **REST API**.
- Provision cloud resources using a **long-running agent**.
- Draft a personalized welcome email using **agent skills**.
- Post a welcome message to a Microsoft Teams channel using an **MCP server**.

That's five types, five authentication models, and five owning teams - for *one* agent. Now multiply that across every agent your organization builds:

- Teams re-implement the same tools independently.
- Credentials are duplicated and each agent manages its own secrets and token refresh.
- Governance is inconsistent or missing, with little visibility into what tools exist or who's using them.

![Diagram showing multiple agents each wiring their own tools with different authentication models and duplicated credentials.](https://learn.microsoft.com/en-us/azure/foundry/media/tools/toolbox/toolbox-before.png)

Without a centralized approach, each agent must be configured with its own tool definitions, credentials, and integration logic. As organizations create more agents, this model can lead to duplicated tool implementations, inconsistent security controls, and increased operational overhead.

Toolbox addresses these challenges by allowing teams to define and manage tools centrally and expose them through a single MCP-compatible endpoint. Agents can then consume approved tools without requiring custom integrations for each agent, helping organizations improve tool reuse, simplify credential management, and apply governance consistently across agent deployments.

## The tool lifecycle - Build, Discover, Consume, and Govern

Toolbox covers the full tool lifecycle through four pillars - **Build**, **Discover**, **Consume**, and **Govern**:

| Pillar | Value proposition |
| --- | --- |
| **Build** | Create reusable collections of tools and [skills (preview)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/skills), publish once, and configure authentication centrally so any team can use the same tools without duplicating per-agent configuration or credentials. |
| **Discover** | Use [tool search (preview)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/tool-search) to help agents find the most relevant tools at runtime. A single toolbox can hold hundreds of tools without flooding the model's context, inflating token cost, or degrading selection accuracy. |
| **Consume** | Connect agents to a single MCP-compatible endpoint that provides access to the tools in a toolbox. Agents can discover and invoke tools across protocols and authentication models without requiring custom integrations. |
| **Govern** | Apply authentication, authorization, guardrails, observability, and version management at the toolbox level. Centralized governance helps organizations maintain consistent security and operational controls across agents and tools. |

![Diagram showing Toolbox as one MCP-compatible endpoint in Microsoft Foundry. On the left, Foundry Agent Service (prompt and hosted agents), Microsoft Agent Framework, LangGraph, and GitHub Copilot connect into Toolbox, which provides Build (curated tools, skills, and agents), Discover (reduce token consumption and context window with tool search), and Consume (unified endpoint with governance and guardrails). On the right, Toolbox connects to MCP, A2A, OpenAPI, Microsoft IQ, Skills, Agents (A2A), and more. Governed by default.](https://learn.microsoft.com/en-us/azure/foundry/media/tools/toolbox/toolbox-architecture.png)

### Foundry-homed, not Foundry-bound

Toolboxes are created and managed in Microsoft Foundry, but they aren't limited to Foundry-based agents. Any MCP-compatible runtime or client can use a toolbox, including custom agents built with Microsoft Agent Framework, LangGraph, or your own code.

Because a toolbox is a managed resource, you can add, remove, or update tools without changing agent code. Agents continue to connect to the same endpoint while administrators manage tool availability and configuration centrally. With Versioning, you can promote a new default version of a toolbox and make it available to consuming agents without redeploying those agents.

Watch these demos to see toolboxes in action:

## Key capabilities

Microsoft Foundry Agent Toolbox adds capabilities that keep large, fast-growing tool collections manageable and safe.

- **Single endpoint.** Your agent connects to one MCP-compatible endpoint and discovers every tool at runtime. You can add, remove, or reconfigure tools without changing agent code or redeploying.
- **Centralized authentication.** The toolbox handles credential injection, token refresh, and policy enforcement at runtime by using Microsoft Entra ID and OAuth identity passthrough, so consuming agents don't manage per-tool credentials.
- **Governance by default.** Apply guardrails (Responsible AI policies) to tool inputs and outputs at the toolbox level.
- **Versioning.** Create and test a new toolbox version, then promote it to default when you're ready. Every agent that points to the toolbox picks up the promoted version automatically, with no code changes.

In addition to these key capabilities, Toolbox enables the following new preview features:

### Tool search (preview)

As your application grows, so does the number of available tools. A toolbox that starts with a few tools can quickly expand to dozens or even hundreds. Sending every tool definition with every model request creates challenges:

- **Cost increases as tool count scales:** Every tool definition adds input tokens, whether the model uses that tool or not.
- **Reduced context capacity:** Tool definitions compete with conversation history, domain knowledge, and other context for space in the model's context window.
- **Less accurate tool selection:** When a model must choose from hundreds of tools, it's more likely to select a similar but incorrect tool or overlook the best option.

Tool search addresses these challenges by hiding tools by default and exposing only two meta-tools:

- `tool_search` - describe what you need and get back the most relevant tools.
- `call_tool` - invoke any discovered tool by name.

You control how tools are surfaced.

- **Pin** critical tools so they're always available.
- **Add context** to improve tool discovery using the terms your organization uses.
- **Auto-pin** frequently used tools.

Learn more: [Tool search (preview)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/tool-search).

### Skills (preview)

Tools define **what** an agent can do. Skills define **how** it performs a task.

- Skills package **reusable**, multi-step workflows as capabilities that agents can invoke like any other tool. For example, a skill might generate a formatted report, perform a triage workflow, or orchestrate a sequence of tool calls.
- Skills are **versioned and immutable**. You can attach a specific skill version to a toolbox to ensure consistent and predictable behavior across environments.
- Skills **reduce the setup required** to use shared workflows. Agents discover and load skills automatically through MCP resources at startup.

See [Skills (preview)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/skills).

## Supported tools

The following tools are supported.

| Tool | Toolbox | Direct tool integration |
| --- | --- | --- |
| [Model Context Protocol (MCP)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/model-context-protocol) | ✅ Yes | ✅ Yes |
| [Web search](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/web-search) | ✅ Yes | ✅ Yes |
| [Azure AI Search](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/ai-search) | ✅ Yes | ✅ Yes |
| [Code interpreter](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/code-interpreter) | ✅ Yes | ✅ Yes |
| [File search](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/file-search) | ✅ Yes | ✅ Yes |
| [OpenAPI](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/openapi) | ✅ Yes | ✅ Yes |
| [Agent-to-agent (A2A)](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/agent-to-agent) | ✅ Yes | ✅ Yes |
| [Browser automation](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/browser-automation) | ✅ Yes | ✅ Yes |
| [Fabric IQ](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/fabric-iq) | ✅ Yes | ✅ Yes |
| [Work IQ](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/work-iq) | ✅ Yes | ✅ Yes |
| [Tool search](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/tool-search) | ✅ Yes | ❌ No |
| [Skills](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/skills) | ✅ Yes | ❌ No |
| [Reminder tool](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/reminder-tool) | ✅ Yes | ❌ No |
| [Function calling](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/function-calling) | ❌ No (client-side execution) | ✅ Yes |
| [Grounding with Bing](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/bing-tools) | ❌ No | ✅ Yes |
| [Computer use](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/computer-use) | ❌ No | ✅ Yes |
| [Image generation](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/image-generation) | ❌ No | ✅ Yes |
| [SharePoint](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/sharepoint) | ❌ No | ✅ Yes |
| [Fabric data agent](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/fabric) | ❌ No | ✅ Yes |
| [Azure Functions](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/azure-functions) | ❌ No | ✅ Yes |

## Get started

- [Create and manage a toolbox in Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/tools/toolbox) - set up a toolbox and integrate it into your agent.
- [Toolbox quickstart](https://learn.microsoft.com/en-us/azure/foundry/quickstarts/quickstart-toolbox-agent) - build a toolbox and use it with a hosted agent end to end.