function ValidationNotice({ message }) {
  return (
    <p
      className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
      role="alert"
    >
      {message}
    </p>
  );
}

export default ValidationNotice;
