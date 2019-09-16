Rails.application.routes.draw do
  get '/user/:client_token', to: "users#by_client_token"
  resources :users
  post '/chat_room/join', to: "chat_room#join"
  resources :chat_room
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post '/chat/check_in', to: "chat#check_in"
end
