import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createAnecdote, getAnecdotes, updateAnecdote } from "./requests";

export function App() {
  const [notification, setNotification] = useState(null);

  const notify = (notification) => {
    setNotification(notification);
    setTimeout(() => setNotification(null), 2500);
  };

  const queryClient = useQueryClient();

  const anecdotesResult = useQuery("anecdotes", getAnecdotes, { retry: false });
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => queryClient.invalidateQueries("anecdotes"),
  });
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => queryClient.invalidateQueries("anecdotes"),
  });

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
          notify(`Added ${content}`);
        },
        onError: () => form.elements.anecdote.focus(),
      }
    );
  };

  const vote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateAnecdoteMutation.mutate(updatedAnecdote, {
      onSuccess: () => notify(`Voted for ${anecdote.content}`),
    });
  };

  if (anecdotesResult.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      {notification && (
        <div
          role="alert"
          style={{
            border: "solid",
            padding: 10,
            borderWidth: 1,
            marginBottom: 6,
          }}
        >
          {notification}
        </div>
      )}
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
