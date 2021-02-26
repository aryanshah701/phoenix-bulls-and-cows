# The purpose of the get_view_function below is inspired by Nat Tuck
# notes 02/09, file game.ex
defmodule Bulls.GameLogic do
  '''
  The module that defines the game logic
  for a game of bulls and cows.
  '''

  # Creates a new game with a random secret
  def create_new_game() do
    # Return a map of secret and guesses
    %{
      secret: compute_random_secret(),
      guesses: [],
      started: false,
      users: [],
      observers: MapSet.new(),
    }
  end

  # Computes a random secret 4 digit number
  def compute_random_secret() do
    # Take four random numbers from 0 to 9
    nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    random_nums = Enum.take_random(nums, 4)

    # Concatentate and return them
    random_nums |> Enum.join("")
  end

  # Adds a user onto the user list
  def add_player(game, user) do
    # Make sure the user doesn't already exist
    if !user_exists(game[:users], user) do
      %{
        secret: game[:secret],
        guesses: game[:guesses],
        started: false,
        users: [[user, false], game[:users]],
        observers: game[:observers],
      }
    else
    # Else just return the game unchanged
      game
    end
  end

  # Checks if a user exists in the given list of users
  def user_exists(users, username) do
    Enum.any?(users, fn (user) -> List.first(user) == username end)
  end

  # Update a given user's status
  def update_status(game, username, status) do
    # Update user's ready value to status
    updated_users = Enum.map(game[:users], 
      fn (user) -> 
        if List.first(user) == username do
          [username, status]
        else
          user
        end
      end)

    # Check if the game can be started with updated user status
    %{
      secret: game[:secret],
      guesses: game[:guesses],
      started: is_game_ready(updated_users),
      users: updated_users,
      observers: game[:observers],
    }
  end

  # Add observer onto the observer list
  def add_observer(game, observer) do
    %{
      secret: game[:secret],
      guesses: game[:guesses],
      started: false,
      users: game[:users],
      observers: MapSet.put(game[:observers], observer),
    }
  end

  # Check if a game is ready to play
  def is_game_ready(users) do
    Enum.all?(users, fn (user) -> List.last(user) end)
  end

  # Adds a guess onto the guess list
  def guess(game, guess, user) do
    # Make sure the user is not an observer
    if !Enum.member?(game[:observers], user) do 
      %{
        secret: game[:secret],
        guesses: [[user, guess] | game[:guesses]],
        started: false,
        users: game[:users],
        observers: game[:observers],
      }
    else
      game
    end

  end

  # Provides the view version of the game
  def get_view_version(game) do
    # Compute the results for each guess
    results = Enum.map(game[:guesses], fn guess -> 
      get_guess_result(game, List.last(guess)) end)
      
    %{
      results: results,
      guesses: game[:guesses],
      won: has_won(game),
    }
  end

  # Computes the resulting cows and bulls for a single guess
  def get_guess_result(game, guess) do
    secret_chars = String.split(game[:secret], "")
    secret_chars = Enum.filter(secret_chars, fn str -> str != "" end)

    guess_chars = String.split(guess, "")
    guess_chars = Enum.filter(guess_chars, fn str -> str != "" end)

    # Compute bulls by checking if 2 nums at the same idx are equal
    bulls = compute_bulls(secret_chars, guess_chars)
    # Compute cows based on numbers both in secret and guess
    cows = Enum.reduce(secret_chars, [], 
    fn(curr, acc) -> 
      if Enum.member?(guess_chars, curr) do 
        [curr | acc] 
      else 
        acc 
      end 
    end)

    # Ensure cows only contains the elements unique from bulls
    cows = cows -- bulls

    # Compute string version and return it
    result = to_string(Kernel.length(cows)) <> "C" <> 
      to_string(Kernel.length(bulls)) <> "B"

    result
  end

  # Computes the bulls given the list of secret and guess nums
  def compute_bulls(secret, guess) do
    compute_bulls_acc(secret, guess, [])
  end

  def compute_bulls_acc(secret, guess, bulls) do
    if secret == [] || guess == [] do
      bulls
    else
      [secret_num | secret_rest] = secret
      [guess_num | guess_rest] = guess
      if secret_num == guess_num do
        compute_bulls_acc(secret_rest, guess_rest, [secret_num | bulls])
      else
        compute_bulls_acc(secret_rest, guess_rest, bulls)
      end

    end
  end

  # Checks whether or not the game has been won
  def has_won(game) do
    secret = game[:secret]
    IO.puts(secret)

    if game[:guesses] == [] do
      false
    else
      last_guess = game[:guesses]
        |> List.first
        |> List.last
      IO.puts(last_guess)
      secret == last_guess
    end
  end

end