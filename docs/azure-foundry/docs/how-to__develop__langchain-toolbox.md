<!-- Title: Use Foundry Toolbox | Category: Developer tools and integrations/Develop with LangChain and LangGraph/Use Foundry Toolbox | URL: how-to/develop/langchain-toolbox -->

---
layout: Conceptual
title: Use Foundry Toolbox with LangChain - Microsoft Foundry | Microsoft Learn
canonicalUrl: https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/langchain-toolbox
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
author: sdgilley
learn_banner_products:
- azure
manager: mcleans
ms.author: sgilley
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 90-days
ms.service: microsoft-foundry
description: Learn how to load and use tools and skills from a Foundry Toolbox in LangChain agents with the langchain-azure-ai package.
ms.topic: how-to
ms.date: 2026-06-16T00:00:00.0000000Z
ms.reviewer: fasantia
ms.custom:
- dev-focus
- doc-kit-assisted
ai-usage: ai-assisted
locale: en-us
document_id: 2ba73e9d-56fe-d277-1e33-75be9797bb50
document_version_independent_id: 0c24f654-aefb-d6d2-3575-347dde630100
updated_at: 2026-07-02T22:13:00.0000000Z
original_content_git_url: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/live/articles/foundry/how-to/develop/langchain-toolbox.md
gitcommit: https://github.com/MicrosoftDocs/azure-ai-docs-pr/blob/87345d2cd1d9582772881f5a27c2bcfce3b6b9c0/articles/foundry/how-to/develop/langchain-toolbox.md
git_commit_id: 87345d2cd1d9582772881f5a27c2bcfce3b6b9c0
site_name: Docs
depot_name: Learn.azure-ai
page_type: conceptual
toc_rel: ../../toc.json
word_count: 1053
asset_id: foundry/how-to/develop/langchain-toolbox
moniker_range_name: 
monikers: []
item_type: Content
source_path: articles/foundry/how-to/develop/langchain-toolbox.md
cmProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/68ec7f3a-2bc6-459f-b959-19beb729907d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/de19c5b8-e208-412e-9238-db3f631dea5b
- https://authoring-docs-microsoft.poolparty.biz/devrel/089c8ba6-d135-43ff-bfaf-b8197fb72fb9
spProducts:
- https://authoring-docs-microsoft.poolparty.biz/devrel/90370425-aca4-4a39-9533-d52e5e002a5d
- https://microsoft-devrel.poolparty.biz/DevRelOfferingOntology/ea7bf5d6-7154-4ba9-8ebc-59117ccacd49
- https://authoring-docs-microsoft.poolparty.biz/devrel/32516e21-6665-416f-be21-413febe47d91
platformId: 305d3f1a-5e5e-da2e-3aa9-f5c5ad2fbd70
---

# Use Foundry Toolbox with LangChain - Microsoft Foundry | Microsoft Learn

Use the `langchain-azure-ai` package to load tools and skills from a Foundry Toolbox into your LangChain and LangGraph agents. A Foundry Toolbox is a managed multi-MCP server that aggregates multiple configured tools behind a single Model Context Protocol (MCP) endpoint.

