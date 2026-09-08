<!-- Title: Use model router with agents | Category: Models/Explore Foundry Models/Model Router/Use model router with agents | URL: openai/how-to/model-router-agents -->

---
layout: Conceptual
title: Use model router with Foundry agents - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/model-router-agents
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
author: sanjeev3
learn_banner_products:
- azure
manager: mcleans
ms.author: sajagtap
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how model router selects the optimal model per request for your Foundry agents, reducing costs while maintaining quality across tool-calling, RAG, and multi-turn scenarios.
ms.date: 2026-08-12T00:00:00.0000000Z
ms.subservice: foundry-model-inference
ms.topic: how-to
ms.custom:
- doc-kit-assisted
- dev-focus
ai-usage: ai-assisted
locale: en-us
document_id: fdd6c581-287a-f5f3-9bfb-d39ca4424049
document_version_independent_id: b7f8703c-34bf-fd4a-8e51-1a15dc76f142
updated_at: 2026-09-01T06:04:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/openai/how-to/model-router-agents.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/079e5903864908566bff8b805b35a05157f53199/articles/foundry/openai/how-to/model-router-agents.md
git_commit_id: 079e5903864908566bff8b805b35a05157f53199
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1571
asset_id: foundry/openai/how-to/model-router-agents
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/openai/how-to/model-router-agents.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/fbc448d8-f51b-49e6-a28d-b0ed67a9b6ee
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/540ac133-a371-4dbb-8f94-28d6cc77a70b
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/a2d547e1-b5e2-4f22-ada5-397b95fd90be
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/60bfc045-f127-4841-9d00-ea35495a5800
platformId: 3c062dc1-302d-950e-da6e-66f3445915ca
---

# Use model router with Foundry agents - Microsoft Foundry | Microsoft Learn

Model router selects the optimal large language model (LLM) for each request your agent makes — per turn, not per session. A simple greeting routes to a fast, inexpensive model. A complex tool-calling chain routes to a frontier model. You deploy one endpoint, write zero routing logic, and get automatic cost optimization across all agent interactions.

This article explains how model router behaves with Foundry Agent Service agents, which tool types it supports, the routing patterns you can expect, and how to get started.

Tip

