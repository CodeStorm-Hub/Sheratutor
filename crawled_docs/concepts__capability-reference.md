<!-- Title: Capability reference | Category: Capability reference | URL: concepts/capability-reference -->

---
layout: Conceptual
title: Microsoft Foundry capability reference - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/concepts/capability-reference
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
description: Reference list of Microsoft Foundry capabilities by area, including models, agents, tools, knowledge, observability, evaluation, guardrails, and governance.
ms.reviewer: sgilley
ms.subservice: foundry-platform
ms.topic: reference
ms.date: 2026-08-12T00:00:00.0000000Z
ai-usage: ai-assisted
locale: en-us
document_id: 9e0ea685-389c-427d-8976-27d7d4aaa5be
document_version_independent_id: 39a0f3ec-2448-312a-a461-2ddf4402745d
updated_at: 2026-09-01T17:22:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/concepts/capability-reference.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/a126d0bffae9065ff2567df94ff968da9f0bc07b/articles/foundry/concepts/capability-reference.md
git_commit_id: a126d0bffae9065ff2567df94ff968da9f0bc07b
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1475
asset_id: foundry/concepts/capability-reference
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/concepts/capability-reference.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/062d60c9-ee0f-402e-a046-b4e67c3572d6
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://authoring-docs-microsoft.poolparty.biz/devrel/17d3b3f6-a66e-4c69-9774-14a73c38e669
platformId: daaa5900-743c-54a6-602a-8b298a2a14b6
---

# Microsoft Foundry capability reference - Microsoft Foundry | Microsoft Learn

This article lists Microsoft Foundry capabilities by area and links each one to its canonical documentation. Use it when you know roughly what you need and want to find the right article.

If you're deciding where to start instead, see [Microsoft Foundry product and capability map](capabilities).

Each entry is a capability family rather than an individual article, model, or API operation. Capabilities marked (preview) are offered under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) and aren't recommended for production workloads. Preview status can vary by feature, region, and API version, so check the linked article for current details.

## Build surfaces and developer tools

Where you author, test, and ship Foundry work.

| Capability | What it does |
| --- | --- |
| [Foundry portal](general-availability) | Web experience for exploring models, building prompt agents, running evaluations, and managing resources. |
| [Playgrounds](concept-playgrounds) | Try models, prompts, and agents interactively before you write code. |
| [Microsoft Foundry SDKs](../how-to/develop/sdk-overview) | Client libraries for Python, C#, JavaScript, and Java. |
| [Azure Developer CLI (azd) extensions](../agents/concepts/cli-agent-development) | Scaffold, run, test, and deploy agent projects from the command line. |
| [Visual Studio Code extension](../how-to/develop/get-started-projects-vs-code) | Work with Foundry projects, models, and agents inside VS Code. |
| [Foundry Agent Canvas](../agents/concepts/foundry-agent-canvas) | Visual surface for composing and inspecting agents. |
| [Coding agent integration](../agents/how-to/use-cli-with-coding-agents) | Build Foundry projects with AI coding agents such as GitHub Copilot, including Model Context Protocol access through the Foundry MCP Server. |
| [Templates and samples](../how-to/develop/ai-template-get-started) | Start from prebuilt application templates and GitHub samples. |
| [LangChain and LangGraph integration](../how-to/develop/langchain) | Use Foundry models, tools, memory, and tracing from LangChain and LangGraph apps. |

## Models

Model selection, deployment, and lifecycle.

