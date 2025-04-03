# Laravel Starter Kit for Billing with Chargebee Cashier

Quickly set up billing in your Laravel app using Chargebee.

## Installation
Run the following command in your terminal:
```sh
laravel new --using=chargebee/react-starter-kit
```  
Then, navigate to your project folder:
```sh
cd your-project-name
```  

## Setup
- Fill in the Chargebee-related `.env` variables (see `.env.example`).
- ⚠️ **Run the server on port `8080` or `8443` for Chargebee checkout to work.**
- Fetch your plans from Chargebee:
  ```sh
  php artisan chargebee:fetch-plans
  ```  
- Set up a webhook using **ngrok** or **Cloudflare Tunnel**. If ngrok gives you a URL like `https://{abc}.ngrok-free.app`, set your webhook URL as:  
  🔗 `https://{abc}.ngrok-free.app/chargebee/webhook`  
  Add this in your Chargebee dashboard.
- Start the server:
  ```sh
  php artisan serve
  ```
