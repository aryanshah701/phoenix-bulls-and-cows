# DynamicSupervisor module implemented using Elixir Docs:
# https://hexdocs.pm/elixir/DynamicSupervisor.html -> Module Based Supervisor
defmodule Bulls.DynamicSupervisor do
  use DynamicSupervisor

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    # Start registry
    {:ok, } = Registry.start_link(keys: :unique, name: Bulls.GameRegistry)
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  # The start_child fucntion was implemented using Nat Tuck notes
  # 0219/hangman/lib/hangman/game_sup.ex  
  def start_child(child_spec) do
    DynamicSupervisor.start_child(__MODULE__, child_spec)
  end

end