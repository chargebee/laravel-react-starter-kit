# Laravel Starter Kit for Billing with Chargebee Cashier

Quickly set up billing in your Laravel application using Chargebee.

## Getting Started

### Installation

Run the following command in your terminal:

```sh
laravel new --using=chargebee/laravel-react-starter-kit
```

Then, navigate to your project folder:

```sh
cd your-project-name
```

### Environment Configuration

- Fill in the Chargebee-related `.env` variables (see `.env.example`).
- ⚠️ **Important**: Run the server on port `8080` or `8443` for Chargebee checkout to work.

## Initial Setup

### Synchronizing Plans

Fetch your plans from Chargebee:

```sh
php artisan chargebee:fetch-plans
```

### Webhook Configuration

Set up a webhook using either of these options:

#### Using Ngrok

Here is a [short tutorial on getting started with Ngrok](https://ngrok.com/docs/getting-started/). 

If ngrok gives you a URL like `https://{abc}.ngrok-free.app`, set your webhook URL as:  
🔗 `https://{abc}.ngrok-free.app/chargebee/webhook`

#### Using Cloudflare Tunnel

Here is a short tutorial on [how to configure tunnel on Cloudflare to test webhook](https://medium.com/@agmmnn/test-your-webhooks-with-cloudflare-tunnel-quickly-5875f74024b4). 

If Cloudflare Tunnel gives you a URL like `https://{your-tunnel-name}.trycloudflare.com`, set your webhook URL as:  
🔗 `https://{your-tunnel-name}.trycloudflare.com/chargebee/webhook`

> **Note:** Don't forget to [add this webhook URL](https://www.chargebee.com/docs/2.0/webhook_settings.html) in your Chargebee dashboard.

## Running Your Application

Start the server:

```sh
php artisan serve
```
