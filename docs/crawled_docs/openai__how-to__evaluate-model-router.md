<!-- Title: Evaluate model router | Category: Models/Explore Foundry Models/Model Router/Evaluate model router | URL: openai/how-to/evaluate-model-router -->

---
layout: Conceptual
title: Evaluate model router for your workload - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/evaluate-model-router
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
description: Learn how to evaluate model router against a baseline for response quality, estimated cost, and latency before you send production traffic.
ms.date: 2026-08-20T00:00:00.0000000Z
ms.subservice: foundry-model-inference
ms.topic: how-to
ai-usage: ai-assisted
locale: en-us
document_id: eecb2fb4-e5c0-2d68-2db8-72dd43f8b2bb
document_version_independent_id: 829a8165-9594-9773-18e9-5177d72f9667
updated_at: 2026-08-20T22:12:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/openai/how-to/evaluate-model-router.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/c31521aa138cabfa2189b07492e113b8652e769e/articles/foundry/openai/how-to/evaluate-model-router.md
git_commit_id: c31521aa138cabfa2189b07492e113b8652e769e
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1063
asset_id: foundry/openai/how-to/evaluate-model-router
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/openai/how-to/evaluate-model-router.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://authoring-docs-microsoft.poolparty.biz/devrel/029d2366-5c16-4816-8cb8-dadeaf730762
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://authoring-docs-microsoft.poolparty.biz/devrel/082dcafd-01b6-47e9-8abe-5795dbab1ea9
platformId: 8f01073a-20aa-3abb-4059-627d39a2bfb0
---

# Evaluate model router for your workload - Microsoft Foundry | Microsoft Learn

Application optimization is like hill climbing. It starts with a baseline, measures the outcomes that matter, changes one lever, and retains the change only when it moves your workload closer to its quality, cost, latency, and policy requirements.

Model selection can make this process slow. Model router shortens that journey. Evaluation shows whether that benefits your workload. It also helps you decide whether to adjust the routing mode, constrain the model subset, or retain a direct model deployment for specific requests.

Tip

Use the [Model Router Auto Evaluation toolkit](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation) to automate the comparison. Review the toolkit's [evaluation methodology](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation/blob/main/docs/methodology.md) to understand how it calculates and aggregates the results.

## Prerequisites

