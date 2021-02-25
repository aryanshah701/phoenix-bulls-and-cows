# The GenServer module design was inspired by Nat Tuck notes
# 0219/hangman/lib/hangman/game_server.ex and Elixir docs
defmodule Bulls.GameServer do
  use GenServer

  alias Bulls.GameLogic
  alias Bulls.BackupAgent
  alias Bulls.GameSupervisor

  # To be able to use game_names instead of pids
  def reg(game_name) do
    {:via, Registry, {Bulls.GameRegistry, game_name}}
  end

  # The function below was implmented using Nat Tuck notes 
  # 0219/hangman/lib/hangman/game_server.ex 

  # Start the supervisor and assign this as a child
   def start_game(game_name) do
    # Defining the child specs and starting the child
    child_specs = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [game_name]},
      restart: :permanent,
      type: :worker
    }
    
    GameSupervisor.start_child(child_specs)
  end

  # Function to start the GenServer link
  def start_link(game_name) do
    # Get backup or create a new game if one doesn't exist
    game = BackupAgent.get_backup(game_name) || GameLogic.create_new_game()

    # Start the process
    GenServer.start_link(
      __MODULE__,
      game,
      name: reg(game_name)
    )
  end

  # Function to make a guess
  def make_guess(game_name, guess) do
    GenServer.call(reg(game_name), {:guess, game_name, guess})
  end

  # Function to reset a game
  def reset(game_name) do
    GenServer.call(reg(game_name), {:reset, game_name})
  end

  # Function to get the current state
  def get_game(game_name) do
    GenServer.call(reg(game_name), {:get, game_name})
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
    {:reply, game, game}
  end

  @impl true
  def handle_call({:reset, game_name}, _from, _game) do
    # Reset the game
    game = GameLogic.create_new_game()

    # Update backup agent
    BackupAgent.update_backup(game_name, game)

    # Respond with new game
    {:reply, game, game}
  end

  @impl true
  def handle_call({:get, _game_name}, _from, game) do
    {:reply, game, game}
  end

end