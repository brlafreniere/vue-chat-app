# vue-chat-app

A simple real-time chat web application made with Vue.

A demo is available [here](http://vue-chat-app.lizardgizzards.com)

The `frontend` folder contains the Vue part of the application. The `backend`
folder contains the Ruby on Rails backend.

## systemd

For deployment, and production setups, I use a systemd script to keep the rails
server running. It's located at `/etc/systemd/vue-chat-app.service`.

Taken from: https://gist.github.com/arslan-online/48fd1df0f6a8a7a8e554632c9066178b

# Hacking Notes

Things to keep in mind when hacking on this project...

## Cookies

In production, the rails server is unable to read cookies via the `cookies`
hash. You must pass the `client_token` manually every time the Rails backend
needs it.

## API calls

Remember to prepend `process.env.VUE_APP_API_URL` to your URLs, so that
everything works in development and production
