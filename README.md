# vue-chat-app

A simple real-time chat web application made with Vue.

If you would like to see a demo, I can send you a link.

The `frontend` folder contains the Vue part of the application. The `backend`
folder contains the Ruby on Rails backend.

# systemd

For deployment, and production setups, I use a systemd script to keep the rails
server running. It's located at `/etc/systemd/vue-chat-app.service`.

Taken from: https://gist.github.com/arslan-online/48fd1df0f6a8a7a8e554632c9066178b
