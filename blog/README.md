# Clothes Recommendation System Using OpenAI & RAG

![cover](images/cover.jpg)

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Retrieval-Augmented Generation (RAG)](#understanding-retrieval-augmented-generation-rag)
   - [How Does RAG Work?](#how-does-rag-work)
3. [Advantages of OpenAI & RAG in Fashion](#advantages-of-openai--rag-in-fashion)
4. [System Architecture](#system-architecture)
5. [Overview of Key Technologies](#overview-of-key-technologies)
6. [Node.js Backend](#nodejs-backend)
7. [Data Management with GridDB](#data-management-with-griddb)
8. [Building User Interface](#building-user-interface)
9. [Demo](#demo)
10. [Further Enhancements](#further-enhancements)

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

## **Overview of Key Technologies**

## **Node.js Backend**

## **Data Management with GridDB**

## **Building User Interface**

## **Demo**

## **Further Enhancements**
