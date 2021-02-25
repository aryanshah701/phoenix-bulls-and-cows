# Backup agent logic inspired from Nat tuck notes 02/12 game_channel.ex
defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  # Use game logic module
  alias Bulls.GameLogic

  # Use the GenServer
  alias Bulls.GameServer

  # Handle join channel request
  @impl true
  def join("game:" <> game_name, payload, socket) do
    if authorized?(payload) do
      # Create a new game through GenServer
      GameServer.start_game(game_name)
      game = GameServer.get_game(game_name)

      IO.puts('Channel name')
      IO.puts(game_name)

      IO.puts('Secret')
      IO.puts(game[:secret])
      
      # Update socket to hold the game name and empty username
      socket = assign(socket, :game, game_name)
      socket = assign(socket, :user, "")

      # Create view version of game(results, and guesses)
      view_game = GameLogic.get_view_version(game)

      {:ok, view_game, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Handle login request
  @impl true
  def handle_in("login", %{"name" => username}, socket) do
    # Populate socket with the username(replace "")
    socket = assign(socket, :user, username)

    # Respond with view
    game_name = socket.assigns[:game]
    game = GameServer.get_game(game_name)
    view_game = GameLogic.get_view_version(game)

    {:reply, {:ok, view_game}, socket}
  end

  # Handle guess request
  @impl true
  def handle_in("guess", %{"guess" => guess}, socket) do
    # Update game state through GenServer
    game_name = socket.assigns[:game]
    user = socket.assigns[:user]
    GameServer.make_guess(game_name, guess, user)
    game = GameServer.get_game(game_name)

    # Update view game for reply
    view_game = GameLogic.get_view_version(game)

    # Broadcast state update to all players connected to this channel
    IO.puts(socket.topic)
    broadcast_from(socket, "view", view_game)

    {:reply, {:ok, view_game}, socket}
  end

  # Handle reset request
  @impl true
  def handle_in("reset", _, socket) do
    # Reset game through GenServer
    game_name = socket.assigns[:game]
    GameServer.reset(game_name)
    game = GameServer.get_game(game_name)

    # Create view version of game(results, and guesses)
    view_game = GameLogic.get_view_version(game)

    # Broadcast state update to all players connected to this channel
    broadcast_from(socket, "view", view_game)

    {:reply, {:ok, view_game}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
