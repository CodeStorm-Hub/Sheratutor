<!-- Title: Build a prompt agent | Category: Get started/What do you want to build?/Build a prompt agent | URL: agents/quickstarts/prompt-agent -->

---
layout: Conceptual
title: 'Quickstart: Create a prompt agent - Microsoft Foundry | Microsoft Learn'
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/agents/quickstarts/prompt-agent
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
author: aahill
learn_banner_products:
- azure
manager: mcleans
ms.author: aahi
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to create a prompt agent in Foundry Agent Service using the Microsoft Foundry SDK, then have a multi-turn conversation with the agent you create.
ms.date: 2026-08-21T00:00:00.0000000Z
ms.subservice: foundry-agent-service
ms.topic: quickstart
ms.custom: update-code6
ai-usage: ai-assisted
locale: en-us
document_id: fa706e96-1978-e2ea-9746-883ff00741f9
document_version_independent_id: 8ff98663-58a6-3617-752f-c96ceb225a22
updated_at: 2026-09-04T19:01:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/agents/quickstarts/prompt-agent.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/ef13a53472455a5d3d66234601e311d28c9d6b0f/articles/foundry/agents/quickstarts/prompt-agent.md
git_commit_id: ef13a53472455a5d3d66234601e311d28c9d6b0f
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1549
asset_id: foundry/agents/quickstarts/prompt-agent
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/agents/quickstarts/prompt-agent.md
cmProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/fbc448d8-f51b-49e6-a28d-b0ed67a9b6ee
spProducts:
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/a2d547e1-b5e2-4f22-ada5-397b95fd90be
platformId: 9f9a48bb-279a-2128-9321-8d47fc0210c9
---

# Quickstart: Create a prompt agent - Microsoft Foundry | Microsoft Learn

In this quickstart, you create a prompt agent in Foundry Agent Service and have a conversation with it. A prompt agent is a declaratively defined agent that combines a model from the Foundry model catalog, instructions, tools, and natural language prompts to drive behavior.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Prerequisites

- A model deployed in Microsoft Foundry. If you don't have a model, first complete [Quickstart: Set up Microsoft Foundry resources](https://learn.microsoft.com/en-us/azure/foundry/../tutorials/quickstart-create-foundry-resources).
- The required language runtimes, global tools, and Visual Studio Code extensions as described in [Prepare your development environment](https://learn.microsoft.com/en-us/azure/foundry/../how-to/develop/install-cli-sdk).

## Set environment variables

Store [your project endpoint](https://learn.microsoft.com/en-us/azure/foundry/../tutorials/quickstart-create-foundry-resources#get-your-project-connection-details) as an environment variable. Also set these values for use in your scripts.

**Python and JavaScript**

```
PROJECT_ENDPOINT=<endpoint copied from welcome screen>
AGENT_NAME="MyAgent"
```

**C# and Java**

```
ProjectEndpoint = <endpoint copied from welcome screen>
AgentName = "MyAgent"
```

## Install packages and authenticate

Make sure you install the correct version of the packages as shown here.

# **Python**
1. Install the current version of `azure-ai-projects`. This version uses the **Foundry projects (new) API**. The samples authenticate by using `DefaultAzureCredential`, which comes from `azure-identity`.

    ```
    pip install "azure-ai-projects>=2.3.0" azure-identity
    ```
2. Sign in using the CLI `az login` command to authenticate before running your Python scripts.

# **C#**
1. Install packages:

    Add NuGet packages using the .NET CLI in the integrated terminal: These packages use the **Foundry projects (new) API**.

    ```bash
    dotnet add package Azure.AI.Projects
    dotnet add package Azure.AI.Projects.Agents
    dotnet add package Azure.AI.Extensions.OpenAI
    dotnet add package Azure.Identity
    ```
2. Sign in using the CLI `az login` command to authenticate before running your C# scripts.

# **TypeScript**
1. Install the current version of `@azure/ai-projects`. This version uses the **Foundry projects (new) API**.:

    ```bash
    npm install @azure/ai-projects @azure/identity
    ```
2. Sign in using the CLI `az login` command to authenticate before running your TypeScript scripts.

# **Java**
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-agents</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-core</artifactId>
    <version>1.57.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.18.1</version>
</dependency>
```

1. Sign in using the CLI `az login` command to authenticate before running your Java scripts.

# **REST API**
1. Sign in using the CLI `az login` command to authenticate before running the next command.
2. Get a temporary access token. It will expire in 60-90 minutes, you'll need to refresh after that.

    ```azurecli
    az account get-access-token --scope https://ai.azure.com/.default
    ```
3. Save the results as the environment variable `AZURE_AI_AUTH_TOKEN`.

# **Foundry portal**
No installation is necessary to use the Foundry portal.

---

Tip

Code uses **Azure AI Projects 2.x** and is incompatible with Azure AI Projects 1.x. [See the Foundry (classic) documentation](https://learn.microsoft.com/en-us/azure/foundry/../../foundry-classic/) for the Azure AI Projects 1.x version.

## Create a prompt agent

Create a prompt agent using your deployed model. The agent uses a `PromptAgentDefinition` with instructions that define the agent's behavior. You can update or delete agents anytime.

# **Python**
```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition

# Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
PROJECT_ENDPOINT = "your_project_endpoint"
AGENT_NAME = "your_agent_name"

# Create project client to call Foundry API
project = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),
)

