export function App() {
  const anecdotes = [
    {
      content: "If it hurts, do it more often",
      id: "47145",
      votes: 0,
    },
  ];

  const create = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const content = formData.get("anecdote");

    console.log("new anecdote", content);

    form.reset();
    form.elements.anecdote.focus();
  };

  const vote = (anecdote) => {
    console.log("vote", anecdote);
  };

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
      <form onSubmit={create}>
        <input name="anecdote" /> <button type="submit">create</button>
      </form>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}{" "}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
