# Ferengi Rules of Acquisition :: Self-Hosting

[![gh-pages](https://github.com/StevenJDH/Ferengi-Rules-of-Acquisition/actions/workflows/jekyll-gh-pages-workflow.yml/badge.svg?branch=main)](https://github.com/StevenJDH/Ferengi-Rules-of-Acquisition/actions/workflows/jekyll-gh-pages-workflow.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fstevenjdh.github.io%2FFerengi-Rules-of-Acquisition%2F&up_message=operational&down_message=malfunction&style=flat&logo=startrek&logoColor=fcdf01)](https://stevenjdh.github.io/Ferengi-Rules-of-Acquisition/)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/StevenJDH/Ferengi-Rules-of-Acquisition?include_prereleases)
![Maintenance](https://img.shields.io/badge/yes-4FCA21?label=maintained&style=flat)
![GitHub](https://img.shields.io/github/license/StevenJDH/Ferengi-Rules-of-Acquisition)

In this self-hosting section of the repository, there are two container-based projects that serve very distinct purposes. The first is for local development, which is useful for testing changes in the Jekyll site code. The second is for building a standalone microservice that has been optimized for size and performance. This standalone release can run anywhere containers are supported, for example, Kubernetes. Regardless of what project is used, both can help with creating a GitHub Pages-like environment outside of GitHub. In addition, the JSON data powering these projects is available for integration with external REST services, as discussed further below.

[![Buy me a coffee](https://img.shields.io/static/v1?label=Buy%20me%20a&message=coffee&color=important&style=flat&logo=buy-me-a-coffee&logoColor=white)](https://www.buymeacoffee.com/stevenjdh)

## Features

* Mobile-first website that adapts to all devices with a consistent look.
* Uses the same Jekyll build process as GitHub Pages to generate the site.
* Run locally for testing and development with support for Live Reload.
* Run as a standalone, highly optimized microservice in Kubernetes.
* Uses Open Graph (OG) tags for various social media platform previews.
* Install to Desktop (Firefox) and to Apple/Android home screen (A2HS) as a Progressive Web App (PWA).
* Support for browserconfig.xml for Windows tiles and other agents that support it.
* Structured JSON data for external REST service integration.

## Prerequisites

* [Rancher Desktop](https://rancherdesktop.io) installed for local Docker and Kubernetes environments.
* make CLI 3+ installed. Windows users can install from [here](https://gnuwin32.sourceforge.net/packages/make.htm), and add the bin folder to the system `PATH`.

## Usage
All commands have been crafted to run from the root of the `self-hosting` directory, otherwise, they will fail without adjustments. A makefile has been provided to make, pun intended, working with the projects easier. The essential commands are highlighted below, but please review the makefile for any additional ones of interest.

### Local project
To spin up the development environment, use the following command:

```bash
make start # Or 'make start clean=1' to avoid using cached build layers.
make logs
```

The website should now be accessible via `http://localhost:4000`. Any changes made to the files in the `site` directory will be reflected in realtime thanks to the live reload feature.

Once finished, run the following command to shutdown the environment:

```bash
make stop # Or 'make clean' to stop and remove image cache used.
```

### Release project
To build a production ready release that can be hosted outside GitHub Pages, use the following command:

```bash
make release
```

After the release is built, it can be tested with this command:

```bash
make start-release
```

This will expose the site via `http://localhost:8080`. Make sure to use the correct port, which is different than the development one.

## Container registries
The release version of the Ferengi Rules of Acquisition site container image is currently hosted on the following platforms:

* [Docker Hub](https://hub.docker.com/r/stevenjdh/ferengi-rules)
* [Amazon Elastic Container Registry (ECR)](https://gallery.ecr.aws/stevenjdh/ferengi-rules)
* [GitHub Container Registry](https://github.com/users/StevenJDH/packages/container/package/ferengi-rules)

For production use cases, it is not recommended to pull an image with the `:latest` tag, or no tag since these are equivalent.

## External REST service integration
External REST services that want to integrate with the Ferengi Rules of Acquisition data can do so by consuming the following JSON file endpoint:

```text
https://raw.githubusercontent.com/StevenJDH/Ferengi-Rules-of-Acquisition/refs/heads/main/self-hosting/site/assets/data/rules.json
```

**JSON Schema:**

```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Ferengi Rules of Acquisition",
    "description": "A complete consolidated list of all the known Ferengi Rules of Acquisition from the Star Trek universe.",
    "type": "array",
    "minItems": 0,
    "uniqueItems": true,
    "items": {
        "$ref": "#/$defs/RuleGroup"
    },
    "$defs": {
        "RuleGroup": {
            "type": "object",
            "properties": {
                "number": {
                    "type": "number"
                },
                "entries": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "$ref": "#/$defs/RuleEntry"
                    }
                }
            },
            "required": [
                "number",
                "entries"
            ],
            "additionalProperties": false
        },
        "RuleEntry": {
            "type": "object",
            "properties": {
                "rule": {
                    "type": "string"
                },
                "sourceLabel": {
                    "type": "string"
                },
                "sourceURL": {
                    "anyOf": [
                        {
                            "type": "string",
                            "format": "uri"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "sourceType": {
                    "type": "string"
                }
            },
            "required": [
                "rule",
                "sourceLabel",
                "sourceType"
            ],
            "additionalProperties": false
        }
    }
}
```

## Want to show your support?

|Method          | Address                                                                                   |
|---------------:|:------------------------------------------------------------------------------------------|
|PayPal:         | [https://www.paypal.me/stevenjdh](https://www.paypal.me/stevenjdh "Steven's Paypal Page") |
|Cryptocurrency: | [Supported options](https://github.com/StevenJDH/StevenJDH/wiki/Donate-Cryptocurrency)    |


// Steven Jenkins De Haro ("StevenJDH" on GitHub)
