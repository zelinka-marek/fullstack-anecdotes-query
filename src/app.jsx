import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNotification } from "./context/notification";
import { createAnecdote, getAnecdotes, updateAnecdote } from "./requests";
import { Notification } from "./components/notification";

export function App() {
  const queryClient = useQueryClient();

  const anecdotesResult = useQuery("anecdotes", getAnecdotes, { retry: false });
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => queryClient.invalidateQueries("anecdotes"),
  });
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => queryClient.invalidateQueries("anecdotes"),
  });

  const { notification, notify } = useNotification();

  const addAnecdote = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const content = formData.get("anecdote");

    newAnecdoteMutation.mutate(
      { content: content, votes: 0 },
      {
        onSuccess: () => {
          form.reset();
          form.elements.anecdote.focus();
          notify(`Added "${content}"`);
        },
        onError: () => form.elements.anecdote.focus(),
      }
    );
  };

  const vote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateAnecdoteMutation.mutate(updatedAnecdote, {
      onSuccess: () => notify(`Voted for "${anecdote.content}"`),
    });
  };

  if (anecdotesResult.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      {notification && <Notification message={notification} />}
      <h3>Create Anecdote</h3>
      <form onSubmit={addAnecdote}>
        <input type="text" name="anecdote" required minLength={5} />{" "}
        <button type="submit">create</button>
      </form>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        {anecdotesResult.isLoading ? (
          <p>
            <i>Loading anecdotes...</i>
          </p>
        ) : anecdotesResult.data.length ? (
          anecdotesResult.data.map((anecdote) => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}{" "}
                <button onClick={() => vote(anecdote)}>vote</button>
              </div>
            </div>
          ))
        ) : (
          <p>
            <i>No anecdotes found...</i>
          </p>
        )}
      </div>
    </div>
  );
}
