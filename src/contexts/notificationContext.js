import { createContext, useContext } from 'react';

const NotificationContext = createContext(null);
const useNotificationContext = () => useContext(NotificationContext);

export default { NotificationContext, useNotificationContext };