# Create an agent with a model and instructions
agent = project.agents.create_version(
    agent_name=AGENT_NAME,
    definition=PromptAgentDefinition(
        model="gpt-5-mini",  # supports all Foundry direct models
        instructions="You are a helpful assistant that answers general questions",
    ),
)
print(f"Agent created (id: {agent.id}, name: {agent.name}, version: {agent.version})")
```

# **C#**
```csharp
using Azure.Identity;
using Azure.AI.Projects;
using Azure.AI.Projects.Agents;
using Azure.AI.Extensions.OpenAI;

// Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
var ProjectEndpoint = "your_project_endpoint";
var AgentName = "your_agent_name";

// Create project client to call Foundry API
AIProjectClient projectClient = new(
    endpoint: new Uri(ProjectEndpoint),
    tokenProvider: new DefaultAzureCredential());

// Create an agent with a model and instructions
ProjectsAgentDefinition agentDefinition = new DeclarativeAgentDefinition("gpt-5-mini") // supports all Foundry direct models
{
    Instructions = "You are a helpful assistant that answers general questions",
};

ProjectsAgentVersion agent = projectClient.AgentAdministrationClient.CreateAgentVersion(
    AgentName,
    options: new(agentDefinition));
Console.WriteLine($"Agent created (id: {agent.Id}, name: {agent.Name}, version: {agent.Version})");
```

# **TypeScript**
```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

// Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
const PROJECT_ENDPOINT = "your_project_endpoint";
const AGENT_NAME = "your_agent_name";

async function main(): Promise<void> {
    // Create project client to call Foundry API
    const project = new AIProjectClient(PROJECT_ENDPOINT, new DefaultAzureCredential());

    // Create an agent with a model and instructions
    const agent = await project.agents.createVersion(AGENT_NAME, {
        kind: "prompt",
        model: "gpt-5-mini", //supports all Foundry direct models
        instructions: "You are a helpful assistant that answers general questions",
    });
    console.log(`Agent created (id: ${agent.id}, name: ${agent.name}, version: ${agent.version})`);
}

main().catch(console.error);
```

# **Java**
```java
package com.azure.ai.agents;

import com.azure.ai.agents.models.AgentVersionDetails;
import com.azure.ai.agents.models.PromptAgentDefinition;
import com.azure.identity.DefaultAzureCredentialBuilder;

