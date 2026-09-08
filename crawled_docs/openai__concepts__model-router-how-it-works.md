<!-- Title: How model router works | Category: Models/Explore Foundry Models/Model Router/How model router works | URL: openai/concepts/model-router-how-it-works -->

---
layout: Conceptual
title: How model router works in Microsoft Foundry - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-router-how-it-works
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
author: PatrickFarley
learn_banner_products:
- azure
manager: mcleans
ms.author: pafarley
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how model router analyzes prompts, scores candidate models, and routes requests to optimize cost, quality, and latency in Microsoft Foundry.
ms.date: 2026-04-22T00:00:00.0000000Z
ms.subservice: foundry-model-inference
ms.topic: concept-article
ms.custom:
- classic-and-new
- doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: b6e4f2f4-2407-b3c4-ba2a-d622015363ff
document_version_independent_id: 505e2028-43d8-a084-9372-7f8b9ec8f0e8
updated_at: 2026-08-20T22:12:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/openai/concepts/model-router-how-it-works.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/c31521aa138cabfa2189b07492e113b8652e769e/articles/foundry/openai/concepts/model-router-how-it-works.md
git_commit_id: c31521aa138cabfa2189b07492e113b8652e769e
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1538
asset_id: foundry/openai/concepts/model-router-how-it-works
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/openai/concepts/model-router-how-it-works.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/c6f99e62-1cf6-4b71-af9b-649b05f80cce
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3f56b378-07a9-4fa1-afe8-9889fdc77628
platformId: 6ccea7a7-1634-941a-3f3c-f4219594fbdc
---

# How model router works in Microsoft Foundry - Microsoft Foundry | Microsoft Learn

Model router is a purpose-built, trained machine-learning model that analyzes each prompt in real time and routes it to the most suitable large language model (LLM). It's a lightweight ML model designed to predict which model performs best for a given prompt at minimal latency.

This article explains the capabilities, routing modes, and best practices that power model router. For supported models and version information, see the [model router overview](model-router). For deployment and usage steps, see [Use model router](../how-to/model-router).

## Prerequisites

- Familiarity with LLMs and the [Chat Completions API](/en-us/azure/ai-foundry/openai/how-to/chatgpt)
- Understanding of the [model router overview](model-router)

## Model router as an optimization layer

Choosing the right model for every prompt is difficult to do manually. Traditional optimization often requires teams to compare individual models, integrate each candidate, and maintain custom routing logic. Model router encapsulates per-request model selection in one deployment, which reduces the model-navigation work required to test a multimodel architecture.

Model router is a purpose-built ML model trained on hundreds of thousands of examples across diverse scenarios, from simple prompts to complex agentic workflows. Rather than relying on static rules or manual selection, it matches each prompt to the best-suited eligible model based on the configured routing mode and model subset.

Managed routing doesn't remove the need for evaluation. Compare model router with a meaningful workload baseline, and reevaluate after you change a routing mode or model subset. For evaluation guidance, see [Evaluate model router for your workload](../how-to/evaluate-model-router).

## How requests are routed

When a prompt arrives, model router processes it through three steps:

1. Understand the prompt. The router analyzes the full request — including system message, user message, tool definitions, and conversation history — to determine what the prompt is asking for and how challenging it is.
2. Select the best model. Based on the analysis, the router estimates which model in the pool delivers the best result for this specific prompt. It also factors in any routing mode configured. These can be Balanced, Cost, or Quality modes.
3. Route and respond. The prompt is forwarded to the selected model. The entire routing decision adds minimal overhead — a negligible fraction of the LLM inference time.

## Key design deliverables

- **Efficiency.** The router is optimized for fast inference, keeping overhead minimal regardless of prompt complexity.
- **Adaptability.** The router adjusts automatically as the set of supported models evolves, without requiring changes to your application.
- **Transparency.** The selected model is always disclosed in the API response via the model field, so you can see exactly which model handled each request.

Model router analyzes prompts to make routing decisions but does not store them. It honors data-zone boundaries, routing only to models approved within your deployment’s geographic and compliance constraints.

## Model overview

Model router is a purpose-built ML model optimized for fast inference. It is not an LLM itself — it is designed to make routing decisions with minimal latency overhead.

We train the router on a large, diverse dataset spanning hundreds of thousands of examples across many domains. These include question answering, code generation, mathematical reasoning. Summarization, conversations, and agentic workflows are also covered. We continuously expand the training data to keep pace with new models and capabilities.

We train model router to handle production-level complexity, including agentic and tool-calling workloads that require structured invocations and multi-step workflows.

## Intelligent prompt routing

One of model router’s key capabilities is understanding prompt difficulty. Not all coding questions are equally hard; not all summaries require the same reasoning depth.

The router distinguishes between prompts that any capable model can handle well — ideal for fast, cost-efficient models — and prompts that demand deeper reasoning, nuanced judgment, or sophisticated tool orchestration, where frontier models justify their higher cost.

This difficulty-aware routing is what allows model router to save costs without sacrificing quality. It only pays for frontier-level capability when the prompt genuinely needs it.

### Handling real-world complexity

Production prompts are rarely tidy single-sentence questions. The router handles:

