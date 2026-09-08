<!-- Title: Endpoints for Foundry Models | Category: Developer tools and integrations/SDKs and APIs/Endpoints for Foundry Models | URL: foundry-models/concepts/endpoints -->

---
layout: Conceptual
title: Endpoints for Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/endpoints
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
author: msakande
learn_banner_products:
- azure
manager: mcleans
ms.author: mopeakande
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to access and use Microsoft Foundry Models endpoints for secure model inference, flexible deployments, and keyless authentication.
reviewer: achandmsft
ms.reviewer: achand
ms.subservice: foundry-model-inference
ms.topic: how-to
ms.date: 2026-07-31T00:00:00.0000000Z
ms.custom:
- build-2025
- classic-and-new
- doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: abb02d66-04c0-11c8-f4fb-31244c153026
document_version_independent_id: b9ece24b-5414-b067-0e1a-1ad2fcf879e8
updated_at: 2026-08-01T06:06:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/foundry-models/concepts/endpoints.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/b13bf4fdbca1236c8029b2a782e51fbdb186d4dd/articles/foundry/foundry-models/concepts/endpoints.md
git_commit_id: b13bf4fdbca1236c8029b2a782e51fbdb186d4dd
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 2026
asset_id: foundry/foundry-models/concepts/endpoints
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/foundry-models/concepts/endpoints.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/8a6e4dad-7050-4ce7-83f9-eb4123577a54
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/cbd33d8f-e9af-440e-8f1e-fc69e07b902b
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/0a5fc323-00ce-4c20-9095-41948f54c83f
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/3820371b-086e-47fb-9d1f-b215f569127a
platformId: f821f067-2f35-ab0a-9b4a-9565b53efbe4
---

# Endpoints for Microsoft Foundry Models - Microsoft Foundry | Microsoft Learn

Microsoft Foundry Models provides access to a wide variety of models from many providers through a single endpoint and set of credentials. This capability lets you switch between models and use them in your application without making code changes.

This article explains how the Foundry services organize models and how to use the inference endpoint to access them.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).
- A Microsoft Foundry resource. If you don't have one, [create a resource and deploy a model](../how-to/create-model-deployments).
- At least one [model deployment](../how-to/create-model-deployments) in your resource.
- The latest version of the OpenAI SDK for your language (Python, JavaScript, C#, or Java), or a REST client such as `curl`.
- To use keyless authentication, the required [Microsoft Entra ID role assignments](../how-to/configure-entra-id) on the resource.

## Deployments

Foundry uses **deployments** as aliases for model access. A deployment gives a model a name and a set of configurations. You access a model by using its deployment name in your requests.

A deployment defines:

- A model name
- A model version
- A provisioning or capacity type^1^
- A content filtering configuration^1^
- A rate limiting configuration^1^

^1^ These configurations can change depending on the selected model.

A Foundry resource can have many model deployments. You only pay for inference performed on model deployments. Deployments are Azure resources, so they're subject to Azure policies.

For more information about creating deployments, see [Add and configure model deployments](../how-to/create-model-deployments).

## Azure OpenAI inference endpoint

The **Azure OpenAI API** exposes the full capabilities of OpenAI models and supports more features like assistants, threads, files, and batch inference. You can also use it to access non-OpenAI models.

Azure OpenAI endpoints are formatted as `https://<resource-name>.openai.azure.com`. Endpoints map to deployments, and each deployment has its own associated URL. However, you can use the same authentication mechanism to consume more than one deployment. For more information, see the reference page for [Azure OpenAI API](/en-us/rest/api/microsoft-foundry/azureopenai/responses).

[![An illustration showing how Azure OpenAI deployments contain a single URL for each deployment.](../media/endpoint/endpoint-openai.png)](../media/endpoint/endpoint-openai.png#lightbox)

Deployment URLs are formed by concatenating the **Azure OpenAI** base URL and the route `/deployments/<model-deployment-name>`. When you use the OpenAI v1 API, call the `/openai/v1/` route on the base URL, `https://<resource-name>.openai.azure.com/openai/v1/`, and pass the deployment name in the `model` field of your request. The `/openai/v1/` route uses implicit versioning, so you don't pass an `api-version`.

The following examples use the [Responses API](/en-us/rest/api/microsoft-foundry/azureopenai/responses?view=rest-microsoft-foundry-v1&amp;preserve-view=true), which supports the latest inference features.

Note

The Responses API works with Azure OpenAI models and with [Foundry Models sold by Azure](models-sold-directly-by-azure) that support it, such as DeepSeek, Llama, and Grok models. If a deployment doesn't support the Responses API, the request returns `400 Model not supported`. In that case, use the Chat Completions API by calling `client.chat.completions.create` instead.

### Use API key authentication

You can authenticate inference requests with an API key from your Foundry resource. API keys are quick to set up, but they grant full access to the resource, are hard to scope to specific users or actions, and require manual rotation to stay secure. For production workloads, use keyless authentication with Microsoft Entra ID instead.

In the following example, `deepseek-v3-0324` is the name of a model deployment in the Microsoft Foundry resource. Replace it with your own deployment name, and store your API key in the `AZURE_INFERENCE_CREDENTIAL` environment variable.

# [Python](#tab/python)
Install the `openai` package by using pip:

```bash
pip install openai --upgrade
```

Create a client that points to the Azure OpenAI v1 endpoint, and then generate a response. The `/openai/v1/` route uses implicit versioning, so you don't pass an `api-version`. Pass your deployment name in the `model` field:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://<resource>.openai.azure.com/openai/v1/",
    api_key=os.environ["AZURE_INFERENCE_CREDENTIAL"],
)

response = client.responses.create(
    model="deepseek-v3-0324",  # Replace with your model deployment name.
    input="Explain the Riemann hypothesis in one paragraph.",
)

print(response.output_text)
```

# [JavaScript](#tab/javascript)
Install the `openai` package by using npm:

```bash
npm install openai
```

Create a client that points to the Azure OpenAI v1 endpoint, and then generate a response:

```javascript
import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://<resource>.openai.azure.com/openai/v1/",
    apiKey: process.env.AZURE_INFERENCE_CREDENTIAL,
});

