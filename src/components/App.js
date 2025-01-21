import React, { useEffect, useState } from 'react';
import { getUser } from '../services/api';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser().then(data => setUser(data)).catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Frontend Connected to Backend</h1>
            {user ? <p>User: {user.name}</p> : <p>Loading...</p>}
        </div>
    );
};

export default App;