Get hands-on with the [Foundry Agent Lab](https://github.com/microsoft-foundry/Foundry-Agent-Lab). Its progressive demos show model router across function tools, web search, code interpretation, RAG, MCP, and Toolbox, with session logs that explain each routing decision.

For general model router concepts, see the [model router overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/model-router). For deployment steps, see [Use model router](https://learn.microsoft.com/en-us/azure/foundry/model-router).

## Prerequisites

- A Microsoft Foundry project with a model router deployment. See [Deploy a model router model](https://learn.microsoft.com/en-us/azure/foundry/model-router#deploy-a-model-router-model).
- Familiarity with [Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview).
- Azure CLI installed and authenticated (`az login`).

## Why use model router for agents

Building agents requires choosing a model — but agents handle diverse tasks within the same session. A single conversation might include:

- A simple factual lookup (inexpensive model is sufficient)
- A multi-step tool-calling chain (mid-tier model handles orchestration)
- Complex reasoning or synthesis (frontier model needed)

Without model router, you either over-provision (use an expensive model for everything) or under-provision (use a cheap model that degrades on complex tasks). Model router eliminates this tradeoff by selecting the right model for each individual request.

Key benefits for agent workloads:

- **Zero model selection overhead.** One deployment serves all agent scenarios — no per-agent model decisions.
- **Per-request optimization.** Different turns in the same conversation use different models based on complexity.
- **Automatic cost efficiency.** Simple queries use inexpensive models; expensive models only activate when the prompt genuinely needs them.
- **Tool-aware routing.** The router understands tool-calling patterns and selects models capable of structured invocations.
- **Multi-agent flexibility.** Deploy multiple model router instances — each with a different model subset and routing mode — and assign each agent the deployment that fits its workload.
- **Future-proof.** As new models become available, the router incorporates them without code changes.

## Supported tool types

Model router works with supported Foundry Agent Service tools. When an agent uses tools, model router can select eligible OpenAI, open-source (OSS), and Anthropic models from the configured routing pool. A model is eligible only when it supports the requested tool and deployment configuration.

Tool support varies by model and region. For the current compatibility matrix, see [Tool support by region and model](https://learn.microsoft.com/en-us/azure/foundry/../agents/concepts/limits-quotas-regions#tool-support-by-region-and-model).

To route agentic requests to Claude models, deploy the Claude models separately and include them in the model router deployment.

## How routing works with agents

Model router analyzes the full request context — system message, user message, tool definitions, conversation history — to determine complexity and select a model. For agents, this means:

### Per-request, not per-session

Each turn in a conversation is routed independently. A conversation might use three different models across five turns based on what each turn requires. You can observe which model handled each request through the `model` field in the API response.

### Complexity-aware selection

The router distinguishes between:

- **Low complexity** — Factual recall, simple greetings, or basic follow-up questions route to fast, inexpensive models.
- **Medium complexity** — Tool orchestration (calling a function, passing arguments, formatting results) routes to capable mid-tier models that generate valid tool calls at lower cost.
- **High complexity** — Research synthesis, multi-step reasoning, and complex code generation route to frontier models.

### Tool-aware routing

When tools are attached to an agent, the router factors tool definitions into its routing decision. Mechanistic tool calls (structured JSON generation with `strict=True`) don't require expensive models — the router selects cost-efficient models that reliably produce valid tool invocations.

## Routing patterns for agent scenarios

The following patterns describe typical model router behavior with agents. Specific model selections vary over time as new models become available and routing logic evolves.

### Simple conversations

Factual questions, greetings, and basic follow-ups route to fast, inexpensive models. This applies regardless of whether the agent has tools attached — if the current turn doesn't need them, the router optimizes for speed and cost.

### Tool orchestration

When an agent invokes tools (function calls, web search, code execution), the router selects models capable of structured output generation. For straightforward tool calls, mid-tier models handle orchestration at a fraction of frontier model cost.

### RAG and document synthesis

Retrieval-augmented generation — where the agent searches a vector store and synthesizes information across multiple documents — consistently routes to higher-capability models. The reasoning and synthesis demands justify the cost.

### Summarization

Summarization tasks (for example, "summarize our conversation") route to models specialized for that task type. The router recognizes summarization as a distinct category regardless of the agent scenario.

### Multi-step orchestration

Complex agentic workflows that chain multiple tool calls, require multi-step reasoning, or involve external service orchestration (MCP servers, Toolbox) route to frontier models.

## Cost implications

Model router delivers cost savings by matching model capability to task demands:

- **Simple agent interactions** (typically 50–60% of traffic) route to models that cost significantly less than frontier models while maintaining equivalent quality for those tasks.
- **Complex interactions** still use frontier models — quality is preserved where it matters.
- **Net effect** — You pay frontier-model prices only for requests that genuinely require frontier-model capability.

The exact savings depend on your workload mix. Workloads with a higher proportion of simple interactions (classification, lookup, basic Q&A) see larger savings.

## Tailor model subsets per agent

You can create multiple model router deployments, each with its own routing mode and model subset. Assign each agent the deployment that matches its workload. This pattern is useful when your agents have distinct cost, compliance, or capability requirements.

| Deployment name | Routing mode | Model subset | Agent use case |
| --- | --- | --- | --- |
| `router-frontier` | Quality | gpt-5.6-sol, gpt-5, o4-mini | Research agent — complex reasoning and synthesis |
| `router-balanced` | Balanced | gpt-5-mini, gpt-4.1, gpt-4.1-mini | General assistant — mixed-complexity conversations |
| `router-efficient` | Cost | gpt-5-nano, gpt-4.1-nano | Triage agent — classification and simple Q&A |

To set up each deployment with a specific model subset, see [Route to a model subset](https://learn.microsoft.com/en-us/azure/foundry/model-router#optional-route-to-a-model-subset). To change the routing mode, see [Change the routing mode](https://learn.microsoft.com/en-us/azure/foundry/model-router#optional-change-the-routing-mode).

The following example creates three agents, each pointing to a different model router deployment:

# **Python**
```python
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

# Research agent — uses a Quality-mode router with gpt-5.6-sol, gpt-5, and o4-mini
research_agent = project.agents.create_agent(
    model="router-frontier",
    name="research-agent",
    instructions="You are a research assistant that synthesizes complex information.",
)

# General assistant — uses a Balanced-mode router with gpt-5-mini and gpt-4.1
assistant_agent = project.agents.create_agent(
    model="router-balanced",
    name="assistant-agent",
    instructions="You are a helpful assistant.",
)

# Triage agent — uses a Cost-mode router with gpt-5-nano and gpt-4.1-nano
triage_agent = project.agents.create_agent(
    model="router-efficient",
    name="triage-agent",
    instructions="You classify incoming requests and route them to the right team.",
)
```

# **JavaScript/TypeScript**
```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

const project = new AIProjectClient(
  process.env["PROJECT_ENDPOINT"]!,
  new DefaultAzureCredential(),
);

// Research agent — Quality-mode router with gpt-5.6-sol, gpt-5, o4-mini
const researchAgent = await project.agents.createVersion("research-agent", {
  kind: "prompt",
  model: "router-frontier",
  instructions:
    "You are a research assistant that synthesizes complex information.",
});

// General assistant — Balanced-mode router with gpt-5-mini, gpt-4.1
const assistantAgent = await project.agents.createVersion("assistant-agent", {
  kind: "prompt",
  model: "router-balanced",
  instructions: "You are a helpful assistant.",
});

// Triage agent — Cost-mode router with gpt-5-nano, gpt-4.1-nano
const triageAgent = await project.agents.createVersion("triage-agent", {
  kind: "prompt",
  model: "router-efficient",
  instructions:
    "You classify incoming requests and route them to the right team.",
});
```

---

Each agent makes independent routing decisions within its assigned model pool. The research agent never uses a nano-tier model, and the triage agent never incurs frontier-model costs.

- Reference: [`AIProjectClient.agents.create_agent`](https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.aiprojectclient) (Python)
- Reference: [`AIProjectClient.agents.createVersion`](https://learn.microsoft.com/en-us/javascript/api/@azure/ai-projects/aiprojectclient) (JavaScript/TypeScript)

## Get started

### Configure your agent to use model router

Set model router as the model for your agent. No additional routing configuration is needed.

In the [Foundry portal](https://ai.azure.com/?cid=learnDocs), select your model router deployment from the **model** dropdown when creating or editing an agent in the agent playground.

For programmatic agent creation, specify your model router deployment name:

# **Python**
```python
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

agent = project.agents.create_agent(
    model=os.environ["MODEL_DEPLOYMENT"],  # "model-router"
    name="my-agent",
    instructions="You are a helpful assistant.",
)
```

# **JavaScript/TypeScript**
```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

const project = new AIProjectClient(
  process.env["PROJECT_ENDPOINT"]!,
  new DefaultAzureCredential(),
);

const agent = await project.agents.createVersion("my-agent", {
  kind: "prompt",
  model: process.env["MODEL_DEPLOYMENT"]!, // "model-router"
  instructions: "You are a helpful assistant.",
});
```

---

- Reference: [`AIProjectClient.agents.create_agent`](https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.aiprojectclient) (Python)
- Reference: [`AIProjectClient.agents.createVersion`](https://learn.microsoft.com/en-us/javascript/api/@azure/ai-projects/aiprojectclient) (JavaScript/TypeScript)

### Observe routing decisions

Each response includes the `model` field showing which underlying model was selected. Log this field to track routing distribution across your agent's interactions:

```python
response = project.agents.runs.create_and_process(
    thread_id=thread.id,
    agent_id=agent.id,
)

# The model field shows which model handled this request
for message in project.agents.messages.list(thread_id=thread.id):
    print(f"[model: {message.model}] {message.content}")
```

### Tune routing behavior

After observing your agent's routing distribution:

- **Switch routing mode** — Use Quality mode for critical agents (legal, medical) or Cost mode for high-volume agents (classification, triage). See [Change the routing mode](https://learn.microsoft.com/en-us/azure/foundry/model-router#optional-change-the-routing-mode).
- **Constrain the model pool** — Use model subset to limit which models the router can select. See [Route to a model subset](https://learn.microsoft.com/en-us/azure/foundry/model-router#optional-route-to-a-model-subset).

Evaluate changes with representative multi-turn traces, including tool calls, retrieval, and complex handoffs from your agent workload. Keep the baseline, instructions, tools, and trace set fixed while you change one routing setting. For guidance on defining acceptance criteria and interpreting tradeoffs, see [Evaluate model router for your workload](https://learn.microsoft.com/en-us/azure/foundry/evaluate-model-router).