const response = await client.responses.create({
    model: "deepseek-v3-0324", // Replace with your model deployment name.
    input: "Explain the Riemann hypothesis in one paragraph.",
});

console.log(response.output_text);
```

# [C#](#tab/csharp)
Install the OpenAI library:

```dotnetcli
dotnet add package OpenAI
```

Create a client that points to the Azure OpenAI v1 endpoint, and then generate a response:

```csharp
using System.ClientModel;
using OpenAI;
using OpenAI.Responses;

OpenAIClient client = new(
    new ApiKeyCredential(Environment.GetEnvironmentVariable("AZURE_INFERENCE_CREDENTIAL")),
    new OpenAIClientOptions
    {
        Endpoint = new Uri("https://<resource>.openai.azure.com/openai/v1/")
    });

OpenAIResponseClient responseClient = client.GetResponsesClient("deepseek-v3-0324");

OpenAIResponse response = responseClient.CreateResponse(
    "Explain the Riemann hypothesis in one paragraph.");

Console.WriteLine(response.GetOutputText());
```

# [Java](#tab/java)
Add the OpenAI Java SDK to your project. Check the [OpenAI Java repository](https://github.com/openai/openai-java) for the latest version.

Create a client that points to the Azure OpenAI v1 endpoint, and then generate a response:

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

OpenAIClient client = OpenAIOkHttpClient.builder()
    .baseUrl("https://<resource>.openai.azure.com/openai/v1/")
    .apiKey(System.getenv("AZURE_INFERENCE_CREDENTIAL"))
    .build();

Response response = client.responses().create(
    ResponseCreateParams.builder()
        .model("deepseek-v3-0324") // Replace with your model deployment name.
        .input("Explain the Riemann hypothesis in one paragraph.")
        .build());

// The Responses API has no single output-text accessor; concatenate the output items.
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(outputText -> System.out.println(outputText.text()));
```

# [REST](#tab/rest)
Send requests directly to the v1 route. The `/openai/v1/` path uses implicit versioning, so you don't include an `api-version` query parameter. Pass your key in the `Authorization` header as a bearer token:

```bash
curl -X POST https://<resource>.openai.azure.com/openai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_INFERENCE_CREDENTIAL" \
  -d '{
      "model": "deepseek-v3-0324",
      "input": "Explain the Riemann hypothesis in one paragraph."
    }'
```

---

For more information about how to use the **Azure OpenAI endpoint**, see [Azure OpenAI SDK language support](../../openai/supported-languages).

### Use keyless authentication