| Capability | What it does |
| --- | --- |
| [Foundry Models catalog](foundry-models-overview) | Discover and compare models from Microsoft, OpenAI, Anthropic, Meta, and others, across models sold by Azure and models from partners and community. |
| [Model deployment](../foundry-models/how-to/create-model-deployments) | Create and manage model endpoints from the portal or code. |
| [Deployment types](../foundry-models/concepts/deployment-types) | Choose how capacity is served, including standard, global, data zone, provisioned throughput (PTU), batch, and priority processing. |
| [Managed compute](managed-compute-overview) (preview) | Deploy models to dedicated virtual machine capacity in your resource. |
| [Instant access models](instant-models) (preview) | Use selected models without provisioning a deployment first. |
| [Model router](../openai/concepts/model-router) | Route requests automatically to the best model for cost and quality. |
| [Model benchmarks and leaderboards](model-benchmarks) | Compare model quality, cost, and performance before you commit. |
| [Fine-tuning](../fine-tuning/fine-tune-cli) | Customize models on your own data, including synthetic data generation. |
| [Model versions and lifecycle](../foundry-models/concepts/model-versions) | Track versions, automatic updates, retirement schedules, and support policy. |
| [Healthcare AI models](../how-to/healthcare-ai/healthcare-ai-models) | Domain-specific models for medical imaging and reporting scenarios. |
| [Hugging Face models](../foundry-models/how-to/hugging-face-models) | Deploy open models from Hugging Face into Foundry. |
| [Fireworks on Foundry](../how-to/fireworks/enable-fireworks-models) | Use Fireworks models and import custom models. |
| [Quotas and region availability](../foundry-models/quotas-limits) | Understand and manage capacity limits by model and region. |

## Agents

Foundry Agent Service and the agent development lifecycle.

| Capability | What it does |
| --- | --- |
| [Foundry Agent Service](../agents/overview) | Build, run, and operate agents as a managed service. |
| [Prompt agents](../agents/quickstarts/prompt-agent) | Declarative agents defined by instructions, a model, and attached tools. |
| [Hosted agents](../agents/concepts/hosted-agents) | Run your own agent code or framework in a Foundry-managed runtime. |
| [Agent development lifecycle](../agents/concepts/development-lifecycle) | End-to-end build, test, deploy, and iterate workflow for agents. |
| [Agent identity](../agents/concepts/agent-identity) | Give agents a Microsoft Entra identity for authenticated access to resources. |
| [Workflows](../agents/concepts/workflow) | Coordinate multiple agents and steps into a single orchestrated process. |
| [Routines](../agents/concepts/routines) (preview) | Package repeatable agent procedures for reuse. |
| [Agent-to-agent (A2A)](../agents/how-to/tools/agent-to-agent) | Let agents call other agents across services and vendors. |
| [Responses API](../agents/quickstarts/responses-api) | Stateful API for model and agent interactions. |
| [Voice agents](../agents/how-to/build-voice-agent) | Add speech input and output to agents. |
| [Microsoft Agent 365 integration](../agents/concepts/agent-365-integration) | Manage and observe Foundry agents alongside Microsoft 365 agents. |
| [Continuous integration and deployment](../agents/quickstarts/set-up-cicd-hosted-agent) | Ship agents through automated pipelines. |
| [Agent debugging tools](../agents/how-to/agent-inspector) | Inspect and diagnose agent behavior locally and in the cloud. |

## Tools

Capabilities you attach to an agent so it can act.

| Capability | What it does |
| --- | --- |
| [Tool catalog](../agents/concepts/tool-catalog) | Browse every tool an agent can use, with setup requirements. |
| [Function calling](../agents/how-to/tools/function-calling) | Let an agent call your own functions with structured arguments. |
| [Code interpreter](../agents/how-to/tools/code-interpreter) | Run generated code in a sandbox to analyze data and produce files. |
| [File search](../agents/how-to/tools/file-search) | Ground answers in uploaded files through managed vector stores. |
| [Web search and Grounding with Bing](../agents/how-to/tools/web-overview) | Ground answers in current web results. |
| [Browser automation](../agents/how-to/tools/browser-automation) (preview) | Let an agent navigate and act on websites. |
| [Computer use](../agents/how-to/tools/computer-use) (preview) | Let an agent operate a virtual computer interface. |
| [Image generation](../agents/how-to/tools/image-generation) (preview) | Generate images from an agent. |
| [OpenAPI tool](../agents/how-to/tools/openapi) | Call any REST API described by an OpenAPI specification. |
| [Model Context Protocol (MCP)](../agents/how-to/tools/model-context-protocol) | Connect agents to MCP servers, including managed servers and your own. |
| [Azure Functions](../agents/how-to/tools/azure-functions) | Trigger serverless functions as agent actions. |
| [SharePoint and Fabric connectors](../agents/how-to/tools/connectors) (preview) | Reach enterprise data sources from an agent. |
| [Toolbox](../agents/concepts/toolbox-overview) | Bundle and manage the tools available to an agent, including tool search for large tool sets and a private catalog of organization-approved tools. |
| [Skills](../agents/how-to/tools/skills) (preview) | Package reusable agent behavior beyond a single tool call. |
| [Foundry Tools: Speech, Language, Translator](../agents/how-to/tools/azure-ai-speech) | Add speech, language understanding, PII detection, and translation. |

