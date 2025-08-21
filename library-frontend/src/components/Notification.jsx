import propTypes from 'prop-types';

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{ padding: '10px', background: '#eee', border: '1px solid #ccc', marginBottom: '10px' }}>
      {message}
    </div>
  );
};

Notification.propTypes = {
  message: propTypes.string
};

export default Notification;