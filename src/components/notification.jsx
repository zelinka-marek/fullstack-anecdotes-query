export function Notification(props) {
  const { message } = props;

  return (
    <div
      role="alert"
      style={{
        border: "solid",
        padding: 10,
        borderWidth: 1,
        marginBottom: 6,
      }}
    >
      {message}
    </div>
  );
}
