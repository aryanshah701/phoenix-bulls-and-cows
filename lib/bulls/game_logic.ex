# The purpose of the get_view_function below is inspired by Nat Tuck
# notes 02/09, file game.ex
defmodule Bulls.GameLogic do
  '''
  The module that defines the game logic
  for a game of bulls and cows.
  '''

  # Creates a new game with a random secret
  def create_new_game() do
    # Return a map of secret and guesses(and other game state)
    %{
      secret: compute_random_secret(),
      guesses: [],
      started: false,
      users: [],
      observers: MapSet.new(),
      scores: [],
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
      # Add user to players and remove from observer
      updated_users = [[user, false] | game[:users]]
      updated_users = Enum.filter(updated_users, 
        fn (user) -> List.flatten(user) != [] end)
      
      updated_observers = MapSet.new(Enum.filter(game[:observers], 
        fn (obs) -> obs != user end))

      %{
        secret: game[:secret],
        guesses: game[:guesses],
        started: false,
        users: updated_users,
        observers: updated_observers,
        scores: game[:scores],
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

  # Checks if a given user is a player
  def is_player(game, username) do
    user_exists(game[:users], username)
  end

  # Update a given user's status, checks if game can be started
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
    # If game can be started, starts the game, and updates scores
    if is_game_ready(updated_users) do 
      IO.puts "Game Ready: Updating scores"
      updated_scores = get_updated_scores(game[:scores], updated_users)
      %{
        secret: game[:secret],
        guesses: game[:guesses],
        started: true,
        users: updated_users,
        observers: game[:observers],
        scores: updated_scores,
      }
    else
      %{
        secret: game[:secret],
        guesses: game[:guesses],
        started: false,
        users: updated_users,
        observers: game[:observers],
        scores: game[:scores],
      }
    end

  end

  # Get updated scores with new players who may have begun playing
  def get_updated_scores(scores, users) do
    # Get the users that are playing the game and don't have scores
    # And add all these users with a score of 0 to the current score list
    new_scores = users
      |> Enum.filter(fn (user) -> List.last(user) end)
      |> Enum.filter(fn (user) -> !score_member?(scores, List.first(user)) end)
      |> Enum.map(fn (user) -> [List.first(user), 0] end)

    # Join the above list with the current scores
    IO.inspect scores
    IO.inspect new_scores  
    scores ++ new_scores
  end

  # Check if the given user is already has a score
  def score_member?(scores, user) do
    Enum.filter(scores, fn (score) -> List.first(score) == user end) != []
  end


  # Add observer onto the observer list
  def add_observer(game, observer) do
    # Add to observers, and remove from users
    updated_observers = MapSet.put(game[:observers], observer)
    updated_users = Enum.filter(game[:users], 
      fn (user) -> 
        List.first(user) != observer 
      end)

    %{
      secret: game[:secret],
      guesses: game[:guesses],
      started: game[:started],
      users: updated_users,
      observers: updated_observers,
      scores: game[:scores]
    }
  end

  # Check if a game is ready to play
  def is_game_ready(users) do
    users != [] && 
      Enum.all?(users, fn (user) -> List.last(user) end)
  end

  # Adds a guess onto the guess list
  def guess(game, guess, user) do
    # Make sure the user is not an observer
    if !Enum.member?(game[:observers], user) do 
      %{
        secret: game[:secret],
        guesses: [[user, guess] | game[:guesses]],
        started: game[:started],
        users: game[:users],
        observers: game[:observers],
        scores: game[:scores]
      }
    else
      game
    end

  end

  def update_scores(game, scores) do
    %{
        secret: game[:secret],
        guesses: game[:guesses],
        started: game[:started],
        users: game[:users],
        observers: game[:observers],
        scores: scores,
    }
  end

  # Provides the view version of the game
  def get_view_version(game) do
    # Compute the results for each guess
    results = Enum.map(game[:guesses], fn guess -> 
      get_guess_result(game, List.last(guess)) end)

    # Remove any empty users
    updated_users = Enum.filter(game[:users], 
      fn (user) -> List.flatten(user) != [] end)

    # If game has been won, update winner and scores
    if has_won(game) do
      winner = get_winner(game)
      updated_scores = update_winners_score(game[:scores], winner)
      %{
        results: results,
        guesses: game[:guesses],
        won: true,
        users: updated_users,
        observers: MapSet.to_list(game[:observers]),
        started: game[:started],
        winner: get_winner(game),
        scores: updated_scores,
      }
    else
      %{
        results: results,
        guesses: game[:guesses],
        won: false,
        users: updated_users,
        observers: MapSet.to_list(game[:observers]),
        started: game[:started],
        winner: "",
        scores: game[:scores],
      }
    end
    
  end

  # Updates the winner's score to be +1
  def update_winners_score(scores, winner) do
    Enum.map(scores, 
      fn (score) ->
        if (List.first(score) == winner) do
          [List.first(score), List.last(score) + 1]
        else
          score
        end
      end
    )
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

  # Get winner if there is a winner
  def get_winner(game) do
    if has_won(game) do
      game[:guesses]
        |> List.first
        |> List.first
    else
      ""
    end
  end

  # Removes a user from the game state
  def remove_user(game, username) do
    # Remove from both the observer and user list
    updated_observers = MapSet.new(Enum.filter(game[:observers], 
        fn (obs) -> obs != username end))

    updated_users = Enum.filter(game[:users], 
      fn (user) -> 
        List.first(user) != username 
      end)
    
    # Return updated game state
    %{
      secret: game[:secret],
      guesses: game[:guesses],
      started: game[:started],
      users: updated_users,
      observers: updated_observers,
      scores: game[:scores],
    }
  end

  # Resets everything but the score
  def reset(game) do
    %{
        secret: compute_random_secret(),
        guesses: [],
        started: false,
        users: [],
        observers: MapSet.new(),
        scores: game[:scores],
    }
  end

end