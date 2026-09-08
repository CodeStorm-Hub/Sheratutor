<!-- Title: Overview | Category: Models/Offers, deployment types, and pricing/Overview | URL: concepts/deployments-overview -->

---
layout: Conceptual
title: Deployment overview for Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/concepts/deployments-overview
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
author: alvinashcraft
learn_banner_products:
- azure
manager: mcleans
ms.author: aashcraft
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: 'Learn about deployment options for Microsoft Foundry Models: serverless API deployments for Foundry Models and managed compute for open-source and custom models.'
ms.subservice: foundry-model-inference
ms.topic: concept-article
ms.date: 2026-08-06T00:00:00.0000000Z
ai-usage: ai-assisted
locale: en-us
document_id: 7f5e8541-5673-8e9c-0b7a-b8d80908430b
document_version_independent_id: a878edb1-3802-f246-4b36-d901459723b8
updated_at: 2026-08-06T17:13:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/concepts/deployments-overview.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/4a9bf55fb66acf9302d66e8a2732464b02fd2d8d/articles/foundry/concepts/deployments-overview.md
git_commit_id: 4a9bf55fb66acf9302d66e8a2732464b02fd2d8d
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../toc.json
word_count: 1212
asset_id: foundry/concepts/deployments-overview
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/concepts/deployments-overview.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/cbd33d8f-e9af-440e-8f1e-fc69e07b902b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3820371b-086e-47fb-9d1f-b215f569127a
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
platformId: 38dfa337-9335-968b-4a96-9046bd7b92bc
---

# Deployment overview for Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn

Microsoft Foundry Models is the hub for discovering and deploying a wide range of AI models for generative AI applications. To make a model available for inference requests, you deploy it. Foundry offers two deployment options depending on the model type and your infrastructure needs.

Tip

You don't always need to create a deployment. With [instant access (preview)](instant-models), you call supported models by name and start running inference immediately — no deployment required.

## Deployment options

Foundry provides two deployment options:

- **Serverless API** — For Foundry Models, including [Foundry Models sold by Azure](../foundry-models/concepts/models-sold-directly-by-azure) and [select Models from partners and community](../foundry-models/concepts/models-from-partners). This option is the preferred and most capable deployment path. It includes the standard, provisioned throughput, batch, and developer deployment types.
- **Managed compute (preview)** — For open-source, partner, and custom models that run on dedicated GPU capacity that Foundry manages for you.

Foundry selects the appropriate deployment option based on the model you choose.

If you only need to try a supported model, you can skip deployment entirely and use [instant access (preview)](instant-models), which calls models by name without creating a Serverless API or managed compute deployment.

