[![Contentstack](https://www.contentstack.com/docs/static/images/contentstack.png)](https://www.contentstack.com/)

# Validate Modular Blocks Using AWS Lambda And Webhook

Contentstack provides Modular Blocks which allows users to dynamically create components of an app or website, by adding multiple sets of fields within each block. Once added, you can choose any block of your choice (such as banner, disclaimer, and so on), add more blocks, rearrange them, or remove them to make changes to the web page or app in your entry. 

In this example, we will learn how to set up certain rules on modular blocks to ensure only the required number of blocks are added in the entry. We will use Contentstack Webhooks and AWS Lambda to set up this system.

# Tutorial

We have created a detailed tutorial on Modular Blocks Validation. Use the steps mentioned in the guide and set up the required validation.

If the validation succeeds, the workflow stage changes to "Approved" as shown below:

![image 1](https://user-images.githubusercontent.com/29656920/103907483-56658400-5127-11eb-8b99-cdd79e55bbe2.PNG)

If the validation fails, the workflow stage changes to "Rejected" as shown below:

![Capture 12](https://user-images.githubusercontent.com/29656920/103907493-582f4780-5127-11eb-870c-5878faada137.png)

# Documentation

Read Contentstack [docs](https://www.contentstack.com/docs/)

Read Guide [Validating Modular Blocks using Contentstack Webhooks and AWS Lambda](https://www.contentstack.com/docs/developers/how-to-guides/validating-modular-blocks-using-contentstack-webhooks-and-aws-lambda/)