## Knowledge and retrieval

How agents and applications ground responses in your data.

| Capability | What it does |
| --- | --- |
| [Retrieval-augmented generation (RAG)](retrieval-augmented-generation) | Patterns for grounding model responses in your own content. |
| [Azure AI Search integration](../agents/how-to/tools/ai-search) | Use Azure AI Search indexes as agent knowledge. |
| [Vector stores](../agents/concepts/vector-stores) | Managed storage and indexing for file search. |
| [Foundry IQ](../agents/concepts/what-is-foundry-iq) | Agentic retrieval over a knowledge base, including private networking. |
| [Fabric IQ](../agents/how-to/tools/fabric-iq) (preview) | Reason over Microsoft Fabric data and semantic models. |
| [Work IQ](../agents/how-to/tools/work-iq) (preview) | Reason over Microsoft 365 work data. |
| [Memory](../agents/concepts/what-is-memory) (preview) | Give agents persistent memory across sessions. |

## Observability

Understand what your agents and models are doing in production.

| Capability | What it does |
| --- | --- |
| [Foundry Observability](observability) | Unified monitoring, tracing, and evaluation for agents and models. |
| [Tracing](../observability/concepts/trace-agent-concept) | Capture and replay agent execution traces, including client-side spans. |
| [Agent monitoring dashboard](../observability/how-to/how-to-monitor-agents-dashboard) | Track agent health, usage, quality, and cost over time. |
| [Model deployment monitoring](../foundry-models/how-to/monitor-models) | Watch latency, throughput, and errors for model endpoints. |
| [End-user feedback logging](../observability/how-to/log-end-user-feedback) | Collect and analyze feedback signals from your application. |
| [Notification Center](concept-notification-center) | See service and resource notifications in the portal. |
| [External agent registration](../agents/how-to/register-external-agent) (preview) | Bring agents that run outside Foundry into Foundry observability. |
| [Diagnostic logging](../how-to/diagnostic-logging) | Send platform logs and metrics to Azure Monitor. |

## Evaluation and optimization

Measure and improve quality, safety, and cost.

| Capability | What it does |
| --- | --- |
| [Evaluations](../how-to/evaluate-generative-ai-app) | Score generative AI apps and agents from the portal, SDK, or CI/CD. |
| [Built-in evaluators](built-in-evaluators) | Use general purpose, similarity, RAG, agent, safety, and rubric evaluators. |
| [Custom evaluators](evaluation-evaluators/custom-evaluators) | Define your own scoring logic. |
| [Agent evaluation](../observability/how-to/evaluate-agent) | Evaluate agent trajectories, tool calls, and task completion. |
| [Continuous evaluation](../observability/how-to/cloud-evaluation) | Evaluate production traffic on an ongoing basis. |
| [Evaluation datasets](../observability/how-to/evaluation-dataset-synthetic) | Generate synthetic test data or build datasets from agent traces when you don't have labeled examples. |
| [Human evaluation](../observability/how-to/human-evaluation) | Collect structured human judgments and annotate traces. |
| [Prompt optimizer](../observability/how-to/prompt-optimizer) | Improve agent instructions automatically from evaluation results. |
| [Agent optimizer](../agents/concepts/agent-optimizer-overview) (preview) | Tune hosted agent instructions and skills against a target dataset. |
| [AI red teaming](ai-red-teaming-agent) | Run automated adversarial scans locally or in the cloud. |
| [Evaluations in CI/CD](../how-to/evaluation-github-action) | Gate releases with evaluations in GitHub Actions or Azure DevOps. |