[![Diagram that shows choosing between instant access, Serverless API deployment types by launch order, and managed compute.](media/deployments-overview/deployment-options-hierarchy.png)](media/deployments-overview/deployment-options-hierarchy.png#lightbox)

For a full capability comparison, see Deployment option comparison.

## Serverless API

Serverless API is **the preferred deployment option** in Foundry. It supports the widest range of capabilities and deployment types.

### Which models use serverless API deployments?

All Foundry Models, including [Foundry Models sold by Azure](../foundry-models/concepts/models-sold-directly-by-azure) and [select Models from partners and community](../foundry-models/concepts/models-from-partners), use serverless API deployments. Foundry Models sold by Azure include all Azure OpenAI models and selected models from top providers that are billed through your Azure subscription, covered by Azure service-level agreements, and supported by Microsoft. Models from partners and community that use serverless API deployments include Anthropic models and specific models from partners like Mistral, Cohere, and Meta.

### Serverless API capabilities

Serverless API deployments support:

- **Multiple deployment types (or deployment SKUs)** — Global Standard, Data Zone Standard, Standard (single region), provisioned, batch, and more. Each type controls where data is processed and how you pay. For details, see [Deployment types for Microsoft Foundry Models](../foundry-models/concepts/deployment-types).
- **Data processing flexibility** — Choose regional, data zone (US, EU, or APAC), or global processing based on your compliance requirements.
- **Content filtering** — Built-in Azure AI Content Safety filters with customizable configurations.
- **Keyless authentication** — Microsoft Entra ID (recommended) and key-based authentication.
- **Private networking** — Virtual network integration for secure access.
- **Provisioned throughput** — Reserve capacity with provisioned throughput units (PTUs) for predictable, low-latency performance. For details, see [Provisioned throughput](../openai/concepts/provisioned-throughput).

### Resource requirements

Serverless API deployments are available in:

- **Foundry resources** — The primary resource type for new Foundry projects. No AI Hub required.
- **Azure OpenAI resources** — If you use Azure OpenAI resources, the model catalog shows only Azure OpenAI models for deployment. Upgrade to a Foundry resource for access to the full set of Foundry Models.

To get started with serverless API deployment, see [Deploy Microsoft Foundry Models in the Foundry portal](../foundry-models/how-to/deploy-foundry-models) or [Deploy models using Azure CLI and Bicep](../foundry-models/how-to/create-model-deployments).

## Managed compute deployment (preview)

Note

Managed compute in Foundry is currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Managed compute in Foundry (preview) is a managed GPU platform-as-a-service (PaaS) that hosts open-source and custom-weight models on dedicated GPU capacity. You access managed compute deployments through the same Foundry project endpoint as other deployment types, with no virtual machines, clusters, or serving runtimes to own. Foundry sizes the deployment, provisions the accelerators, and keeps the runtime patched.

Important

Managed compute supports open-source, partner, industry, and custom models. Managed compute deployments are served on the **unified Foundry project endpoint**, using the same authentication, networking, and SDK surface.

### Which models use managed compute?

You can deploy models from the Hugging Face Collection by using managed compute. Examples include:

- Qwen models
- NVIDIA Nemotron models
- Selected Meta models
- Selected Mistral models

Microsoft Foundry's catalog includes a large and growing selection of open-source and partner models. For the current catalog, see the [model catalog](https://ai.azure.com/explore/models).

### Managed compute capabilities

Managed compute (Preview) supports:

- **Unified Foundry endpoint and authentication** — Use the same project endpoint, API keys, Microsoft Entra ID, and private networking as pay-per-token and provisioned throughput deployments. Inference routes use `<endpoint>/managed-deployments/<deployment-name>/`. Chat-completions-compatible runtimes also work on the standard `/openai/v1/` route with the OpenAI SDK.
- **Model-instance sizing** — Deployments are sized in model-centric terms. You don't need to pick virtual machine SKUs, because Foundry chooses GPUs per instance based on model size, architecture, context length, and whether the workload is optimized for latency or throughput.
- **Optimized inference runtimes** — Microsoft-curated vLLM, SGLang, and NVIDIA NIM containers with continuous batching and tensor parallelism.
- **Accelerator families** — A100 (80 GB), H100 (80 GB), and MI300X (192 GB).
- **Auto-scaling and scale-to-zero** — Auto-scale from live traffic or scale manually. Configure an idle timeout so the deployment scales to zero when no traffic arrives, making billing stop immediately.
- **Microsoft-managed runtimes** — Microsoft owns serving runtimes, base container images, and security patches. Updates are applied to live deployments automatically.
- **Observability metrics** — Each deployment emits API call count by status code and response-time percentiles. Chat-completion models also emit input and output token counts, time-to-first-token (TTFT) percentiles, and total response-time percentiles, grouped by time.

### Billing and quota

Managed compute billing is hourly per accelerator SKU, with throughput per GPU as the underlying billing unit. Auto-scale and scale-to-zero align cost with actual traffic so that billing stops immediately when instances scale down.

Quota is granted per accelerator SKU per region through the **Foundry quota process** and is **separate from Azure VM quota**. Azure virtual machines are an infrastructure-as-a-service (IaaS) offering with regional SKUs; managed compute is a PaaS offering that leads with Global and Data Zone processing. Existing Azure VM quota can't be applied to a managed compute deployment.

Managed compute is currently available for global deployment. For rate estimates, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Get started

To get started with managed compute deployment, see [Deploy open-source models with managed compute](../how-to/deploy-models-managed).

## Deployment option comparison

Use Serverless API whenever possible. The following table compares capabilities across the two deployment options:

Note

Instant access (preview) isn't a deployment option in this comparison. It calls supported models by name without creating a Serverless API or managed compute deployment.

| Capability | Serverless API | Managed compute |
| --- | --- | --- |
| Which models can be deployed? | All Foundry Models, including [Foundry Models sold by Azure](../foundry-models/concepts/models-sold-directly-by-azure) and [select Models from partners and community](../foundry-models/concepts/models-from-partners) | Open-source and partner models from the model catalog, NVIDIA NIM, and industry models |
| Deployment resource | Foundry resource | Foundry project |
| Requires AI Hub | No | No |
| Data processing options | Regional, data zone, global | Global |
| Private networking | Yes | Yes |
| Content filtering | Built-in and customizable | Not available in public preview |
| Keyless authentication | Yes (Microsoft Entra ID and key-based) | Yes (Microsoft Entra ID and key-based) |
| Billing | Token usage or [provisioned throughput units](../openai/concepts/provisioned-throughput) | Hourly per accelerator SKU |

Tip

For detailed pricing information, see [Plan and manage costs for Microsoft Foundry](manage-costs).