Deployed Foundry Models support keyless authorization with Microsoft Entra ID. Keyless authorization enhances security, simplifies the user experience, reduces operational complexity, and provides robust compliance support. Use keyless authorization if your organization uses secure and scalable identity management solutions.

To use keyless authentication, [configure your resource and grant access to users](../how-to/configure-entra-id) to perform inference. After you configure the resource and grant access, authenticate as follows:

# [Python](#tab/python)
Install the OpenAI SDK using a package manager like pip:

```bash
pip install openai
```

For Microsoft Entra ID authentication, also install:

```bash
pip install azure-identity
```

Use the package to consume the model. The following example shows how to create a client and make a test call to the Responses API by using Microsoft Entra ID and your model deployment.

Replace `<resource>` with your Foundry resource name. Find it in the Azure portal or by running `az cognitiveservices account list`. Replace `deepseek-v3-0324` with your actual deployment name.

```python
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), 
    "https://ai.azure.com/.default"
)

client = OpenAI(
    base_url="https://<resource>.openai.azure.com/openai/v1/",
    api_key=token_provider,
)

response = client.responses.create(
    model="deepseek-v3-0324",  # Replace with your model deployment name.
    input="What is Azure AI?",
)

print(response.output_text)
```

Expected output

```output
Azure AI is a comprehensive suite of artificial intelligence services and tools from Microsoft that enables developers to build intelligent applications. It includes services for natural language processing, computer vision, speech recognition, and machine learning capabilities.
```