## Trust and safety

Guardrails, content safety, and responsible AI.

| Capability | What it does |
| --- | --- |
| [Guardrails and controls](../guardrails/guardrails-overview) | Filter and control content across models and agents. Includes harm category filters, Prompt Shields for jailbreak and prompt injection, groundedness detection, sensitive data (PII) detection, and protected material detection. |
| [Custom filtering](../guardrails/how-to-create-guardrails) | Extend the built-in filters with your own block lists and custom categories. |
| [Task adherence](../guardrails/task-adherence) | Detect when an agent strays from its assigned task. |
| [Guided Guardrail](../guardrails/guided-set-up) (preview) | Configure guardrails through a guided setup experience. |
| [Third-party guardrail integrations](../guardrails/third-party-integrations) | Plug partner safety systems into Foundry intervention points. |
| [Responsible AI transparency notes](../responsible-ai/agents/transparency-note) | Understand intended uses, limitations, and data handling. |
| [Customer Copyright Commitment](../responsible-ai/openai/customer-copyright-commitment) | Review Microsoft's copyright commitment for covered services. |

## Manage, secure, and govern

Platform administration for Foundry at scale.

| Capability | What it does |
| --- | --- |
| [Foundry resources and projects](../how-to/create-projects) | Organize work with Foundry resources and projects. |
| [Foundry control plane](../control-plane/overview) | Govern agents, models, and tools across your estate. |
| [Fleet monitoring](../control-plane/monitoring-across-fleet) | Track health and performance across many agents. |
| [Token limit enforcement](../control-plane/how-to-enforce-limits-models) | Cap model consumption per agent, project, or team. |
| [AI gateway integration](../agents/how-to/ai-gateway) | Front Foundry with Azure API Management for routing and policy. |
| [Role-based access control](rbac-foundry) | Assign Foundry roles and scope permissions. |
| [Keyless authentication](../foundry-models/how-to/configure-entra-id) | Use Microsoft Entra identities instead of API keys. |
| [Network isolation](../agents/concepts/networking-options) | Use private endpoints, managed virtual networks, and network security perimeter. |
| [Customer-managed keys](encryption-keys-portal) | Encrypt data with keys you control. |
| [Azure Policy support](../how-to/model-deployment-policy) | Apply built-in and custom policy definitions to Foundry resources. |
| [Cost management](manage-costs) | Plan, monitor, and optimize Foundry spend. |
| [High availability and disaster recovery](../how-to/high-availability-resiliency) | Design for resiliency and recover from outages or data loss. |
| [Azure Government support](foundry-azure-government) | Run Foundry workloads in Azure Government. |
| [Infrastructure as code](../how-to/create-resource-template) | Deploy Foundry with Bicep, Terraform, or the Azure CLI. |

## APIs and SDKs

Programmatic surfaces for building on Foundry.

| Capability | What it does |
| --- | --- |
| [Foundry API reference](https://ai.azure.com/api-reference/) | Browse the interactive reference for Foundry data plane operations. |
| [Foundry Models endpoints](../foundry-models/concepts/endpoints) | Call deployed models over a consistent inference endpoint. |
| [Foundry v1 REST API](/en-us/rest/api/microsoft-foundry/?view=rest-microsoft-foundry-v1&amp;preserve-view=true) | Use the OpenAI-compatible surface for chat, responses, embeddings, files, and fine-tuning. |
| [Resource management API](/en-us/azure/templates/microsoft.cognitiveservices/accounts?pivots=deployment-language-bicep) | Create and configure Foundry resources with ARM, Bicep, or the Azure CLI. |