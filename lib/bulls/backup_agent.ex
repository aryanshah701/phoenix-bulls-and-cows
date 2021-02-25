# Inspired and taken from Nat tuck notes 02/12 backup_agent.ex
defmodule Bulls.BackupAgent do
  use Agent

  def start_link(_) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def update_backup(key, value) do
    Agent.update(__MODULE__, fn backup -> Map.put(backup, key, value) end)
  end

  def get_backup(key) do
    Agent.get(__MODULE__, fn backup -> 
      IO.puts("From Agent")
      IO.puts(key)
      game = Map.get(backup, key)
      IO.puts(game[:secret])
      IO.inspect(game[:guesses])
      Map.get(backup, key) 
    end)
  end

end