public class CreateAgent {
    public static void main(String[] args) {
        // Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
        String ProjectEndpoint = "your_project_endpoint";
        String AgentName = "your_agent_name";

        // Create agents client to call Foundry API
        AgentsClient agentsClient = new AgentsClientBuilder()
                .credential(new DefaultAzureCredentialBuilder().build())
                .endpoint(ProjectEndpoint)
                .buildAgentsClient();

        // Create an agent with a model and instructions
        PromptAgentDefinition request = new PromptAgentDefinition("gpt-5-mini") // supports all Foundry direct models
                .setInstructions("You are a helpful assistant that answers general questions");
        AgentVersionDetails agent = agentsClient.createAgentVersion(AgentName, request);

        System.out.println("Agent ID: " + agent.getId());
        System.out.println("Agent Name: " + agent.getName());
        System.out.println("Agent Version: " + agent.getVersion());
    }
}
```

# **REST API**
Replace `YOUR-FOUNDRY-RESOURCE-NAME` with your values:

```console
curl -X POST https://YOUR-FOUNDRY-RESOURCE-NAME.services.ai.azure.com/api/projects/YOUR-PROJECT-NAME/agents?api-version=v1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_AI_AUTH_TOKEN" \
  -d '{
    "name": "MyAgent",
    "definition": {
      "kind": "prompt",
      "model": "gpt-5-mini",
      "instructions": "You are a helpful assistant that answers general questions"
    }
  }'
```

---

The output confirms the agent was created. You see the agent name and ID printed to the console.

## Chat with the agent

Use the agent you created to interact by asking a question and a related follow-up. The conversation maintains history across these interactions.

# **Python**
```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

# Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
PROJECT_ENDPOINT = "your_project_endpoint"
AGENT_NAME = "your_agent_name"

# Create project and openai clients to call Foundry API
project = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),
)
# Get an OpenAI client pre-bound to the specified agent
openai = project.get_openai_client(agent_name=AGENT_NAME)

# Create a conversation for multi-turn chat
conversation = openai.conversations.create()

# Chat with the agent to answer questions
response = openai.responses.create(
    conversation=conversation.id,
    input="What is the size of France in square miles?",
)
print(response.output_text)

# Ask a follow-up question in the same conversation
response = openai.responses.create(
    conversation=conversation.id,
    input="And what is the capital city?",
)
print(response.output_text)
```

# **C#**
```csharp
using Azure.Identity;
using Azure.AI.Projects;
using Azure.AI.Extensions.OpenAI;
using OpenAI.Responses;

#pragma warning disable OPENAI001

// Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
var ProjectEndpoint = "your_project_endpoint";
var AgentName = "your_agent_name";

// Create project client to call Foundry API
AIProjectClient projectClient = new(
    endpoint: new Uri(ProjectEndpoint),
    tokenProvider: new DefaultAzureCredential());

// Create a conversation for multi-turn chat
ProjectConversation conversation = projectClient.ProjectOpenAIClient.GetProjectConversationsClient().CreateProjectConversation();

// Chat with the agent to answer questions
ProjectResponsesClient responsesClient = projectClient.ProjectOpenAIClient.GetProjectResponsesClientForAgent(
    defaultAgent: AgentName,
    defaultConversationId: conversation.Id);
ResponseResult response = responsesClient.CreateResponse("What is the size of France in square miles?");
Console.WriteLine(response.GetOutputText());

// Ask a follow-up question in the same conversation
response = responsesClient.CreateResponse("And what is the capital city?");
Console.WriteLine(response.GetOutputText());
```

# **TypeScript**
```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

// Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
const PROJECT_ENDPOINT = "your_project_endpoint";
const AGENT_NAME = "your_agent_name";

