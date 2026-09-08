<!-- Title: Monitor model router | Category: Models/Explore Foundry Models/Model Router/Monitor model router | URL: openai/how-to/monitor-model-router -->

---
layout: Conceptual
title: Monitor model router in Microsoft Foundry - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/monitor-model-router
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
description: Learn how to inspect preview per-request routing metadata for model router, including routing attempts, status, and latency, in Microsoft Foundry.
ms.date: 2026-09-01T00:00:00.0000000Z
ms.subservice: foundry-model-inference
ms.topic: how-to
ai-usage: ai-assisted
locale: en-us
document_id: 383db015-eba5-554c-7596-b919ce205da5
document_version_independent_id: 653d6961-0c97-7a81-9e44-018b61a5a406
updated_at: 2026-09-02T22:17:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/openai/how-to/monitor-model-router.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/69e912118f8ddcc742dc027dc0a00f7607e1df3d/articles/foundry/openai/how-to/monitor-model-router.md
git_commit_id: 69e912118f8ddcc742dc027dc0a00f7607e1df3d
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 729
asset_id: foundry/openai/how-to/monitor-model-router
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/openai/how-to/monitor-model-router.md
platformId: 2a99ac5b-400b-31ef-f495-f3375d29e605
---

# Monitor model router in Microsoft Foundry - Microsoft Foundry | Microsoft Learn

Observability helps you understand how model router handles requests, verify routing behavior, and investigate latency, errors, and fallback. Request-level signals complement aggregate metrics and logs, giving developers and operators context to evaluate application performance.

This article covers the per-request routing metadata preview for the Chat Completions API. The metadata identifies the serving model and describes routing attempts for an individual request. For aggregate metrics and logs, see [Monitor model deployments](../../foundry-models/how-to/monitor-models).

## Prerequisites

- Python 3.9 or later.
- The `openai>=1.75.0` and `python-dotenv` packages. Install them by running `pip install "openai>=1.75.0" python-dotenv`.
- A model router deployment that you can access through an Azure OpenAI endpoint.
- The endpoint and API key for your Azure OpenAI resource. The complete sample reads them from the `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` environment variables.
- Azure OpenAI API version `2024-10-21`.

## Enable per-request routing metadata

After your application reads the endpoint and API key into `endpoint` and `api_key`, create the client with the preview feature header:

```python
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,
    api_version="2024-10-21",
    default_headers={"Foundry-Features": "ModelRouterControls=V1Preview"},
)
```

The `Foundry-Features: ModelRouterControls=V1Preview` header requests per-request routing metadata. Because this feature is in preview, the metadata presence and response schema can vary by request and service version.

## Send a Chat Completions request

Use the model router deployment name to send a request. The response includes the completion and, when available, the per-request routing metadata:

```python
response = client.chat.completions.create(
   model=deployment,
   messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {
         "role": "user",
         "content": "In one sentence, name the most popular tourist destination in Seattle.",
      },
   ],
)
```

## Understand routing metadata

The following `model_selection_details` fragment illustrates a request with two ordered model attempts:

```json
{
   "model_selection_details": {
      "model_router_details": {
         "mode": "balanced",
         "routing_trace": [
            {
               "latency_ms": 19,
               "attempts": [
                  {
                     "model": "example-model-a",
                     "result": {
                        "status": 404,
                        "error": {
                           "code": "NotFound",
                           "message": "The request failed."
                        }
                     }
                  },
                  {
                     "model": "example-model-b",
                     "result": {
                        "status": 200
                     }
                  }
               ]
            }
         ]
      }
   }
}
```

- `mode` is the routing mode returned for the request.
- `routing_trace` contains the routing entries returned for the request.
- `latency_ms` is the latency reported for a routing-trace entry.
- `attempts` lists model attempts in order.
- Each attempt contains a model and an HTTP status in `result.status`.
- A failed attempt can include an optional `error` with a code and message.

## Extract routing and fallback information

After the Chat Completions request returns `response`, inspect the serving model and model selection details:

```python
print(f"\nRouted to model: {response.model}")
print("--- Model Selection Details ---")
model_selection_details = getattr(response, "model_selection_details", None)
if not model_selection_details:
    print("No model selection details were returned.")
else:
    model_router_details = model_selection_details.get("model_router_details", {})
    print(f"Routing mode: {model_router_details.get('mode', 'unknown')}")

    routing_trace = model_router_details.get("routing_trace", [])
    if not routing_trace:
        print("No routing trace was returned.")

    for decision_number, routing_decision in enumerate(routing_trace, start=1):
        latency_ms = routing_decision.get("latency_ms")
        latency = f"{latency_ms} ms" if latency_ms is not None else "not reported"
        print(f"Routing decision {decision_number} (latency: {latency})")

        for attempt_number, attempt in enumerate(
            routing_decision.get("attempts", []), start=1
        ):
            result = attempt.get("result", {})
            status = result.get("status", "unknown")
            outcome = (
                "selected"
                if isinstance(status, int) and 200 <= status < 300
                else "failed"
            )
            print(
                f"  Attempt {attempt_number}: {attempt.get('model', 'unknown')} - HTTP {status} ({outcome})"
            )

            error = result.get("error")
            if error:
                print(
                    f"    Error: {error.get('code', 'unknown')} - {error.get('message', 'No message')}"
                )
    print("\n")
```

Ordered attempts can reveal automatic fallback for an individual request. In the example response, the failed attempt followed by a successful attempt is evidence of fallback for that request. Requests don't always include multiple attempts, so don't expect fallback on every request.

For complete application setup and runnable examples, see the [Foundry Model Router samples](https://github.com/microsoft-foundry/foundry-samples/tree/main/samples/python/foundry-models/model-router).

## Interpret the results

The following output shows the response and routing metadata for an example request:

```text
--- Chat Completions Response ---
Response:Pike Place Market is Seattle's most popular tourist destination.
Usage: 29 prompt + 278 completion = 307 total tokens

Routed to model: gpt-5-mini-2025-08-07
--- Model Selection Details ---
Routing mode: balanced
Routing decision 1 (latency: 19 ms)
   Attempt 1: grok-4-1-fast-reasoning - HTTP 404 (failed)
      Error: NotFound - The request failed with HTTP status code 404 (NotFound).
   Attempt 2: gpt-5-mini - HTTP 200 (selected)
```

- If `model_selection_details` is absent, the sample reports that no model selection details were returned. Don't infer routing details that aren't present.
- If `routing_trace` is empty, the sample reports that no routing trace was returned.
- An attempt can omit `error`. The extraction code prints an error only when the response includes one.
- Model names, HTTP statuses, attempt counts, and reported latency can vary by request and service version.
- `response.model` identifies the serving model for the demonstrated request.