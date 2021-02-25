# The GenServer module design was inspired by Nat Tuck notes
# 0219/hangman/lib/hangman/game_server.ex and Elixir docs
defmodule Bulls.GenServer do
  use GenServer

  alias Bulls.GameLogic
  alias Bulls.BackupAgent
  alias Bulls.DynamicSupervisor

  # The function below was implmented using Nat Tuck notes 
  # 0219/hangman/lib/hangman/game_server.ex 
  # Start the supervisor and assign this as a child
  def start_game(game_name) do
    # Start the supervisor and link
    child_spcification = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [game_name]},
      restart: :permanent,
      type: :worker
    }

    # Start the child
    DynamicSupervisor.start_child(child_spcification)
  end

  # To be able to use game_names instead of pids
  def reg(game_name) do
    {:via, Registry, {Bulls.GameRegistry, game_name}}
  end

  # Function to start the GenServer link
  def start_link(game_name) do
    # Check if game exists in backup agent before creating a new game
    game = BackupAgent.get_backup(game_name) || GameLogic.create_new_game
    
    # Start the link with the game state
    GenServer.start_link(
      __MODULE__,
      game,
      game_name: reg(game_name)
    )
  end

  # Function to make a guess
  def make_guess(game_name, guess) do
    GenServer.call(reg(game_name), {:guess, game_name, guess})
  end

  # Function to reset a game
  def make_guess(game_name, guess) do
    GenServer.call(reg(game_name), {:reset, game_name})
  end

  # GenServer Implementation
  # GenServer Implementation implemented using Elixir Docs:
  # https://hexdocs.pm/elixir/GenServer.html -> Example

  @impl true
  def init(game) do
    {:ok, game}
  end

  @impl true
  def handle_call({:guess, game_name, guess}, _from, game) do
    # Make a guess
    game = GameLogic.guess(game, guess)

    # Update backup agent
    BackupAgent.update_backup(game_name, game)

    # Respond with new game
    {:reply, game}
  end

  @impl true
  def handle_call({:reset, game_name}, _from, game) do
    # Reset the game
    game = GameLogic.create_new_game()

    # Update backup agent
    BackupAgent.update_backup(game_name, game)

    # Respond with new game
    {:reply, game}
  end

  @impl true
  def handle_cast({:push, element}, state) do
    {:noreply, [element | state]}
  end



end