You learn how to load tools, identify tools that require approval, load toolbox skills as resources, and prepare skills for deep agents.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [Foundry project](https://learn.microsoft.com/en-us/azure/foundry/create-projects).
- A deployed chat model (for example, `gpt-4.1`) in your project.
- A toolbox configured in your Foundry project. Note its name.
- Python 3.10 or later.
- Azure CLI signed in (`az login`) so `DefaultAzureCredential` can authenticate.

Install the required packages:

```bash
pip install -U langchain-azure-ai langchain-mcp-adapters httpx azure-identity
```

The toolbox integration requires `langchain-mcp-adapters` and `httpx`. To load skills for deep agents, also install `deepagents`.

### Configure your environment

The toolbox needs a project endpoint and a toolbox name. Provide them as constructor arguments or through environment variables.

Set your environment variables:

```python
import os

# Project endpoint (recommended)
os.environ["FOUNDRY_PROJECT_ENDPOINT"] = (
    "https://<resource>.services.ai.azure.com/api/projects/<project>"
)

# Name of the toolbox configured in your Foundry project
os.environ["FOUNDRY_AGENT_TOOLBOX_NAME"] = "<your-toolbox-name>"
```

The integration also accepts the `FOUNDRY_PROJECT_ENDPOINT` environment variable as a fallback for the project endpoint.

Import the common classes and initialize the model used throughout this article:

```python
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
from langchain.messages import HumanMessage
from azure.identity import DefaultAzureCredential

model = init_chat_model("azure_ai:gpt-4.1")
```

## Connect to a toolbox

Use `AzureAIProjectToolbox` from the namespace `langchain_azure_ai.tools` to connect to a toolbox. The integration detects the project connection when you set the `FOUNDRY_PROJECT_ENDPOINT` environment variable. Microsoft Entra ID is the default authentication method.

```python
from langchain_azure_ai.tools import AzureAIProjectToolbox

toolbox = AzureAIProjectToolbox(
    project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
    toolbox_name="my-toolbox",
)
```

When you set the environment variables, you can omit the constructor arguments:

```python
toolbox = AzureAIProjectToolbox()
```

**Reference:**[AzureAIProjectToolbox](https://pypi.org/project/langchain-azure-ai/)

## Load tools from a toolbox

Call `aget_tools()` to open a session with the toolbox and load every tool it exposes as LangChain `BaseTool` instances. Each call is stateless: it opens a fresh MCP session, loads the tools, and returns them.

```python
async def main():
    toolbox = AzureAIProjectToolbox(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        toolbox_name="my-toolbox",
    )

    tools = await toolbox.aget_tools()

    agent = create_agent(model=model, tools=tools)

    result = await agent.ainvoke(
        {"messages": [HumanMessage("What can you do?")]}
    )
    print(result["messages"][-1].content)
```

**What this snippet does:** Connects to the toolbox, loads its tools, and binds them to an agent. When you invoke the agent, the model can call any tool the toolbox provides to answer the request.

`AzureAIProjectToolbox` also supports the asynchronous context manager protocol. The behavior is identical because each `aget_tools()` call manages its own session:

```python
async with AzureAIProjectToolbox(toolbox_name="my-toolbox") as toolbox:
    tools = await toolbox.aget_tools()
```

**Reference:**[create_agent](https://docs.langchain.com/oss/python/langchain/agents)

### Identify tools that require approval

Some toolbox tools are configured to require approval before they run. Call `get_tools_requiring_approval()` to retrieve the names of those tools so you can add a human-in-the-loop step before execution.

```python
tools_needing_approval = await toolbox.get_tools_requiring_approval()

print("Tools that require approval before execution:")
for name in tools_needing_approval:
    print(f"- {name}")
```

**What this snippet does:** Inspects the toolbox metadata and returns the names of tools whose configuration sets `require_approval` to `always`. Use this list to gate sensitive operations behind an approval workflow.

This capability is independent of OAuth consent handling. For more information about human-in-the-loop approvals, see [Use Foundry Agent Service with LangGraph](https://learn.microsoft.com/en-us/azure/foundry/langchain-agents).

### Handle OAuth consent

Toolbox in Microsoft Foundry can handle on-behalf-of workflows. You can configure the authorization requirements when you add the tools to your toolbox.

![Screenshot of how to configure an MCP server with an on-behalf-of workflow.](https://learn.microsoft.com/en-us/azure/foundry/media/langchain-toolbox/toolbox-oauth.png)

When a toolbox tool connects to a service that hasn't been authorized yet, the Foundry gateway requires OAuth consent. Instead of raising an exception, `get_tools()`/`aget_tools()` returns a fallback tool that surfaces the consent URL so your agent can present it to the user.

When you invoke an agent and the model calls the fallback tool, the response contains a message similar to the following:

```output
OAuth consent is required before this toolbox can be used. Open the following
URL in a browser to authorize access, then restart the agent:

  https://consent.azure-apim.net/...
```

Open the URL in a browser to authorize access, **then restart the agent**. After you grant consent, the toolbox loads its tools normally.

## Load skills from a toolbox

A toolbox can expose skills. A toolbox exposes skills as MCP resources with URIs of the form `skill://{name}`. Use `get_resources()` to load them as LangChain `Blob` objects. Each `Blob` carries the resource name in its `source` property and its raw URI under `metadata["uri"]`.

```python
skill_blobs = toolbox.get_resources(scheme="skills")

for blob in skill_blobs:
    print(f"Skill: {blob.source}")
    print(blob.as_string())
```

```output
Skill: jokes-teller/SKILL.md
{'content': '---\nname: jokes-teller\ndescription: An skill to tell jokes\n---\n\nUse...'}
```

**What this snippet does:** Loads every `skill://` resource from the toolbox as a `Blob`. The `scheme="skills"` filter restricts the results to skill resources. The match is case-insensitive and accepts the singular or plural form (`"skill"` or `"skills"`).

To load specific resources, pass their URIs explicitly. When you provide `uris`, the `scheme` filter is ignored:

```python
skill_blobs = toolbox.get_resources(uris="skill://my-skill/SKILL.md")
```

Use `aget_resources()` for the asynchronous equivalent:

```python
skill_blobs = await toolbox.aget_resources(scheme="skills")
```

### Load skills for deep agents

If you use the `deepagents` package, call `get_skills()` to load toolbox skills as a ready-to-use file mapping for `create_deep_agent`. This method builds on `get_resources()` and removes the boilerplate of converting each `Blob` into the file layout that deep agents expect.

Install the package:

```bash
pip install deepagents
```

The following example seeds a `StateBackend` (the default). Leave the `backend` argument unset and pass the returned mapping as the `files` payload on `invoke`:

```python
from deepagents import create_deep_agent
from deepagents.backends import StateBackend

toolbox = AzureAIProjectToolbox(toolbox_name="my-toolbox")
skill_files = toolbox.get_skills()

agent = create_deep_agent(
    model="azure_ai:gpt-4.1",
    backend=StateBackend(),
    skills=["/skills/"],
)

agent.invoke({"messages": [HumanMessage("Use a skill")], "files": skill_files})
```

**What this snippet does:** Loads the toolbox skills into a mapping of virtual `SKILL.md` paths and seeds them into the agent state through the `files` payload. The agent can then use the skills under the `/skills/` base path.

To seed a backend with standalone storage, such as `FilesystemBackend`, pass it as the `backend` argument. The skills are written into the backend, and the same mapping is also returned:

```python
from deepagents.backends import FilesystemBackend

backend = FilesystemBackend(root_dir="./my-project")
toolbox = AzureAIProjectToolbox(toolbox_name="my-toolbox")
await toolbox.aget_skills(backend=backend)

agent = create_deep_agent(
    model="azure_ai:gpt-4.1",
    backend=backend,
    skills=["/skills/"],
)
```

By default, skill files are placed under the `/skills/` base path. Pass a different `base_path` to change the location. The value must start and end with a slash, and you pass the same value to the `skills` argument of `create_deep_agent`.