async function main(): Promise<void> {
    // Create project and openai clients to call Foundry API
    const project = new AIProjectClient(PROJECT_ENDPOINT, new DefaultAzureCredential());
    const openai = project.getOpenAIClient({
        azureConfig: { allowPreview: true, agentName: AGENT_NAME },
    });

    // Create a conversation for multi-turn chat
    const conversation = await openai.conversations.create();

    // Chat with the agent to answer questions
    const response = await openai.responses.create({
        conversation: conversation.id,
        input: "What is the size of France in square miles?",
    });
    console.log(response.output_text);

    // Ask a follow-up question in the same conversation
    const response2 = await openai.responses.create({
        conversation: conversation.id,
        input: "And what is the capital city?",
    });
    console.log(response2.output_text);
}

main().catch(console.error);
```

# **Java**
```java
package com.azure.ai.agents;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.openai.client.OpenAIClient;
import com.openai.models.conversations.Conversation;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class ChatWithAgent {
    public static void main(String[] args) {
        // Format: "https://resource_name.services.ai.azure.com/api/projects/project_name"
        String ProjectEndpoint = "your_project_endpoint";
        String AgentName = "your_agent_name";
        
        AgentsClientBuilder builder = new AgentsClientBuilder()
                .credential(new DefaultAzureCredentialBuilder().build())
                .endpoint(ProjectEndpoint);

        // Create an OpenAI client bound to the agent endpoint
        OpenAIClient openai = builder.buildAgentScopedOpenAIClient(AgentName);

        // Create a conversation for multi-turn chat
        Conversation conversation = openai.conversations().create();

        // Chat with the agent to answer questions
        Response response = openai.responses().create(
            ResponseCreateParams.builder()
                .conversation(conversation.id())
                .input("What is the size of France in square miles?")
                .build());
        printResponse(response);

        // Ask a follow-up question in the same conversation
        Response followUp = openai.responses().create(
            ResponseCreateParams.builder()
                .conversation(conversation.id())
                .input("And what is the capital city?")
                .build());
        printResponse(followUp);
    }

    private static void printResponse(Response response) {
        response.output().forEach(item -> item.message().ifPresent(message ->
            message.content().forEach(content -> content.outputText().ifPresent(
                text -> System.out.println(text.text())))));
    }
}
```

# **REST API**
Replace `YOUR-FOUNDRY-RESOURCE-NAME` with your values:

```console
# Generate a response using the agent

curl -X POST "https://YOUR-FOUNDRY-RESOURCE-NAME.services.ai.azure.com/api/projects/YOUR-PROJECT-NAME/agents/${AGENT_NAME}/endpoint/protocols/openai/responses?api-version=v1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_AI_AUTH_TOKEN" \
  -d '{
    "input": [{"role": "user", "content": "What is the size of France in square miles?"}]
  }'

# Optional Step: Create a conversation to use with the agent
curl -X POST "https://YOUR-FOUNDRY-RESOURCE-NAME.services.ai.azure.com/api/projects/YOUR-PROJECT-NAME/agents/${AGENT_NAME}/endpoint/protocols/openai/conversations?api-version=v1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_AI_AUTH_TOKEN" \
  -d '{
    "items": [
      {
        "type": "message",
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "What is the size of France in square miles?"
          }
        ]
      }
    ]
  }'

# Lets say Conversation ID created is conv_123456789. Use this in the next step

#Optional Step: Ask a follow-up question in the same conversation
curl -X POST "https://YOUR-FOUNDRY-RESOURCE-NAME.services.ai.azure.com/api/projects/YOUR-PROJECT-NAME/agents/${AGENT_NAME}/endpoint/protocols/openai/responses?api-version=v1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AZURE_AI_AUTH_TOKEN" \
  -d '{
    "conversation": "<CONVERSATION_ID>",
    "input": [{"role": "user", "content": "And what is the capital?"}]
  }'
```

---

You see the agent's responses to both prompts. The follow-up response demonstrates that the agent maintains conversation history across turns.

## Clean up resources

If you no longer need any of the resources you created, delete the resource group associated with your project.

- In the [Azure portal](https://portal.azure.com), select the resource group, and then select **Delete**. Confirm that you want to delete the resource group.