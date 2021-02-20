defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  # Use game logic module
  alias Bulls.GameLogic

  @impl true
  def join("game:" <> _id, payload, socket) do
    if authorized?(payload) do
      # Create a new game
      game = GameLogic.create_new_game()
      
      # Update socket to hold that new game
      socket = assign(socket, :game, game)

      # Create view version of game(results, and guesses)
      view_game = GameLogic.get_view_version(game)

      {:ok, view_game, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Handle guess request
  @impl true
  def handle_in("guess", %{"guess" => guess}, socket) do
    # Update game state and socket
    game = GameLogic.guess(socket.assigns[:game], guess)
    socket = assign(socket, :game, game)

    # Update view game for reply
    view_game = GameLogic.get_view_version(game)

    {:reply, {:ok, view_game}, socket}
  end

  # Handle reset request
  @impl true
  def handle_in("reset", _, socket) do
    # Create a new game and new view_game to respond with
    # Create a new game
    game = GameLogic.create_new_game()
    
    # Update socket to hold that new game
    socket = assign(socket, :game, game)

    # Create view version of game(results, and guesses)
    view_game = GameLogic.get_view_version(game)

    {:reply, {:ok, view_game}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
