function validateTokenMiddleware(token) {
    return function(next) {
      return function(action) {
        // Check if the action has a token property
        if (action.token) {
          // Make a POST request to the validation endpoint with the token in the header
          fetch('http://localhost:8000/validate-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => {
            if (!response.ok) {
              // Token validation failed
              throw new Error('Invalid token');
            }
            return response;
          })
          .then(response => {
            // Token validation succeeded, pass the action to the next middleware
            return next(action);
          })
          .catch(error => {
            console.error(error);
          });
        } else {
          // If the action doesn't have a token property, pass it to the next middleware
          return next(action);
        }
      }
    }
  }
  