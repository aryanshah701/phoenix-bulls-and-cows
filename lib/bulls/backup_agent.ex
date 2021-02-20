# Inspired and taken from Nat tuck notes 02/12 backup_agent.ex
defmodule Bulls.BackupAgent do
  use Agent

  def init_link(_) do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def update_backup(key, value) do
    Agent.update(__MODULE__, fn backup -> Map.put(backup, key, value))
  end

  def get_backup(key) do
    Agent.get(__MODULE__, fn backup -> Map.get(backup, key))
  end

end