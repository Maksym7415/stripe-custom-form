# Prerequerties
- **Add a payment method to your browser.**
    Here you should notice, that when you are using test stripe keys you have to have add fale payment account with region US and test card from stripe. This problem described well here https://stackoverflow.com/questions/55766768/why-does-the-stripe-google-pay-button-not-render-for-me-on-the-ui-despite-not-ha
- **Serve your application over HTTPS.**
    Here you could have some problems with domain, as for me I've hosted it on native linux server via nginx, but when I tried to host with AWS Amplify - it won't work.
    You need to make build and host it(or use ngrok like stripe adviced in link in below this list).
- **Verify your domain with Apple Pay.**
    - for react you have to put "apple-developer-merchantid-domain-association" in "./public/.well-known" (you could find this file in this project by this path)
    - then visit this link "https://dashboard.stripe.com/settings/payments/apple_pay" and click "Add new domain". There you have to only fill your domain where hosted app and click "Add". You don't have to download  verification file from that window

This is link for official stripe docs **https://stripe.com/docs/stripe-js/elements/payment-request-button#react-using-with-connect**

# Restrictions
Google/Apple pay button would displayed only in **Chrome 61+**, **Safari** and **MS Edge**.
Button wouldn't dispay if your browser hasn't payment account.

# Setting config
In **"./src/stripe/config.js"** you have to set your pk_test from stripe and your get client secret url

# Local
All fields names and buttons text are in **"./src/stripe/local.js"**

# Icons
All icons are in **"./src/stripe/images"**