- Long contexts spanning thousands of tokens, where the routing signal might be distributed across the entire input.
- Multi-turn conversations, where earlier turns provide context but the latest user message carries the most routing-relevant signal.
- Agentic and tool-calling scenarios, where the model must produce structured tool invocations, a capability the router is optimized for.

### Adapting to model subsets

When you customize the model pool using model subsets, the router automatically recalibrates its routing decisions to optimize across the available models.

## Routing modes in depth

Model router exposes three routing modes that control the cost-quality tradeoff. For the mode descriptions and configuration steps, see the [model router overview](model-router#routing-mode) and the [how-to guide](../how-to/model-router#optional-change-the-routing-mode).

- **Balanced (default):** Optimizes for the best combination of quality and cost. Most workloads should start here.
- **Cost:** Aggressively favors cheaper models, accepting slightly lower quality on complex prompts.
- **Quality:** Always selects the highest-quality model for each prompt, regardless of cost.

## Observe routing behavior

Each routing mode produces a different distribution of traffic across underlying models. You can observe your routing distribution using Azure Monitor:

- In **Balanced mode**, traffic is distributed more broadly across the model pool based on prompt complexity.
- In **Cost mode**, most traffic routes to smaller, cheaper models, escalating to larger models only when the prompt requires it.
- In **Quality mode**, frontier and high-capability models handle most traffic.

## Example

The [ModelRouter-Distribution repository](https://github.com/guygregory/ModelRouter-Distribution) lets you run routing experiments against your own prompt corpus to preview how each mode distributes your workload before choosing.

![Bar chart that shows routing distribution across model tiers for Cost, Balanced, and Quality modes, with Cost mode heavily favoring nano-class models and Quality mode favoring frontier models.](../media/model-router-how-it-works/routing-distribution-colors.png)

| Color | Mode | Description |
| --- | --- | --- |
| 🟥 | **Cost mode** | First bar — routes to cheapest models by default |
| 🟦 | **Balanced mode** | Second bar — spreads across cheap and mid-tier |
| 🟠 | **Quality mode** | Third bar — favors frontier and reasoning models |

*Based on a point-in-time experiment; actual models and distribution will vary. Source: [ModelRouter-Distribution](https://github.com/guygregory/ModelRouter-Distribution).*

## When to use model router vs. direct deployment

Choosing between model router and a direct model deployment depends on your workload characteristics, compliance requirements, and operational preferences.

### When to use model router

- **Your workload is diverse.** A mix of simple and complex prompts benefits most from intelligent routing. The router matches each prompt to the best-suited model, delivering quality comparable to — or exceeding — a single general-purpose model.
- **Cost optimization matters.** Smaller, cheaper models handle simple prompts while frontier models are reserved for complex tasks. The savings are validated on both in-domain and out-of-domain benchmarks.
- **Latency and responsiveness are critical.** For high-traffic, user-facing scenarios like chatbots and customer support, model router routes simpler prompts to faster models. The result is lower average latency across your traffic mix compared to always calling a frontier model.
- **You want a single endpoint.** One deployment, one API call, one rate limit — simpler operations.
- **You're building agents.** Model router supports tools and can select fast models for classification subtasks and reasoning models for analysis — dynamically, per step.
- **You want automatic failover.** Built-in resilience with no extra configuration.
- **You want to simplify model lifecycle management.** Each router version maintains a curated set of underlying models. Deprecated models are replaced transparently. With auto-update enabled, your endpoint and application code don't change as models evolve.

### When to use direct deployment

- **You need the same model on every request.** Model router always reveals which model handled a request (via the model response field), but it might select different models for different prompts. If your workflow requires same model across all— pin to a specific model.

### The hybrid pattern

The most effective architecture uses both:

- **Model router** as the default path for general API traffic, capturing cost savings across the majority of requests.
- **Direct deployments** for specialized, compliance-mandated, or parameter-sensitive workloads.

This approach gives you broad optimization and precise control where you need it.

## Best practices

Follow these recommendations to get the most from model router.

- **Start with Balanced mode, then tune.** Let traffic flow through Balanced mode, observe the routing distribution in Azure Monitor for a few weeks, and then adjust. Switch latency-insensitive batch pipelines to Cost mode and promote critical-path reasoning tasks to Quality mode.
- **Change one routing lever at a time.** Keep the workload dataset, baseline, and application configuration fixed when you change the routing mode or model subset. Rerun the evaluation so that you can attribute changes in quality, cost, and latency to that configuration change.
- **Use model subset as your compliance gate.** Get model approval from your security team, encode it in the subset, and know that new models won't appear without explicit opt-in.
- **Monitor routing distribution.** In the Azure portal, go to **Monitoring &gt; Metrics** for your resource, filter by your model router deployment, and split by underlying model. This view shows exactly where your tokens go.
- **Design for the smallest context window — or raise the floor.** If your prompts consistently exceed the context window of the smallest model in the pool, use model subset to include only models that support your required context length.
- **Select at least two models for failover.** A single-model subset defeats the purpose of routing and disables automatic failover.

### Practices to avoid

- **Don't use single-model subsets.** You lose routing optimization, cost savings, and failover — effectively using model router as an expensive passthrough.
- **Don't ignore the model field in responses.** This field is your primary observability signal. Log it, build dashboards, and track which models are handling your traffic.