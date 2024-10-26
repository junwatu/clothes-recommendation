# Clothes Recommendation System Using OpenAI & RAG

![cover](images/cover.jpg)

## Table of Contents

- [Clothes Recommendation System Using OpenAI \& RAG](#clothes-recommendation-system-using-openai--rag)
  - [Table of Contents](#table-of-contents)
  - [**Introduction**](#introduction)
  - [**Understanding Retrieval-Augmented Generation (RAG)**](#understanding-retrieval-augmented-generation-rag)
  - [How Does RAG Work?](#how-does-rag-work)
  - [**Advantages of OpenAI \& RAG in Fashion**](#advantages-of-openai--rag-in-fashion)
  - [**System Architecture**](#system-architecture)
  - [**Overview of Key Technologies**](#overview-of-key-technologies)
    - [OpenAI](#openai)
    - [Node.js](#nodejs)
    - [GridDB](#griddb)
    - [React](#react)
  - [**Node.js Backend**](#nodejs-backend)
  - [**Data Management with GridDB**](#data-management-with-griddb)
  - [**Building User Interface**](#building-user-interface)
  - [**Demo**](#demo)
  - [**Further Enhancements**](#further-enhancements)

## **Introduction**

Clothes recommendation is an important feature in any e-commerce solution. It gives personalized shopping experiences in fashion and by using AI-driven solutions will enhance that experiences.

In this article, we will use the GPT-4o mini model to analyzing images of clothing and extract it's colors and styles. With these information we can acurrately identify the characteristic of the input clothing item and complement the identified features with our knowledge base using RAG technique.

## **Understanding Retrieval-Augmented Generation (RAG)**

Retrieval-Augmented Generation (RAG) enhances large language models (LLMs) by using external knowledge bases for more accurate responses. LLMs, trained on vast data with billions of parameters, perform tasks like answering questions or translations. RAG improves this by enabling the model to access specific domains or internal data without retraining.

## How Does RAG Work?

Without RAG, the LLM takes the user input and creates a response based on information it was trained on—or what it already knows.

With RAG, an information retrieval component is introduced that utilizes the user input to first pull information from a new knowledge source. The user query and the relevant information are both given to the LLM. The LLM uses the new knowledge and its training data to generate a better text responses.

![RAG simple diagram](images/rag.jpg)

## **Advantages of OpenAI & RAG in Fashion**

Combining GPT-4o mini with Retrieval-Augmented Generation (RAG) offers several practical benefits for the fashion industry:

1. **Contextual Understanding**: GPT-4o mini analyzes clothing inputs and comprehends their context, leading to more accurate responses.

2. **Access to Information**: RAG integrates the generative abilities of GPT-4o mini with a retrieval system that draws from a large database of fashion-related knowledge, ensuring relevant information is readily available.
3. **Personalization**: The system can provide tailored recommendations based on user preferences and historical data, enhancing the shopping experience.

## **System Architecture**

![system-arch](images/system-arch.jpg)

This system architecture leverages **RAG** to ensure that the recommendations are informed by both **user-specific input** and **stored data**, making them more relevant and customized.

Here’s a breakdown of the components and their interactions:

**User Interaction**:

- The user inputs a **prompt** (e.g., their preferences or requirements for clothing) through a **React.js** based **User Interface**.
- This UI serves as the point where the user communicates with the system, sending prompts and receiving recommendations.

**Node.js Backend**:

- The **Node.js** server acts as the core processing unit, handling communication between the user interface, database, and OpenAI services.
- It receives the user's prompt from the React.js front end and processes it to determine the data and insights required for a recommendation.

**Data Source (GridDB)**:

- **GridDB** is used to store **clothing recommendation data** such as item descriptions, styles, weather conditions, user preferences, and more.

**RAG Integration with OpenAI**:

- In this system, the Node.js server uses RAG to provide **enhanced context** by combining information fetched from **Text Embedded Model** with the user’s prompt before passing it to **OpenAI**.

**OpenAI (Text Embedding + GPT-4.0 Mini)**:

- The **Text Embedding** model is used to generate vector representations of the prompt and any retrieved context, making it easier to match user queries with relevant data.
- **GPT-4.0 Mini** (a smaller variant of GPT-4) processes the **prompt, query, and enhanced context** together to generate tailored recommendations.
- This step enables the system to provide more personalized and context-aware recommendations based on both user input and the data fetched from GridDB.

**Response Flow**:

- After generating the recommendation, the response is sent back through the Node.js backend to the **React.js** user interface, where the user can view the clothing suggestions.

## **Overview of Key Technologies**

### OpenAI

There few steps needed to setup in OpenAI. Go to your project dashboard and do these:

1. You need to enable two models from OpenAI:

    - gpt-4o-mini
    - text-embedding-3-large

    ![models permission](images/allow-openai-models.png)

2. You also need to create a key so the app can use those models:

    ![setup key](images/create-dev-key.png)

    And use the key in the `.env` file.

### Docker

For easy development and distribution, this project using docker container.

#### GridDB Docker

This app need a GridDB server and in this project we will use GridDB docker on ARM machine. Please check out this [blog](https://griddb.net/en/blog/griddb-on-arm-with-docker/) for instructions on how to install it.

You probably need a [Docker Desktop](https://www.docker.com/products/docker-desktop/) tool for easy docker management.

![griddb docker arm](images/griddb-docker-arm.png)

## **Node.js Backend**

## **Data Management with GridDB**

## **Building User Interface**

## **Demo**

## **Further Enhancements**