- A model router deployment. To create one, see [Use model router](model-router#deploy-a-model-router-model).
- A baseline model deployment that represents your current solution or another model that you want to compare.
- A set of representative prompts from your workload. Remove secrets, personal data, and other sensitive information before you use production prompts.
- For automated quality scoring, a judge model deployment that meets the requirements in the toolkit quickstart.

## Define the deployment decision

Before you compare deployments, identify the decision that the results need to support. For example, you might be deciding whether to replace a direct model deployment, which routing mode to use, or which models your routing pool should include.

Workload-specific acceptance criteria provide a more useful basis for that decision than a general pass threshold. Consider the following dimensions:

| Dimension | Consider for your workload |
| --- | --- |
| **Quality** | The minimum acceptable response score or win rate, including requirements for accuracy, completeness, clarity, and helpfulness. |
| **Cost** | The maximum estimated cost per request or the minimum savings relative to the baseline. |
| **Latency** | The acceptable median and tail latency, such as p90 or p95, for the user experience. |
| **Policy** | The models, regions, and deployment configurations that your organization permits. |

The acceptable tradeoff depends on the application. A high-volume classification workload might tolerate a small quality difference in exchange for lower cost. A workload that produces high-impact recommendations might require equivalent or better quality before cost savings matter.

## Design a fair workload comparison

Evaluate the configuration that you expect to use in production. Balanced mode and the fully supported model set are useful starting points unless policy, regional availability, or workload requirements call for a different configuration.

The following practices help make the comparison useful:

- **Use a meaningful baseline.** Compare model router with the model that currently serves the workload or the direct deployment that you would otherwise adopt.
- **Represent the traffic mix.** Include common requests, difficult edge cases, long inputs, and high-impact tasks. Group prompts by workload category so that an aggregate result doesn't hide a category-specific regression.
- **Keep the application configuration consistent.** Use the same prompts, system instructions, output limits, and application processing where model capabilities allow. Otherwise, a configuration difference might look like a routing effect.
- **Plan for human review.** Automated scores are estimates. Qualified reviewers should inspect high-impact, regulated, or domain-specific results and cases where the comparison is inconclusive.
- **Treat small or unbalanced samples cautiously.** Add representative prompts when important categories contain too few examples or results remain uncertain.

For current input schemas and dataset preparation guidance, see [Create a custom evaluation dataset](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation/blob/main/docs/how-to-custom-dataset.md).

## Run a comparison

To configure your deployments and run the comparison, follow the toolkit [quickstart](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation/blob/main/QUICKSTART.md). You can explore the report with mock data before you connect your deployments.

Use the repository guidance as the source of truth for current commands, input formats, judging behavior, statistical methods, pricing calculations, and report fields. For details about why the toolkit calculates its results as it does, see the [evaluation methodology](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation/blob/main/docs/methodology.md).

Record the context for each run, including:

- The baseline deployment.
- The model router version, routing mode, and model subset.
- The prompt dataset and relevant application settings.
- The acceptance criteria used to interpret the run.

This context makes later comparisons reproducible and helps you attribute a change in results to the configuration you tested.

## Read the tradeoffs together

A lower estimated cost doesn't justify a quality regression in an important category. Similarly, a favorable average latency can conceal slow requests that affect users. Compare quality, cost, and latency against the acceptance criteria for the workload rather than reducing the decision to one aggregate score.

Consider both workload-level and category-level results. Model distribution can also help explain why quality, cost, or latency changed by showing which underlying models handled different parts of the workload.

For metric and report definitions, see [Interpret evaluation results](https://github.com/microsoft-foundry/Model-Router-Auto-Evaluation/blob/main/docs/how-to-interpret-results.md).

## Choose what to try next

Evaluation is most useful when it informs the next product decision. The following examples are considerations, not universal recommendations:

| Observation | What to consider next |
| --- | --- |
| Quality falls below workload requirements | Try [Quality mode](model-router#optional-change-the-routing-mode) or constrain the [model subset](model-router#optional-route-to-a-model-subset). |
| Quality remains acceptable but savings are limited | Try Cost mode, and recheck high-impact categories for regressions. |
| One category performs differently from the rest | Evaluate that category separately before you change settings for the entire workload. |
| Results remain uncertain | Add representative prompts, review inconclusive cases, and repeat the comparison. |
| Results rely on an unavailable or disallowed model | Select a subset that's available in the deployment region and permitted by organizational policy. |
| Tail latency exceeds the requirement | Validate the deployment under production-like traffic and concurrency before adoption. |

Change one routing lever at a time and rerun the same representative prompt set. Keeping the baseline and application configuration fixed helps you determine whether a routing mode or model subset caused the change.

## Validate under production-like traffic

A controlled comparison is an important signal, but it doesn't reproduce every production condition. Before broad adoption, consider a limited production test that monitors:

- Quality signals for important workload categories.
- Estimated and actual usage costs.
- Median and tail latency under expected concurrency.
- Errors, failover behavior, and selected-model distribution.
- Feedback from qualified reviewers and application users.

Retain a direct model deployment for requests that require deterministic model selection, or when the evaluation doesn't support routing those requests.

## Monitor and repeat the evaluation

Treat the selected configuration as a new baseline rather than the end of the optimization process. Repeat the evaluation when the traffic mix, routing mode, model subset, supported models, application behavior, or pricing changes.

This measure-change-reevaluate loop is the practical value of the hill-climbing mental model: model router reduces the model-selection work inside the loop, while evaluation shows whether each change moves the workload in the intended direction.