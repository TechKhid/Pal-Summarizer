# Vonage and Symbl.ai Hackathon Demo

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-square)](CODE_OF_CONDUCT.md) [![License](https://img.shields.io/npm/l/@vonage/server-sdk?label=License&style=flat-square)][license]

<img src="https://developer.nexmo.com/images/logos/vbc-logo.svg" height="48px" alt="Vonage" />

This is a demo application showing the [Vonage Voice APIs](https://www.vonage.com/) and Symbl.ai. To use it you will need a Vonage account as well as a Symbl.ai account. Sign up [for free at vonage.com][signup].

For full API documentation refer to [developer.nexmo.com](https://developer.nexmo.com/).

* [Requirements](#requirements)
* [Installation](#installation)

## Requirements

* NodeJS
* A Vonage account
* A Vonage application with Voice Capabilities
* A Symbl.ai account
* A local tunneling service like ngrok or localtunnel

You will need to purchase a Vonage telephone number to use our APIs. We
recommend purchasing a US toll-free number. To do this, use the [Vonage CLI](https://github.com/vonage/vonage-cli)
and run the following command to find a telephone number:

   vonage numbers:search --type=landline-toll-free --features=SMS,VOICE US

Once you have selected a number to use, you can purchase it with:

   vonage numbers:buy <number> US

## Installation

Clone this repository with:

    git clone https://github.com/Vonage-Community/vonage-symbl-hackathon-demo

Once the repository is cloned, install all the dependencies with:

    npm install

The application is a basic web application and requires some configuration. Copy the `.env.dist` file to `.env` and fill in your Vonage API information and your Symbl.ai information.

You will need a Vonage Application with Voice capabilities. The easiest way to create this is to install the `@vonage/cli` package and create a new application from the command line:

    vonage apps:create test-application --voice_answer_url=https://https://5cbc-41-218-222-7.eu.ngrok.io/webhooks/answer --voice_event_url=https://https://5cbc-41-218-222-7.eu.ngrok.io/webhooks/events

* `APP_NAME` is a name for this application. For example, `vonage-symbl-demo`
* `ANSWER_URL` is the URL for the answer webhook for the demo. This will be `https://https://5cbc-41-218-222-7.eu.ngrok.io/webhooks/answer`, where `<domain>` is the domain given to you by your tunneling application
* `EVENT_URL` is the URL for the event webhook for the demo. This will be `https://f153-41-66-227-38.eu.ngrok.io/webhooks/events`, where `<domain>` is the domain given to you by your tunneling application

Once you application is configured, you can link a telephone number to it with:

   vonage apps:link <app-uuid> --number=<number>

[signup]: https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=node-server-sdk
[license]: LICENSE.txt