Reference: [OpenAI Python SDK](https://github.com/openai/openai-python) and [DefaultAzureCredential class](/en-us/python/api/azure-identity/azure.identity.defaultazurecredential).

# [C#](#tab/csharp)
Install the OpenAI SDK:

```dotnetcli
dotnet add package OpenAI
```

For Microsoft Entra ID authentication, also install the `Azure.Identity` package:

```dotnetcli
dotnet add package Azure.Identity
```

Then, use the package to consume the model. The following example shows how to create a client and make a test call to the Responses API by using Microsoft Entra ID and your model deployment.

Replace `<resource>` with your Foundry resource name (find it in the Azure portal). Replace `deepseek-v3-0324` with your actual deployment name.

```csharp
using Azure.Identity;
using OpenAI;
using OpenAI.Responses;
using System.ClientModel.Primitives;

#pragma warning disable OPENAI001

BearerTokenPolicy tokenPolicy = new(
    new DefaultAzureCredential(),
    "https://ai.azure.com/.default"
);

OpenAIResponseClient client = new(
    model: "deepseek-v3-0324", // Replace with your model deployment name.
    authenticationPolicy: tokenPolicy,
    options: new OpenAIClientOptions()
    {
        Endpoint = new Uri("https://<resource>.openai.azure.com/openai/v1/")
    }
);

OpenAIResponse response = client.CreateResponse("What is Azure AI?");

Console.WriteLine(response.GetOutputText());
```

Expected output:

```output
Azure AI is a comprehensive suite of artificial intelligence services and tools from Microsoft that enables developers to build intelligent applications. It includes services for natural language processing, computer vision, speech recognition, and machine learning capabilities.
```

Reference: [OpenAI .NET SDK](https://github.com/openai/openai-dotnet) and [DefaultAzureCredential class](/en-us/dotnet/api/azure.identity.defaultazurecredential).

# [JavaScript](#tab/javascript)
Install the OpenAI SDK with npm:

```bash
npm install openai
```

For Microsoft Entra ID authentication, also install:

```bash
npm install @azure/identity
```

Then, use the package to consume the model. The following example shows how to create a client and make a test call to the Responses API by using Microsoft Entra ID and your model deployment.

Replace `<resource>` with your Foundry resource name (find it in the Azure portal or by running `az cognitiveservices account list`). Replace `deepseek-v3-0324` with your actual deployment name.

```javascript
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { OpenAI } from "openai";

const tokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    'https://ai.azure.com/.default'
);

const client = new OpenAI({
    baseURL: "https://<resource>.openai.azure.com/openai/v1/",
    apiKey: tokenProvider
});

const response = await client.responses.create({
    model: "deepseek-v3-0324", // Replace with your model deployment name.
    input: "What is Azure AI?"
});

console.log(response.output_text);
```

Expected output:

```output
Azure AI is a comprehensive suite of artificial intelligence services and tools from Microsoft that enables developers to build intelligent applications. It includes services for natural language processing, computer vision, speech recognition, and machine learning capabilities.
```

Reference: [OpenAI Node.js SDK](https://github.com/openai/openai-node) and [DefaultAzureCredential class](/en-us/javascript/api/@azure/identity/defaultazurecredential).

# [Java](#tab/java)
Add the OpenAI SDK to your project. Check the [OpenAI Java GitHub repository](https://github.com/openai/openai-java) for the latest version and installation instructions.

For Microsoft Entra ID authentication, also add:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.18.0</version>
</dependency>
```

Then, use the package to consume the model. The following example shows how to create a client and make a test call to the Responses API by using Microsoft Entra ID and your model deployment.

Replace `<resource>` with your Foundry resource name (find it in the Azure portal). Replace `deepseek-v3-0324` with your actual deployment name.

```java
import com.azure.identity.AuthenticationUtil;
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.credential.BearerTokenCredential;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

DefaultAzureCredential tokenCredential = new DefaultAzureCredentialBuilder().build();

OpenAIClient client = OpenAIOkHttpClient.builder()
    .baseUrl("https://<resource>.openai.azure.com/openai/v1/")
    .credential(BearerTokenCredential.create(
        AuthenticationUtil.getBearerTokenSupplier(
            tokenCredential, 
            "https://ai.azure.com/.default"
        )
    ))
    .build();

ResponseCreateParams params = ResponseCreateParams.builder()
    .model("deepseek-v3-0324") // Replace with your model deployment name.
    .input("What is Azure AI?")
    .build();

Response response = client.responses().create(params);

// The Responses API has no single output-text accessor; concatenate the output items.
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(outputText -> System.out.println(outputText.text()));
```

Expected output:

```output
Azure AI is a comprehensive suite of artificial intelligence services and tools from Microsoft that enables developers to build intelligent applications. It includes services for natural language processing, computer vision, speech recognition, and machine learning capabilities.
```

Reference: [OpenAI Java SDK](https://github.com/openai/openai-java) and [DefaultAzureCredential class](/en-us/java/api/com.azure.identity.defaultazurecredential).

# [REST](#tab/rest)
Explore the API design in the [reference section](/en-us/rest/api/microsoft-foundry/azureopenai/responses?view=rest-microsoft-foundry-v1&amp;preserve-view=true) to see which parameters are available. Insert the authentication (bearer) token in the `Authorization` header.

For example, the [Responses API](/en-us/rest/api/microsoft-foundry/azureopenai/responses?view=rest-microsoft-foundry-v1&amp;preserve-view=true) reference section details how to use the `/responses` route to generate predictions. The `/openai/v1/` path is included in the root of the URL:

**Request**

Replace `<resource>` with your Foundry resource name (find it in the Azure portal or by running `az cognitiveservices account list`). Replace `deepseek-v3-0324` with your actual deployment name.

The base URL accepts both `https://<resource>.openai.azure.com/openai/v1/` and `https://<resource>.services.ai.azure.com/openai/v1/` formats.

```bash
curl -X POST https://<resource>.openai.azure.com/openai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_OPENAI_AUTH_TOKEN" \
  -d '{
      "model": "deepseek-v3-0324",
      "input": "Explain what the bitter lesson is?"
    }'
```

**Response**

If authentication is successful, you receive a `200 OK` response with the response results in the response body:

```json
{
  "id": "resp_...",
  "object": "response",
  "created_at": 1738368234,
  "model": "deepseek-v3-0324",
  "status": "completed",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The bitter lesson refers to a key insight in AI research that emphasizes the importance of general-purpose learning methods that leverage computation, rather than human-designed domain-specific approaches. It suggests that methods which scale with increased computation tend to be more effective in the long run."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 28,
    "output_tokens": 52,
    "total_tokens": 80
  }
}
```

Tokens must be issued with scope `https://ai.azure.com/.default`.

For testing purposes, the easiest way to get a valid token for your user account is to use the Azure CLI. In a console, sign in and request a token by running the following Azure CLI commands:

```azurecli
az login
az account get-access-token --resource https://ai.azure.com --query "accessToken" --output tsv
```

This command outputs an access token that you can store in the `$AZURE_OPENAI_AUTH_TOKEN` environment variable.

Reference: [Responses API](/en-us/rest/api/microsoft-foundry/azureopenai/responses?view=rest-microsoft-foundry-v1&amp;preserve-view=true)

---