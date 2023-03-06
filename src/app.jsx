import { useMutation, useQuery, useQueryClient } from "react-query";
import { createAnecdote, getAnecdotes } from "./requests";

export function App() {
  const queryClient = useQueryClient();

  const anecdotesResult = useQuery("anecdotes", getAnecdotes, { retry: false });
  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => queryClient.invalidateQueries("anecdotes"),
  });

  const addAnecdote = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    newAnecdoteMutation.mutate(
      { content: formData.get("anecdote"), votes: 0 },
      {
        onSuccess: () => {
          form.reset();
          form.elements.anecdote.focus();
        },
        onError: () => form.elements.anecdote.focus(),
      }
    );
  };

  const vote = (anecdote) => {
    console.log("vote", anecdote);
  };

  if (anecdotesResult.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h1>Anecdotes</h1>
      {null && (
        <div
          role="alert"
          style={{
            border: "solid",
            padding: 10,
            borderWidth: 1,
            marginBottom: 6,
          }}
        ></div>
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
