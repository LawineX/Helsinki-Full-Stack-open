const Notification = ({ message, isProblem = false }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={isProblem ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Notification
